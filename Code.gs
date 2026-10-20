/**
 * Doc Merge for Google Sheets: one PDF per row from a Google Docs template,
 * optionally emailed to that row. Certificates, invoices, letters, offer letters.
 *
 * Setup: header row in the sheet. Put {{Column Name}} placeholders in a Google Doc
 * (body, header or footer). Optional columns: "File Name" (names each PDF) and
 * "Email" (used by "Create PDFs and Email Them"). A "Merged PDF" column records
 * each row's PDF link, so re-running skips finished rows.
 */

const EMAIL_COL = 'Email';
const NAME_COL = 'File Name';
const STATUS_COL = 'Merged PDF';
const TIME_LIMIT_MS = 5 * 60 * 1000; // Apps Script stops at 6 minutes; leave headroom

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📄 Doc Merge')
    .addItem('Create PDFs', 'createPdfs')
    .addItem('Create PDFs and Email Them', 'createAndEmail')
    .addItem('Change Template', 'changeTemplate')
    .addToUi();
}

function createPdfs() { merge_(false); }
function createAndEmail() { merge_(true); }

function changeTemplate() {
  PropertiesService.getDocumentProperties().deleteAllProperties();
  getTemplate_(SpreadsheetApp.getUi());
}

function merge_(email) {
  const ui = SpreadsheetApp.getUi();
  const template = getTemplate_(ui);
  if (!template) return;
  const draft = email ? pickDraft_(ui) : null;
  if (email && !draft) return;

  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getDisplayValues();
  const headers = data[0];
  const emailIdx = headers.indexOf(EMAIL_COL);
  const nameIdx = headers.indexOf(NAME_COL);
  if (email && emailIdx === -1) {
    ui.alert('No "' + EMAIL_COL + '" column found in row 1.');
    return;
  }
  let statusIdx = headers.indexOf(STATUS_COL);
  if (statusIdx === -1) {
    statusIdx = headers.length;
    sheet.getRange(1, statusIdx + 1).setValue(STATUS_COL);
  }

  const folder = getFolder_(template);
  const msg = draft && draft.getMessage();
  const start = Date.now();
  let quota = email ? MailApp.getRemainingDailyQuota() : Infinity;
  let made = 0, skipped = 0, stopped = '';

  for (let r = 1; r < data.length; r++) {
    const row = data[r];
    const status = String(row[statusIdx] || '');
    const to = emailIdx === -1 ? '' : String(row[emailIdx]).trim();
    // Skip blank rows and finished rows; rows marked ERROR are retried.
    if (row.every(v => v === '') || (status && !status.startsWith('ERROR'))) { skipped++; continue; }
    if (email && !to) { skipped++; continue; }
    if (Date.now() - start > TIME_LIMIT_MS) { stopped = 'time'; break; }
    if (quota <= 0) { stopped = 'quota'; break; }

    try {
      const name = (nameIdx !== -1 && row[nameIdx]) || template.getName() + ' - row ' + (r + 1);
      const pdf = makePdf_(template, folder, name, headers, row);
      if (email) {
        GmailApp.sendEmail(to, fill_(msg.getSubject(), headers, row), '', {
          htmlBody: fill_(msg.getBody(), headers, row, true),
          attachments: [pdf.getBlob()].concat(msg.getAttachments({ includeInlineImages: false })),
        });
        quota--;
      }
      sheet.getRange(r + 1, statusIdx + 1).setValue(pdf.getUrl());
      made++;
    } catch (e) {
      sheet.getRange(r + 1, statusIdx + 1).setValue('ERROR: ' + e.message);
    }
  }

  const more = stopped === 'time' ? '\n\nStopped before Google\'s 6-minute limit. Run it again to continue; finished rows are skipped.'
    : stopped === 'quota' ? '\n\nGmail\'s daily sending limit was reached. Run it again tomorrow; finished rows are skipped.' : '';
  ui.alert('Done. ' + (email ? 'Created and emailed: ' : 'Created: ') + made + ', skipped: ' + skipped +
    '\nPDFs are in the Drive folder "' + folder.getName() + '".' + more);
}

