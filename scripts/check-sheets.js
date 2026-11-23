/**
 * One-off check that the Google setup works. Run with:
 *   node --env-file=.env.local scripts/check-sheets.js
 *
 * It only READS: it opens the spreadsheet and checks both header rows.
 */
import { auth, sheets } from "@googleapis/sheets";
import { EXPECTED_HEADERS } from "../api/_lib/sheetSchema.js";

const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID } = process.env;

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

// 1. Are the variables there?
const missing = Object.entries({ GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID })
  .filter(([, value]) => !value)
  .map(([name]) => name);
if (missing.length) fail(`Missing in .env.local: ${missing.join(", ")}`);

// .env files store the key's line breaks as "\n" text; Google needs real line breaks.
const privateKey = GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
if (!privateKey.includes("BEGIN PRIVATE KEY")) {
  fail('GOOGLE_PRIVATE_KEY doesn\'t look right. It should start with "-----BEGIN PRIVATE KEY-----".');
}

const client = new auth.JWT({
  email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: privateKey,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const api = sheets({ version: "v4", auth: client });

try {
  // 2. Can we open the spreadsheet?
  const { data } = await api.spreadsheets.get({
    spreadsheetId: GOOGLE_SPREADSHEET_ID,
    fields: "properties.title,sheets.properties.title",
  });
  console.log(`\n✅ Connected to spreadsheet: "${data.properties.title}"`);

  // 3. Do both tabs exist with the right headers?
  const tabNames = data.sheets.map((s) => s.properties.title);
  let allGood = true;

  for (const [tab, expected] of Object.entries(EXPECTED_HEADERS)) {
    if (!tabNames.includes(tab)) {
      console.log(`❌ Tab "${tab}" not found. Tabs in this spreadsheet: ${tabNames.join(", ")}`);
      allGood = false;
      continue;
    }
    const res = await api.spreadsheets.values.get({ spreadsheetId: GOOGLE_SPREADSHEET_ID, range: `${tab}!1:1` });
    const actual = (res.data.values?.[0] ?? []).map((h) => String(h).trim());
    const matches = expected.length === actual.length && expected.every((h, i) => h === actual[i]);

    if (matches) {
      console.log(`✅ "${tab}" headers are correct (${expected.length} columns)`);
    } else {
      allGood = false;
      console.log(`❌ "${tab}" headers don't match.`);
      console.log(`   Expected: ${expected.join(" | ")}`);
      console.log(`   Found:    ${actual.join(" | ") || "(empty row 1)"}`);
    }
  }

  console.log(allGood ? "\n🎉 Google Sheets is ready for Phase 5.2.\n" : "\nFix the items above, then run this again.\n");
  process.exit(allGood ? 0 : 1);
} catch (err) {
  const status = err.code ?? err.response?.status;
  if (status === 403) fail("Permission denied. Did you share the spreadsheet with the service account email as Editor (Step 6)?");
  if (status === 404) fail("Spreadsheet not found. Check GOOGLE_SPREADSHEET_ID (Step 7).");
  if (String(err.message).includes("invalid_grant") || String(err.message).includes("DECODER")) {
    fail("Google rejected the key. Re-copy GOOGLE_PRIVATE_KEY exactly from the JSON file (Step 8).");
  }
  if (String(err.message).includes("has not been used") || String(err.message).includes("disabled")) {
    fail("The Google Sheets API isn't enabled for this project (Step 2).");
  }
  fail(`Unexpected error: ${err.message}`);
}