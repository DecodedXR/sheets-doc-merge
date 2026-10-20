---
title: How to generate PDFs and certificates from Google Sheets (free)
description: Create one PDF per row of a Google Sheet from a Google Docs template, and email each one. Free, open-source Apps Script, no add-on and no monthly limit.
image: https://decodedxr.github.io/sheets-doc-merge/assets/cover.png
---
{% raw %}

# How to generate PDFs and certificates from Google Sheets (free)

You have a list in Google Sheets (course attendees, clients, employees) and you need one document per person: a certificate, an invoice, a letter. Google Sheets and Google Docs can do this together with one short Apps Script file. You don't need Autocrat or a paid add-on, and there's no monthly document cap.

This guide uses [Sheets Doc Merge](https://github.com/DecodedXR/sheets-doc-merge), a free, MIT-licensed script. Setup takes about 5 minutes.

## What you need

- A Google account (personal Gmail or Google Workspace)
- A Google Sheet with one row per document
- A Google Doc to use as the template

## Step 1: Make the template in Google Docs

Design the document the way you want every copy to look: logo, fonts, borders, signature image. Wherever a value should change per row, type the column name in double braces:

> This certifies that **{{Name}}** completed **{{Course}}** on {{Date}}.

Placeholders work in the body, header and footer, and they keep the formatting you give them. For a certificate, set **File → Page setup** to landscape.

## Step 2: Set up your sheet

Put headers in **row 1** that match your placeholders exactly. Two optional columns do extra work:

| Name | Course | Date | File Name | Email |
|---|---|---|---|---|
| Ana Lopez | First Aid | Oct 24, 2026 | Certificate - Ana Lopez | ana@example.com |
| Ben Okafor | First Aid | Oct 24, 2026 | Certificate - Ben Okafor | ben@example.com |

- **File Name** names each PDF. Without it, files are named after the template and row number.
- **Email** is where each PDF is sent, if you choose to email them.

Values come through exactly as the sheet displays them, so format dates and amounts in the sheet first.

## Step 3: Add the script

1. In the sheet, open **Extensions → Apps Script**.
2. Delete the placeholder code.
3. Paste in the contents of [`Code.gs`](https://github.com/DecodedXR/sheets-doc-merge/blob/main/Code.gs) and click **Save**.
4. Reload the sheet. A **📄 Doc Merge** menu appears.

## Step 4: Create the PDFs

Choose **📄 Doc Merge → Create PDFs** and paste the link to your template. The first time, Google asks for permission. Because it's your own unpublished script, it shows "Google hasn't verified this app": click **Advanced → Go to (your project name) → Allow**.

The PDFs are saved in a new Drive folder next to the template, and a **Merged PDF** column in the sheet links to each one.

## Step 5 (optional): Email each PDF

1. In Gmail, compose the email as a draft. Placeholders work here too: `Your {{Course}} certificate`.
2. Choose **📄 Doc Merge → Create PDFs and Email Them** and type the draft's subject line.

Every row with an email address gets its own PDF attached.

## Large lists

- Google stops a script after 6 minutes, which is roughly 100 PDFs. The script stops just before that and asks you to run it again. Rows that already have a PDF are skipped, so nothing is made twice.
- Gmail limits scripts to about 100 recipients a day on a personal account and 1,500 on Google Workspace ([Google's quotas](https://developers.google.com/apps-script/guides/services/quotas)).
- A row marked `ERROR: ...` is retried on the next run.

## FAQ

**Is it free?** Yes. It's MIT licensed and runs on your own Google account.

**How is it different from Autocrat?** Autocrat is a free but closed-source add-on with its own job setup screens. This is one readable script inside your sheet: no add-on gets access to your Drive, and you can change anything.

**Can I make invoices with it?** Yes. Put `{{Invoice Number}}`, `{{Amount}}` and similar placeholders in the Doc and give each row a File Name like `Invoice 1042`.

**Can I keep Google Docs instead of PDFs?** The script exports PDFs and removes the temporary Doc. To keep the Docs, delete the `copy.setTrashed(true);` line.

**Can I redo one row?** Clear its Merged PDF cell and run it again.

---

[Get the script on GitHub](https://github.com/DecodedXR/sheets-doc-merge) · Also free: [Mail Merge for Google Sheets](https://decodedxr.github.io/sheets-mail-merge/free-mail-merge-google-sheets.html) · [Deadline reminders from Google Sheets](https://decodedxr.github.io/sheets-deadline-reminders/automatic-email-reminders-google-sheets.html)
{% endraw %}
