// Enhanced email data parsing with better raw body handling
const emailData = $input.first();
console.log('Webhook data received:', JSON.stringify(emailData, null, 2));

// Handle both JSON body and form data
let emailContent, subject, sender;

// Check if body is a string that needs parsing (common with rawBody: true)
let parsedBody = emailData.body;
if (typeof emailData.body === 'string') {
  try {
    parsedBody = JSON.parse(emailData.body);
    console.log('Successfully parsed JSON body');
  } catch (e) {
    console.log('Body is not valid JSON, treating as raw email content');
    parsedBody = emailData.body;
  }
}

if (parsedBody && typeof parsedBody === 'object') {
  emailContent = parsedBody.email || parsedBody.content;
  subject = parsedBody.subject || 'Test Email';
  sender = parsedBody.sender || parsedBody.from || 'test@example.com';
} else {
  // If raw body, treat as email content
  emailContent = parsedBody || emailData.body || $('Webhook').first().json.body;
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
}

console.log('Processed email content:', { email: emailContent, subject, sender });

return {
  email: emailContent,
  subject: subject,
  sender: sender,
  timestamp: new Date().toISOString()
};