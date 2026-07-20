# Connecting Your Contact Form to Google Sheets + Email

Right now your contact form doesn't send anywhere until you complete this. This
sets it up so every booking lands in a Google Sheet **and** you get an email
the moment it happens — no server, no hosting cost, no code beyond copy-paste.

Takes about 5 minutes.

---

## 1. Create the sheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank sheet.
2. Name it something like **Prime Bear Bookings**.

## 2. Add the script
1. In the sheet, go to **Extensions → Apps Script**.
2. Delete whatever starter code is there.
3. Open `google-apps-script/Code.gs` (included in this project folder) and paste its entire contents in.
4. Near the top, change this line to your real inbox:
   ```
   const NOTIFY_EMAIL = "contact@primebear.in";
   ```
5. Click **Save**.

## 3. Deploy it as a Web App
1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**.
5. The first time, Google will ask you to authorize the script — click through **Advanced → Go to (project name)** if it warns you it's unverified (normal for scripts you write yourself).
6. Copy the **Web app URL** it gives you — it ends in `/exec`.

## 4. Connect it to your website
1. Open `js/script.js`.
2. Find:
   ```js
   const SHEETS_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
3. Replace the placeholder with the URL from step 3.6.
4. Save and re-upload/redeploy your site.

## 5. Test it
1. Submit the live contact form with test details.
2. Check the Google Sheet — a new row should appear within seconds.
3. Check your inbox (and spam, the first time) for the notification email.

---

### What you get
- **A running dataset** — every booking as a timestamped row you can filter, export, or hand off.
- **An instant email** — so you don't have to check the sheet manually.

### Limits worth knowing
Free Google accounts can send roughly 100 emails/day this way — plenty for a consultation form. If you outgrow this later, that's the point to move to a proper backend/CRM.
