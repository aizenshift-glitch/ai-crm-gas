/**
 * Example configuration file.
 * Copy this file and rename it to Config.gs before running the project.
 */

const CONFIG = {
  // Google Sheets ID used as the CRM database
  SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',

  // Company information used in responses
  COMPANY_NAME: 'Demo Mobile Support',
  REPLY_FROM_NAME: 'Demo Mobile Support',

  // Gemini API configuration
  GEMINI_MODEL: 'gemini-2.5-flash',

  // Gemini API endpoint
  GEMINI_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',

  // Example return address used by the AI assistant
  RETURN_ADDRESS: `Demo Mobile Returns
123 Example Street
Example City
Country`
};