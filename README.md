# AI CRM (Google Apps Script + Gemini)

A lightweight AI-powered customer support CRM built with **Google Apps Script, Google Sheets, and the Gemini API**.

This project demonstrates how small businesses can automate customer support without using expensive platforms.

The system stores conversations in Google Sheets and uses Gemini to generate responses based on order history and support policies.

---

# Features

* AI-powered customer support replies
* Conversation history tracking
* Order lookup by customer name
* Policy-based response generation
* Google Sheets used as a CRM database
* Built entirely with Google Apps Script

---

# Architecture

User
↓
GAS Web App
↓
Gemini API
↓
Google Sheets (CRM database)

---

# Project Structure

Code.gs
Main entry point and chat logic

Config.example.gs
Example configuration file

GeminiService.gs
Handles Gemini API requests

SheetService.gs
Handles Google Sheets database operations

Utils.gs
Utility functions

Index.html
Simple chat UI

---

# Setup

1. Create a Google Apps Script project.

2. Copy the source files into the project.

3. Create a configuration file.

Rename:

Config.example.gs

to

Config.gs

and fill in your values.

Example configuration:

const CONFIG = {
SHEET_ID: 'YOUR_SHEET_ID',
COMPANY_NAME: 'Demo Mobile Support',
REPLY_FROM_NAME: 'Demo Mobile Support',
GEMINI_MODEL: 'gemini-2.5-flash',
GEMINI_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
RETURN_ADDRESS: 'Demo Mobile Returns 123 Example Street Example City Country'
};

4. Deploy the project as a Web App from Google Apps Script.

---

# Why This Project Exists

Customer support platforms like Zendesk or Intercom are often too expensive or complex for small businesses.

This project explores a simpler alternative:

Using **AI + Google Apps Script + Google Sheets** to create a lightweight support automation system.

---

# Technologies Used

Google Apps Script
Google Sheets
Gemini API
HTML / JavaScript

---

# License

MIT License
