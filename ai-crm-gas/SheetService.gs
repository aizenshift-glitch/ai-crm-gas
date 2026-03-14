function getSpreadsheet() {
  return SpreadsheetApp.openById(CONFIG.SHEET_ID);
}

function getSheetByName(name) {
  const sheet = getSpreadsheet().getSheetByName(name);
  if (!sheet) {
    throw new Error(`Sheet not found: ${name}`);
  }
  return sheet;
}

function getCustomerByEmail(email) {
  const values = getSheetByName('customers').getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][2]).trim().toLowerCase() === String(email).trim().toLowerCase()) {
      return {
        customer_id: values[i][0],
        name: values[i][1],
        email: values[i][2]
      };
    }
  }

  return null;
}

function getOrdersByCustomerName(customerName) {
  const values = getSheetByName('orders').getDataRange().getValues();
  const result = [];

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][2]).trim().toLowerCase() === String(customerName).trim().toLowerCase()) {
      result.push({
        order_id: values[i][0],
        customer_id: values[i][1],
        customer_name: values[i][2],
        item_name: values[i][3],
        delivered_at: values[i][4],
        is_sale_item: values[i][5],
        is_food: values[i][6],
        used: values[i][7],
        original_package: values[i][8],
        defective_reported: values[i][9]
      });
    }
  }

  return result;
}

function getActivePoliciesText() {
  const values = getSheetByName('policies').getDataRange().getValues();
  const rows = [];

  for (let i = 1; i < values.length; i++) {
    if (values[i][3] === true || String(values[i][3]).toUpperCase() === 'TRUE') {
      rows.push(`- ${values[i][2]}`);
    }
  }

  return rows.join('\n');
}

function saveConversation(conversation) {
  getSheetByName('conversations').appendRow([
    conversation.conversation_id,
    conversation.customer_name,
    conversation.customer_email,
    conversation.status,
    conversation.created_at,
    conversation.updated_at,
    conversation.current_step,
    conversation.resolved
  ]);
}

function saveMessage(message) {
  getSheetByName('messages').appendRow([
    message.message_id,
    message.conversation_id,
    message.role,
    message.message,
    message.created_at
  ]);
}

function getMessagesByConversationId(conversationId) {
  const values = getSheetByName('messages').getDataRange().getValues();
  const result = [];

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][1]) === String(conversationId)) {
      result.push({
        message_id: values[i][0],
        conversation_id: values[i][1],
        role: values[i][2],
        message: values[i][3],
        created_at: values[i][4]
      });
    }
  }

  return result;
}

function formatOrdersForPrompt(orders) {
  if (!orders || orders.length === 0) {
    return 'No orders found for this customer.';
  }

  return orders.map(order => {
    return `- ${order.item_name} | delivered_at: ${order.delivered_at} | sale: ${order.is_sale_item} | food: ${order.is_food} | used: ${order.used} | original_package: ${order.original_package} | defective_reported: ${order.defective_reported}`;
  }).join('\n');
}

function formatHistoryForPrompt(messages) {
  if (!messages || messages.length === 0) {
    return 'No previous messages.';
  }

  return messages.map(msg => `${msg.role}: ${msg.message}`).join('\n');
}

function updateConversationTimestamp(conversationId) {
  const sheet = getSheetByName('conversations');
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(conversationId)) {
      sheet.getRange(i + 1, 6).setValue(new Date());
      return;
    }
  }
}