type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

function requireEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export async function sendEmail({ to, subject, text, html, replyTo }: SendEmailInput) {
  const apiKey = requireEnv("RESEND_API_KEY", process.env.RESEND_API_KEY);
  const from = requireEnv("RESEND_FROM_EMAIL", process.env.RESEND_FROM_EMAIL);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend email request failed: ${response.status} ${errorBody}`);
  }
}
