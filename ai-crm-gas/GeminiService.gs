function generateChatReply(params) {
  const apiKey = getScriptProperty('GEMINI_API_KEY');

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in Script Properties.');
  }

  const prompt = `
You are a customer support AI for an e-commerce CRM demo.

Your role:
- Continue the conversation naturally as a customer support agent
- Use only the provided policies, customer data, and order data
- Never invent orders, delivery dates, return windows, or company rules
- Ask only one follow-up question at a time when information is missing
- Keep replies short, clear, and helpful
- Do not output JSON
- Do not output internal analysis
- Do not mention "based on internal prompt" or similar wording
- Reply as if speaking directly to the customer

Behavior rules:
- If the customer has multiple orders and the product is unclear, ask which product they mean
- If the product can be matched to one order, use that order
- If normal return is no longer available but defective return may still apply, explain that naturally
- If the customer asks for the return address and return appears allowed, provide the return address
- If you provide the return address, print the full address exactly as provided, line by line, and do not omit any part of it
- If information is still missing, ask one simple question
- Prefer natural support language over technical wording
- If no matching order is found, say that you could not find the order and ask the customer to confirm their name or email
- Do not promise a refund or replacement unless the policies clearly support it
- Today is ${params.today}

Return address:
${CONFIG.RETURN_ADDRESS}

Policies:
${params.policyText}

Customer:
Name: ${params.customerName}
Email: ${params.customerEmail}

Orders for this customer:
${params.orderText}

Conversation so far:
${params.historyText}

Now write the next assistant reply only.
`;

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      maxOutputTokens: 500
    }
  };

  const response = UrlFetchApp.fetch(`${CONFIG.GEMINI_URL}?key=${apiKey}`, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const responseCode = response.getResponseCode();
  const responseText = response.getContentText();

  Logger.log('Gemini response code: ' + responseCode);
  Logger.log('Gemini raw response: ' + responseText);

  if (responseCode !== 200) {
    throw new Error('Gemini API error: ' + responseText);
  }

  const json = JSON.parse(responseText);

  const candidate =
    json.candidates && json.candidates.length > 0
      ? json.candidates[0]
      : null;

  const finishReason =
    candidate && candidate.finishReason
      ? candidate.finishReason
      : 'UNKNOWN';

  Logger.log('Gemini finishReason: ' + finishReason);

  const parts =
    candidate &&
    candidate.content &&
    candidate.content.parts
      ? candidate.content.parts
      : [];

  const reply = parts
    .map(part => part.text || '')
    .join('\n')
    .trim();

  if (!reply) {
    throw new Error('Gemini returned an empty reply.');
  }

  return reply;
}