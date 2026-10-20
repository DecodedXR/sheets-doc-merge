---
title: How to create invoices from Google Sheets automatically (free)
description: Turn each row of a Google Sheet into a PDF invoice from your own Google Docs template, and email it to the client. Free, open-source Apps Script, no add-on.
---
{% raw %}

# How to create invoices from Google Sheets automatically (free)

If you already track work or orders in Google Sheets, you don't need invoicing software to send the invoices. With a Google Docs invoice template and one free Apps Script, every row becomes a PDF invoice, saved to Drive and optionally emailed to the client with a personal message.

This uses [Sheets Doc Merge](https://github.com/DecodedXR/sheets-doc-merge), which is free and MIT licensed. Setup takes about 10 minutes, including the template.

## Step 1: Lay out the invoice sheet

One row per invoice. Format numbers and dates in the sheet the way they should print, because the invoice shows exactly what the cell displays. Use **Format → Number → Currency** for amounts.

| Invoice Number | Client | Email | Issue Date | Due Date | Description | Amount | File Name |
|---|---|---|---|---|---|---|---|
| 1042 | Northwind Ltd | billing@northwind.example | Oct 20, 2026 | Nov 19, 2026 | Website redesign, phase 1 | $2,400.00 | Invoice 1042 - Northwind |
| 1043 | Contoso | ap@contoso.example | Oct 20, 2026 | Nov 19, 2026 | Monthly support, October | $650.00 | Invoice 1043 - Contoso |

**File Name** names each PDF. **Email** is only needed if you want the script to send them.

Tip: compute fields with formulas so nothing is typed twice. For example, Due Date `=D2+30`, or a Total column `=G2*1.2` that includes tax.

## Step 2: Make the invoice template in Google Docs

Create a Google Doc that looks like your invoice: logo, your business details, payment instructions. Wherever a value comes from the sheet, type the column name in double braces:

> **INVOICE #{{Invoice Number}}**
>
> Bill to: {{Client}}
> Issued: {{Issue Date}} · Due: {{Due Date}}
>
> | Description | Amount |
> |---|---|
> | {{Description}} | {{Amount}} |

Placeholders work in the body, tables, the header and the footer, and they keep whatever formatting you give them. A bold `{{Amount}}` prints the amount in bold.

## Step 3: Add the script

1. In the sheet: **Extensions → Apps Script**.
2. Delete the placeholder code, paste in [`Code.gs`](https://github.com/DecodedXR/sheets-doc-merge/blob/main/Code.gs), and **Save**.
3. Reload the sheet. A **📄 Doc Merge** menu appears.

## Step 4: Create the invoices

Choose **📄 Doc Merge → Create PDFs** and paste the link to the invoice template. Approve Google's permission prompt the first time ("Google hasn't verified this app" → **Advanced → Go to (your project name) → Allow**; it's your own script).

Each row becomes a PDF in a Drive folder next to the template, and a **Merged PDF** column links to it. Open one or two to check the layout before sending anything.

## Step 5: Email them to clients

1. In Gmail, write the cover email as a draft:
   > **Subject:** `Invoice {{Invoice Number}} from Your Company`
   >
   > Hi, please find invoice {{Invoice Number}} for {{Amount}} attached, due {{Due Date}}. Thank you!
2. Choose **📄 Doc Merge → Create PDFs and Email Them** and type the draft's subject.

Each client gets their own invoice attached.

## Next month

Add new rows for the new invoices and run it again. Rows that already have a link in **Merged PDF** are skipped, so earlier invoices are never re-sent.

## Getting paid on time

To chase unpaid invoices automatically, add a **Paid** checkbox column and use [Sheets Deadline Reminders](https://decodedxr.github.io/sheets-deadline-reminders/automatic-email-reminders-google-sheets.html) on the same sheet. It emails each client a few days before the Due Date and skips rows you've ticked as Paid.

## FAQ

**Is it free?** Yes, with no monthly document cap. It runs on your own Google account. Gmail allows about 100 recipients a day on a personal account and 1,500 on Google Workspace.

**Can an invoice have several line items?** Each placeholder takes one cell. For a fixed number of lines, use columns like `Item 1`, `Amount 1`, `Item 2`, `Amount 2`.

**Can I keep an editable Google Doc of each invoice?** Delete the `copy.setTrashed(true);` line in the script, and the filled-in Doc is kept next to the PDF.

---

[Get the script on GitHub](https://github.com/DecodedXR/sheets-doc-merge) · [General guide: PDFs and certificates from Google Sheets](generate-pdfs-certificates-from-google-sheets.html)
{% endraw %}
