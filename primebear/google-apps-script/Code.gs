/**
 * PRIME BEAR — BOOKING RECEIVER
 * ------------------------------------------------------------
 * This script turns a Google Sheet into a simple booking inbox:
 *   1. Every contact-form submission gets logged as a new row.
 *   2. You get an email notification the moment someone submits.
 *
 * SETUP (see SETUP-GOOGLE-SHEETS.md for full step-by-step):
 *   1. Create a new Google Sheet.
 *   2. Extensions → Apps Script → paste this whole file in, replacing
 *      any starter code.
 *   3. Change NOTIFY_EMAIL below to your real email address.
 *   4. Deploy → New deployment → type "Web app" →
 *        Execute as: Me
 *        Who has access: Anyone
 *   5. Copy the Web App URL (ends in /exec) into js/script.js
 *      as the value of SHEETS_ENDPOINT.
 */

const NOTIFY_EMAIL = "contact@primebear.in"; // <-- change this to your real inbox
const SHEET_NAME = "Bookings";

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Business Type", "Message"]);
    sheet.setFrozenRows(1);
  }

  const data = e.parameter;

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.email || "",
    data.phone || "",
    data.businessType || "",
    data.message || "",
  ]);

  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: "New Prime Bear consultation request — " + (data.name || "Unknown"),
      body:
        "New booking received:\n\n" +
        "Name: " + (data.name || "-") + "\n" +
        "Email: " + (data.email || "-") + "\n" +
        "Phone: " + (data.phone || "-") + "\n" +
        "Business Type: " + (data.businessType || "-") + "\n" +
        "Message: " + (data.message || "-") + "\n\n" +
        "— Logged automatically to your Bookings sheet.",
    });
  } catch (err) {
    // Even if email fails (e.g. daily quota), the row is already saved.
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput("Prime Bear booking endpoint is live.");
}
