function getScriptProperty(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

function generateId(prefix) {
  const ts = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
  const rand = Math.floor(Math.random() * 1000);
  return `${prefix}-${ts}-${rand}`;
}

function now() {
  return new Date();
}

function validateRequired(value, fieldName) {
  if (!value || String(value).trim() === '') {
    throw new Error(`${fieldName} is required.`);
  }
}

function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!pattern.test(String(email).trim())) {
    throw new Error('Invalid email format.');
  }
}