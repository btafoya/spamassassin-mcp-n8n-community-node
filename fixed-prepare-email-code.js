// Fixed email data parsing - handles manual trigger and webhook
const emailData = $input.first();
console.log('Input data received:', JSON.stringify(emailData, null, 2));

// Handle both JSON body and form data
let emailContent, subject, sender;

// Handle different input sources (manual trigger vs webhook)
let sourceData = emailData;

// If this is webhook data (has body property), extract it
if (emailData.body !== undefined) {
  sourceData = emailData.body;
  
  // If body is a string (rawBody: true), try to parse it
  if (typeof sourceData === 'string') {
    try {
      sourceData = JSON.parse(sourceData);
      console.log('Successfully parsed JSON body');
    } catch (e) {
      console.log('Body is not valid JSON, treating as raw email content');
      // sourceData remains as string
    }
  }
} else {
  // For manual triggers or direct JSON input, use the data as-is
  console.log('Using direct input data (manual trigger)');
}

// Extract email content, subject, and sender
if (sourceData && typeof sourceData === 'object') {
  emailContent = sourceData.email || sourceData.content;
  subject = sourceData.subject || 'Test Email';
  sender = sourceData.sender || sourceData.from || 'test@example.com';
} else if (typeof sourceData === 'string') {
  // Raw email content as string
  emailContent = sourceData;
  subject = 'Test Email';
  sender = 'test@example.com';
} else {
  // Fallback - no specific handling needed for node references
  emailContent = null;
  subject = 'Test Email';
  sender = 'test@example.com';
}

// Default test email if nothing provided
if (!emailContent) {
  emailContent = `Subject: Test Email
From: test@example.com
To: recipient@example.com

This is a test email for SpamAssassin scanning.
It contains normal content and should be classified as HAM (not spam).`;
  console.log('Using default test email content');
}

console.log('Final processed data:', { email: emailContent, subject, sender });

return {
  email: emailContent,
  subject: subject,
  sender: sender,
  timestamp: new Date().toISOString()
};