/** Copy the template, fill placeholders, export as PDF into the folder, trash the copy. */
function makePdf_(template, folder, name, headers, row) {
  const copy = template.makeCopy(name, folder);
  try {
    const doc = DocumentApp.openById(copy.getId());
    [doc.getBody(), doc.getHeader(), doc.getFooter()].forEach(section => {
      if (section) replacePlaceholders_(section, headers, row);
    });
    doc.saveAndClose();
    return folder.createFile(copy.getAs(MimeType.PDF).setName(name + '.pdf'));
  } finally {
    copy.setTrashed(true);
  }
}

/** Replace each {{Column}} in place so the template's formatting is kept. */
function replacePlaceholders_(section, headers, row) {
  let found;
  while ((found = section.findText('\\{\\{[^}]+\\}\\}'))) {
    const text = found.getElement().asText();
    const start = found.getStartOffset();
    const end = found.getEndOffsetInclusive();
    // ponytail: "{{" in a cell value is broken up so the loop can't re-match it
    const value = fill_(text.getText().substring(start, end + 1), headers, row).replace(/\{\{/g, '{ {');
    text.deleteText(start, end);
    if (value) text.insertText(start, value);
  }
}

/** Fill {{Column}} placeholders from a row; unknown columns become empty. */
function fill_(s, headers, row, escape) {
  return s.replace(/{{\s*([^}]+?)\s*}}/g, (_, name) => {
    const i = headers.indexOf(name.trim());
    const v = i === -1 ? '' : String(row[i]);
    return escape ? escapeHtml_(v) : v;
  });
}

function getTemplate_(ui) {
  const props = PropertiesService.getDocumentProperties();
  let id = props.getProperty('templateId');
  if (!id) {
    const resp = ui.prompt('Doc Merge', 'Paste the link to your Google Docs template:', ui.ButtonSet.OK_CANCEL);
    if (resp.getSelectedButton() !== ui.Button.OK) return null;
    const m = resp.getResponseText().match(/[-\w]{25,}/);
    if (!m) { ui.alert('That doesn\'t look like a Google Docs link.'); return null; }
    id = m[0];
  }
  try {
    const file = DriveApp.getFileById(id);
    if (file.getMimeType() !== MimeType.GOOGLE_DOCS) throw new Error('not a Google Doc');
    props.setProperty('templateId', id);
    return file;
  } catch (e) {
    props.deleteProperty('templateId');
    ui.alert('Couldn\'t open that template (' + e.message + '). Check the link and that you can open it.');
    return null;
  }
}

/** One output folder per template, next to it in Drive; reused on later runs. */
function getFolder_(template) {
  const props = PropertiesService.getDocumentProperties();
  const id = props.getProperty('folderId');
  if (id) {
    try {
      const f = DriveApp.getFolderById(id);
      if (!f.isTrashed()) return f;
    } catch (e) { /* deleted: make a new one */ }
  }
  const parents = template.getParents();
  const parent = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();
  const folder = parent.createFolder(template.getName() + ' - merged PDFs');
  props.setProperty('folderId', folder.getId());
  return folder;
}

/** Let the user pick which Gmail draft is the email template, by subject line. */
function pickDraft_(ui) {
  const drafts = GmailApp.getDrafts();
  if (!drafts.length) {
    ui.alert('No Gmail drafts found. Compose the email as a draft in Gmail first.');
    return null;
  }
  const resp = ui.prompt('Doc Merge',
    'Type the subject line of the Gmail draft to send with each PDF:\n\n' +
    drafts.slice(0, 15).map(d => '• ' + d.getMessage().getSubject()).join('\n'),
    ui.ButtonSet.OK_CANCEL);
  if (resp.getSelectedButton() !== ui.Button.OK) return null;
  const wanted = resp.getResponseText().trim().toLowerCase();
  const match = drafts.find(d => d.getMessage().getSubject().trim().toLowerCase() === wanted);
  if (!match) ui.alert('No draft with that subject found.');
  return match;
}

function escapeHtml_(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
