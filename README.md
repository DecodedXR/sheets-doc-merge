# Free Doc Merge for Google Sheets (open-source Autocrat alternative)

![Free Doc Merge for Google Sheets](assets/cover.png)

Turn every row of a Google Sheet into its own PDF, built from a Google Docs template, and optionally email each PDF to that row. Certificates, invoices, letters, offer letters, report cards. One Apps Script file: no add-on, no monthly cap, no subscription. Your data never leaves your Google account.

- `{{Column Name}}` placeholders anywhere in the Doc (body, header or footer) and the template's fonts, images and layout are kept
- Name each file from a **File Name** column
- **Create PDFs and Email Them** attaches each PDF to a personalized Gmail draft
- A **Merged PDF** column links every file, so re-running only does the rows that are left

New to this? Read the [step-by-step guide](https://decodedxr.github.io/sheets-doc-merge/generate-pdfs-certificates-from-google-sheets.html).

## One-time setup (5 minutes)

1. Make the template in **Google Docs**. Type placeholders that match your column headers, for example `This certifies that {{Name}} completed {{Course}} on {{Date}}.`
2. In your sheet, put **headers in row 1**. Optional: a **File Name** column and an **Email** column.
3. **Extensions → Apps Script**, delete the placeholder code, paste in `Code.gs`, save.
4. Reload the sheet. A **📄 Doc Merge** menu appears.
5. Choose **📄 Doc Merge → Create PDFs** and paste the template's link. Google asks for permission the first time ("Google hasn't verified this app" → **Advanced → Go to (your project name) → Allow**; it's your own script).

The PDFs go into a new Drive folder next to the template, named "*template name* - merged PDFs".

## Emailing the PDFs

1. In **Gmail**, compose the email as a draft, with placeholders if you like: `Your certificate, {{Name}}`. Leave it in Drafts.
2. Choose **📄 Doc Merge → Create PDFs and Email Them** and type the draft's subject line.

Each row with an **Email** gets its own PDF attached.

## Notes

- Rows with a link in **Merged PDF** are skipped. Clear the cell to make that row again. Rows marked `ERROR: ...` are retried on the next run.
- Google stops scripts after 6 minutes, roughly 100 PDFs. The script stops just before that and tells you to run it again; it continues where it left off.
- Gmail's daily limit is about 100 recipients on a personal account and 1,500 on Google Workspace.
- Use **Change Template** to switch to a different Doc. That also starts a new output folder.
- Values appear as they display in the sheet, so format dates and currency in the sheet the way you want them printed.

## More free Sheets tools

- [Sheets Mail Merge](https://github.com/DecodedXR/sheets-mail-merge): a personalized email to every row.
- [Sheets Deadline Reminders](https://github.com/DecodedXR/sheets-deadline-reminders): automatic emails before a due date.

## License

MIT. See `LICENSE`.
