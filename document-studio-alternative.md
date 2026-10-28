---
title: "A free Document Studio alternative: PDFs from Google Sheets, no 25-a-month cap"
description: Turn every Google Sheets row into a PDF from a Google Docs template and email it, free, with no monthly document quota. An honest comparison with Document Studio.
image: https://decodedxr.github.io/sheets-doc-merge/assets/cover.png
---
{% raw %}

# A free Document Studio alternative: PDFs from Google Sheets, no 25-a-month cap

[Document Studio](https://digitalinspiration.com/docs/document-studio) by Digital Inspiration generates documents from Google Sheets rows and Google Form responses. On [its pricing page](https://digitalinspiration.com/docs/document-studio/pricing) (checked October 2026):

- **Free:** 25 documents and 25 emails a month.
- **Standard:** $79 a year per user, for 500 documents a day.
- **Enterprise:** $99 a year per user, for 2,000 documents a day.

If you need "one PDF per row from a Google Docs template, emailed to each person", a free script does it with no monthly document quota.

## Side by side

| | Document Studio | Free Sheets Doc Merge |
|---|---|---|
| Price | Free up to 25 a month, then $79–99 a year per user | Free (MIT license) |
| Documents | 25 a month free; 500 or 2,000 a day paid | No quota of its own (about 100 PDFs per run; run again to continue) |
| Emails | 25 a month free; 500 or 2,000 a day paid | Gmail's script limit: about 100 a day on personal Gmail, 1,500 on Workspace |
| Google Docs template with `{{placeholders}}` | Yes | Yes, in the body, header and footer |
| PDF per row, named from a column | Yes | Yes, from a **File Name** column |
| Email each PDF | Yes | Yes, attached to a personalized Gmail draft |
| From Google Form responses as they arrive | Yes | Run it on the response sheet (not automatic per submission) |
| QR codes, charts, conditional content, signatures, integrations | Paid editions | No |
| How it's installed | Workspace add-on | One script in your sheet; your data stays in your Google account |

## When Document Studio is the better buy

- You need documents generated **automatically on each form submission**, or extras like QR codes, conditional sections, e-signatures or Slack and Trello integrations.
- You'd rather click through a sidebar than paste a script.

## Set up the free merge (5 minutes)

1. Make the template in Google Docs with placeholders matching your column headers: `This certifies that {{Name}} completed {{Course}}.`
2. In your sheet: **Extensions → Apps Script**, paste in [this `Code.gs`](https://github.com/DecodedXR/sheets-doc-merge/blob/main/Code.gs), and save.
3. Choose **📄 Doc Merge → Create PDFs** (or **Create PDFs and Email Them**).

The full walkthrough is in the [step-by-step guide](generate-pdfs-certificates-from-google-sheets.html). It also works for [invoices](create-invoices-from-google-sheets.html).

---

[Get the script on GitHub](https://github.com/DecodedXR/sheets-doc-merge) · [Step-by-step guide](generate-pdfs-certificates-from-google-sheets.html) · [Autocrat comparison](autocrat-alternative.html) · [More free Google Sheets scripts](https://decodedxr.github.io/free-google-sheets-scripts/)
{% endraw %}
