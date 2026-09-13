const nodemailer = require('nodemailer');
const { OTP_PURPOSES, EMAIL_COPY, normalizePurpose } = require('./emailTypes');

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || 'roomwati_otp';
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

const EMAIL_USER = process.env.EMAIL_USER || 'roomwati.response@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'bmlz kxsx kpen jsar';
const ROOMWATI_URL = process.env.ROOMWATI_URL || process.env.CLIENT_URL || 'http://localhost:5173';

// Optional nodemailer transporter as reliable fallback for local/hybrid development
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * Universal RoomWati EmailJS HTML Template
 */
const UNIVERSAL_HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{email_title}} | RoomWati</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f6f7f9;
  font-family:Arial, Helvetica, sans-serif;
  color:#0f172a;
">

  <table width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:#f6f7f9;padding:32px 16px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="
            max-width:600px;
            background:#ffffff;
            border:1px solid #e5e7eb;
            border-radius:20px;
            overflow:hidden;
          ">

          <!-- HEADER -->

          <tr>
            <td style="padding:26px 32px;border-bottom:1px solid #f1f5f9;">

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>

                  <td>
                    <div style="
                      font-size:25px;
                      font-weight:800;
                      letter-spacing:-1px;
                    ">
                      <span style="color:#0f172a;">Room</span><span style="color:#ff385c;">Wati</span>
                    </div>
                  </td>

                  <td align="right">

                    <div style="
                      display:inline-block;
                      padding:7px 11px;
                      background:#fff1f2;
                      color:#ff385c;
                      border-radius:999px;
                      font-size:11px;
                      font-weight:700;
                    ">
                      {{eyebrow}}
                    </div>

                  </td>

                </tr>
              </table>

            </td>
          </tr>


          <!-- HERO -->

          <tr>
            <td style="padding:42px 32px 20px;">

              <div style="
                font-size:12px;
                font-weight:800;
                color:#ff385c;
                letter-spacing:1.5px;
                text-transform:uppercase;
                margin-bottom:14px;
              ">
                {{eyebrow_text}}
              </div>

              <h1 style="
                margin:0;
                font-size:34px;
                line-height:1.15;
                letter-spacing:-1.2px;
                color:#0f172a;
              ">
                {{email_title}}
              </h1>

              <p style="
                margin:14px 0 0;
                font-size:16px;
                line-height:1.7;
                color:#64748b;
              ">
                Hey {{to_name}} 👋<br>
                {{message}}
              </p>

            </td>
          </tr>


          <!-- OTP CARD -->

          <tr>
            <td style="padding:20px 32px 10px;">

              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="
                  background:#fff4f5;
                  border:1px solid #ffd9dd;
                  border-radius:16px;
                ">

                <tr>
                  <td align="center" style="padding:28px 20px;">

                    <div style="
                      font-size:11px;
                      font-weight:800;
                      letter-spacing:1.6px;
                      color:#94a3b8;
                      margin-bottom:12px;
                    ">
                      {{code_label}}
                    </div>

                    <div style="
                      font-size:38px;
                      line-height:1;
                      font-weight:800;
                      letter-spacing:8px;
                      color:#ff385c;
                      margin-left:8px;
                    ">
                      {{otp}}
                    </div>

                    <div style="
                      margin-top:14px;
                      font-size:13px;
                      color:#64748b;
                    ">
                      Valid for
                      <strong style="color:#0f172a;">
                        {{expires_in}}
                      </strong>
                    </div>

                  </td>
                </tr>

              </table>

            </td>
          </tr>


          <!-- SECURITY -->

          <tr>
            <td style="padding:22px 32px 8px;">

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>

                  <td valign="top" width="42">

                    <div style="
                      width:32px;
                      height:32px;
                      line-height:32px;
                      text-align:center;
                      background:#f1f5f9;
                      border-radius:50%;
                      font-size:15px;
                    ">
                      🔐
                    </div>

                  </td>

                  <td valign="top">

                    <div style="
                      font-size:14px;
                      font-weight:700;
                      color:#0f172a;
                      margin-bottom:4px;
                    ">
                      Keep your code private
                    </div>

                    <div style="
                      font-size:13px;
                      line-height:1.6;
                      color:#64748b;
                    ">
                      {{security_message}}
                    </div>

                  </td>

                </tr>
              </table>

            </td>
          </tr>


          <!-- CTA -->

          <tr>
            <td align="center" style="padding:28px 32px 10px;">

              <a href="{{roomwati_url}}"
                style="
                  display:inline-block;
                  background:#ff385c;
                  color:#ffffff;
                  text-decoration:none;
                  padding:15px 28px;
                  border-radius:11px;
                  font-size:14px;
                  font-weight:700;
                  box-shadow:0 6px 16px rgba(255,56,92,0.20);
                ">
                Open RoomWati&nbsp; →
              </a>

            </td>
          </tr>


          <!-- IGNORE MESSAGE -->

          <tr>
            <td style="padding:18px 32px 38px;">

              <p style="
                margin:0;
                text-align:center;
                font-size:12px;
                line-height:1.6;
                color:#94a3b8;
              ">
                {{ignore_message}}
              </p>

            </td>
          </tr>


          <!-- FOOTER -->

          <tr>
            <td style="
              padding:26px 32px;
              background:#0f172a;
            ">

              <table width="100%" cellpadding="0" cellspacing="0">

                <tr>

                  <td>

                    <div style="
                      font-size:19px;
                      font-weight:800;
                      margin-bottom:7px;
                    ">
                      <span style="color:#ffffff;">Room</span><span style="color:#ff385c;">Wati</span>
                    </div>

                    <div style="
                      font-size:12px;
                      color:#94a3b8;
                      line-height:1.5;
                    ">
                      Find a place that feels like home.
                    </div>

                  </td>

                  <td align="right" valign="bottom">

                    <div style="
                      font-size:11px;
                      color:#64748b;
                    ">
                      © {{year}} RoomWati
                    </div>

                  </td>

                </tr>

              </table>

            </td>
          </tr>

        </table>


        <!-- Bottom text -->

        <div style="
          max-width:600px;
          padding:18px 20px 0;
          text-align:center;
          font-size:11px;
          color:#94a3b8;
          line-height:1.5;
        ">
          This email was sent automatically by RoomWati.
          Please do not reply to this email.
        </div>

      </td>
    </tr>
  </table>

