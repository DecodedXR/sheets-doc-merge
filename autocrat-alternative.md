---
title: An open-source Autocrat alternative for Google Sheets (PDFs from a Docs template)
description: Autocrat is free but closed source. Sheets Doc Merge is an MIT-licensed script that merges Sheets rows into a Google Docs template, exports PDFs and emails them.
image: https://decodedxr.github.io/sheets-doc-merge/assets/cover.png
---
{% raw %}

# An open-source Autocrat alternative for Google Sheets

[Autocrat](https://workspace.google.com/marketplace/app/autocrat/539341275670) is a long-standing free add-on that merges Google Sheets rows into Docs templates, and many schools and offices rely on it. It's free to use but closed source ([AlternativeTo lists it as proprietary](https://alternativeto.net/software/autocrat/about/), checked October 2026). Other doc-merge add-ons often cap free use: one popular alternative's free plan stops at 10 documents at a time and 150 a month.

If you'd rather run something you can read, change and keep, [Sheets Doc Merge](https://github.com/DecodedXR/sheets-doc-merge) does the core job in one MIT-licensed Apps Script file.

## What it does

- Fills `{{Column Name}}` placeholders in a **Google Docs template** (body, header, footer and tables), keeping the template's formatting
- Exports **one PDF per row** into a Drive folder next to the template
- Names each PDF from a **File Name** column
- Optionally **emails each PDF** to the row's address, with a Gmail draft as the message
- Records each PDF's link in a **Merged PDF** column, so re-runs only do new rows and large sheets continue past Google's 6-minute script limit

## Compared with Autocrat

| | Autocrat | Sheets Doc Merge |
|---|---|---|
| Price | Free | Free (MIT) |
| Source | Closed | Open: one readable file in your own sheet |
| Setup | Job wizard inside the add-on | A menu; paste the template link |
| Output | Docs and PDFs, many options | PDFs (keep the Docs with a one-line change) |
| Triggers on form submit / schedule | Yes | No: you run it from the menu |
| Placeholder syntax | `<<Column>>` | `{{Column}}` |

Autocrat has more options, especially form-submit triggers. Sheets Doc Merge is simpler and fully under your control. If you use Autocrat's `<<Column>>` tags, find-and-replace them to `{{Column}}` in your template.

## Get started

The [step-by-step guide](generate-pdfs-certificates-from-google-sheets.html) covers the setup in about 5 minutes. For invoices specifically, see [creating invoices from Google Sheets](create-invoices-from-google-sheets.html).

---

[Get the script on GitHub](https://github.com/DecodedXR/sheets-doc-merge) · [More free Google Sheets scripts](https://decodedxr.github.io/free-google-sheets-scripts/)
{% endraw %}
