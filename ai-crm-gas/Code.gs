function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('AI CRM Demo Chat');
}

function startConversation(formData) {
  validateRequired(formData.name, 'Name');
  validateRequired(formData.email, 'Email');
  validateEmail(formData.email);

  const conversationId = generateId('CONV');

  saveConversation({
    conversation_id: conversationId,
    customer_name: formData.name.trim(),
    customer_email: formData.email.trim(),
    status: 'OPEN',
    created_at: now(),
    updated_at: now(),
    current_step: 'STARTED',
    resolved: 'NO'
  });

  const welcomeMessage = `Hello ${formData.name}, I'm the Demo Mobile Support assistant. I can help with returns, delivery issues, defective products, and warranty questions. How can I help you today?`;

  saveMessage({
    message_id: generateId('MSG'),
    conversation_id: conversationId,
    role: 'assistant',
    message: welcomeMessage,
    created_at: now()
  });

  return {
    conversationId,
    reply: welcomeMessage
  };
}

function sendMessage(data) {
  validateRequired(data.conversationId, 'Conversation ID');
  validateRequired(data.name, 'Name');
  validateRequired(data.email, 'Email');
  validateRequired(data.message, 'Message');
  validateEmail(data.email);

  saveMessage({
    message_id: generateId('MSG'),
    conversation_id: data.conversationId,
    role: 'user',
    message: data.message.trim(),
    created_at: now()
  });

  const orders = getOrdersByCustomerName(data.name.trim());
  const policyText = getActivePoliciesText();
  const history = getMessagesByConversationId(data.conversationId);

  let reply = generateChatReply({
    today: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    customerName: data.name.trim(),
    customerEmail: data.email.trim(),
    orderText: formatOrdersForPrompt(orders),
    policyText: policyText,
    historyText: formatHistoryForPrompt(history)
  });

  if (
    /address/i.test(data.message) ||
    /where should i send/i.test(data.message) ||
    /where do i send/i.test(data.message) ||
    /住所/i.test(data.message)
  ) {
    if (!reply.includes('Return Center')) {
      reply += '\n\n' + CONFIG.RETURN_ADDRESS;
    }
  }

  saveMessage({
    message_id: generateId('MSG'),
    conversation_id: data.conversationId,
    role: 'assistant',
    message: reply,
    created_at: now()
  });

  updateConversationTimestamp(data.conversationId);

  return {
    reply
  };
}

function authorizeExternalRequest() {
  const response = UrlFetchApp.fetch('https://www.google.com');
  Logger.log(response.getResponseCode());
}