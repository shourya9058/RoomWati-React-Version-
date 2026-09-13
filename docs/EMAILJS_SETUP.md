# 📧 RoomWati EmailJS Universal Template Setup Guide

RoomWati uses **ONE universal EmailJS template** for all OTP situations (Signup verification, OTP login, and Password reset). The visual design adapts dynamically based on the OTP purpose.

---

### 🚀 Step 1: Create the Template in EmailJS

1. Log into your [EmailJS Dashboard](https://dashboard.emailjs.com/).
2. Navigate to **Email Templates** → click **Create New Template**.
3. In the template settings (gear icon / settings tab):
   - **Template Name**: `RoomWati Universal OTP`
   - **Template ID**: `roomwati_otp` *(Must be exactly this ID)*

---

### 📝 Step 2: Configure the Email Subject

In the **Subject** field, set:
```text
{{email_title}} | RoomWati
```
> ⚠️ **Important**: Do not include `{{otp}}` in the subject line to prevent security codes from appearing in device lockscreen previews and notification banners.

---

### 🎨 Step 3: Paste the HTML Template

Click the **Source Code (<>)** or HTML editor button and paste the exact RoomWati HTML template below:

```html
<!DOCTYPE html>
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
</html>
```

---

### 🔑 Step 4: Environment Variables (`.env`)

Add the following to your root `.env` file:

```env
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=roomwati_otp
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
EMAILJS_PRIVATE_KEY=your_emailjs_private_key # (Optional)
ROOMWATI_URL=http://localhost:5173
```

---

### 📦 Dynamic Variables Handled Automatically by RoomWati

| Variable | Description |
| :--- | :--- |
| `{{to_name}}` | Recipient's display name or username |
| `{{otp}}` | Generated 6-digit verification code |
| `{{expires_in}}` | Expiration time string: `"10 minutes"` |
| `{{email_title}}` | Dynamic header (e.g., `Verify your email`, `You're almost in`, `Let's get you back in`) |
| `{{eyebrow}}` | Badge text (`SECURE CODE`, `SECURE LOGIN`, `ACCOUNT SECURITY`) |
| `{{eyebrow_text}}` | Subhead label (`ONE QUICK STEP`, `YOU'RE ALMOST IN`, `NO WORRIES`) |
| `{{message}}` | Purpose-specific body copy |
| `{{code_label}}` | Card title (`YOUR VERIFICATION CODE`, `YOUR LOGIN CODE`, `YOUR RESET CODE`) |
| `{{security_message}}` | Contextual safety note |
| `{{ignore_message}}` | Safety notice for unintentional requests |
| `{{roomwati_url}}` | Base application URL |
| `{{year}}` | Current calendar year (e.g., `2026`) |