</body>
</html>`;

/**
 * Builds the template variables dictionary for EmailJS and HTML rendering.
 */
function buildEmailVariables({ to_name, otp, purpose }) {
  const normPurpose = normalizePurpose(purpose);
  const copy = EMAIL_COPY[normPurpose] || EMAIL_COPY[OTP_PURPOSES.LOGIN];

  return {
    to_name: to_name || 'there',
    otp: otp.toString(),
    expires_in: '10 minutes', // Strict 10-minute expiry
    email_title: copy.email_title,
    eyebrow: copy.eyebrow,
    eyebrow_text: copy.eyebrow_text,
    message: copy.message,
    code_label: copy.code_label,
    security_message: copy.security_message,
    ignore_message: copy.ignore_message,
    roomwati_url: ROOMWATI_URL,
    year: new Date().getFullYear().toString(),
  };
}

/**
 * Renders HTML string by replacing {{var}} tokens.
 */
function renderHtml(template, variables) {
  let output = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    output = output.replace(regex, value ?? '');
  }
  return output;
}

/**
 * Sends the universal RoomWati OTP email via EmailJS (or fallback).
 *
 * @param {Object} params
 * @param {string} params.to - Recipient email address
 * @param {string} params.to_name - Recipient name
 * @param {string} params.otp - 6-digit OTP code
 * @param {string} params.purpose - 'SIGNUP_VERIFICATION' | 'LOGIN' | 'PASSWORD_RESET'
 */
async function sendOtpEmail({ to, to_name, otp, purpose }) {
  if (!to || !otp) {
    throw new Error('Recipient email and OTP are required to send OTP email');
  }

  const variables = buildEmailVariables({ to_name, otp, purpose });
  const subject = `${variables.email_title} | RoomWati`; // Clean subject without OTP

  // 1. If EmailJS configuration is present, attempt EmailJS send
  if (EMAILJS_SERVICE_ID && EMAILJS_PUBLIC_KEY) {
    try {
      const emailjs = require('@emailjs/nodejs');
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          ...variables,
          to_email: to,
          user_email: to,
          email: to,
        },
        {
          publicKey: EMAILJS_PUBLIC_KEY,
          privateKey: EMAILJS_PRIVATE_KEY,
        }
      );
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[EMAIL-SERVICE] EmailJS sent successfully to ${to} for purpose ${purpose}. Status: ${response.status}`);
      }
      return { success: true, provider: 'emailjs', status: response.status };
    } catch (emailjsErr) {
      console.warn(`[EMAIL-SERVICE] EmailJS delivery failed: ${emailjsErr.message}. Falling back to SMTP/Nodemailer...`);
    }
  }

  // 2. Fallback: Render full universal HTML and send via Nodemailer (Gmail / SMTP)
  try {
    const renderedHtml = renderHtml(UNIVERSAL_HTML_TEMPLATE, variables);
    const plainText = `Hey ${variables.to_name},\n\n${variables.message}\n\nYour code: ${variables.otp} (Valid for ${variables.expires_in})\n\n${variables.security_message}\n\n${variables.roomwati_url}`;

    const info = await transporter.sendMail({
      from: `RoomWati <${EMAIL_USER}>`,
      to,
      subject,
      text: plainText,
      html: renderedHtml,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[EMAIL-SERVICE] Email delivered via SMTP/Nodemailer to ${to}. MessageId: ${info.messageId}`);
    }
    return { success: true, provider: 'nodemailer', messageId: info.messageId };
  } catch (smtpErr) {
    console.warn(`[EMAIL-SERVICE] SMTP delivery failed: ${smtpErr.message}`);
    // In local development fallback mode
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV-FALLBACK] OTP for ${to} (${purpose}): ${otp}`);
      return { success: true, provider: 'dev_console' };
    }
    throw new Error('Unable to send verification email. Please check internet connection or try again later.');
  }
}

module.exports = {
  sendOtpEmail,
  buildEmailVariables,
  renderHtml,
  UNIVERSAL_HTML_TEMPLATE,
};
