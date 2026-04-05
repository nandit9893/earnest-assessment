const registerEmployeeTemplate = ({
  fullName,
  email,
  password,
  role,
  title,
  logo,
  websiteUrl,
  supportEmail,
  socialLinks,
  employeeID
}: RegisterTemplateProps) => {
  const socialLinksHtml = socialLinks
    .map((link) => {
      let iconUrl = "";
      const platform = link.name.toLowerCase();

      switch (platform) {
        case "facebook":
          iconUrl = "https://cdn-icons-png.flaticon.com/512/733/733547.png";
          break;
        case "twitter":
          iconUrl = "https://cdn-icons-png.flaticon.com/512/733/733558.png";
          break;
        case "linkedin":
          iconUrl = "https://cdn-icons-png.flaticon.com/512/733/733579.png";
          break;
        case "instagram":
          iconUrl = "https://cdn-icons-png.flaticon.com/512/2111/2111463.png";
          break;
        case "github":
          iconUrl = "https://cdn-icons-png.flaticon.com/512/733/733609.png";
          break;
        default:
          iconUrl = "https://cdn-icons-png.flaticon.com/512/733/733547.png";
      }
      return `
<a href="${link.link}" target="_blank" rel="noopener noreferrer"
   style="
     display:inline-block;
     width:50px;
     height:50px;
     border-radius:50%;
     background:#ffffff;
     text-align:center;
     margin:0 10px;
     line-height:50px;
     box-shadow:0 4px 12px rgba(0,0,0,0.15);
   ">
   <img src="${iconUrl}" alt="${link.name}" width="20" height="20"
        style="vertical-align:middle;">
</a>
`;
    })
    .join("");
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to ${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  </style>
</head>

<body style="margin:0; padding:0; background:linear-gradient(135deg, #f5f7fa 0%, #e9edf2 100%); font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px; background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 20px 40px -12px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05);">
          <tr>
            <td align="center" style="padding:32px 24px; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;">
                      <img src="${logo}" alt="${title}" style="height:80px; width: 100px" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:24px;">
                    <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:700; letter-spacing:-0.5px;">Welcome aboard! 🚀</h1>
                  </td>
                </tr>
              </table>
             </td>
           </tr>
          <tr>
            <td style="padding:40px 32px 0 32px;">
              <div style="background:linear-gradient(120deg, #f8f9ff 0%, #f0f2fe 100%); border-radius:20px; padding:28px; text-align:center;">
                <div style="font-size:48px; margin-bottom:12px;">✨</div>
                <h2 style="margin:0 0 8px; font-size:24px; font-weight:700; color:#1a202c;">Hello, ${fullName}!</h2>
                <p style="margin:0; font-size:15px; color:#4a5568; line-height:1.5;">
                  Your account has been successfully created. You're now part of the ${title} family!
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <div style="border-bottom:2px solid #e9edf2; padding-bottom:12px; margin-bottom:24px;">
                <h3 style="margin:0; font-size:18px; font-weight:600; color:#2d3748; display:flex; align-items:center; gap:8px;">
                  Account Credentials
                </h3>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafbfc; border-radius:20px; border:1px solid #eef2f8; overflow:hidden;">
                <tr style="border-bottom:1px solid #eef2f8;">
                  <td style="padding:16px 20px; font-weight:600; color:#1a202c; width:35%; background:#ffffff;">Employee ID</td>
                  <td style="padding:16px 20px; color:#4a5568; font-weight:500; background:#ffffff; border-left:1px solid #eef2f8;">
                    ${employeeID}
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #eef2f8;">
                  <td style="padding:16px 20px; font-weight:600; color:#1a202c; width:35%; background:#ffffff;">Full Name</td>
                  <td style="padding:16px 20px; color:#4a5568; font-weight:500; background:#ffffff; border-left:1px solid #eef2f8;">
                    ${fullName}
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #eef2f8;">
                  <td style="padding:16px 20px; font-weight:600; color:#1a202c; background:#fafbfc;">Email Address</td>
                  <td style="padding:16px 20px; color:#667eea; font-weight:500; background:#fafbfc; border-left:1px solid #eef2f8;">
                    ${email}
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #eef2f8;">
                  <td style="padding:16px 20px; font-weight:600; color:#1a202c; background:#ffffff;">Password</td>
                  <td style="padding:16px 20px; background:#ffffff; border-left:1px solid #eef2f8;">
                    <code style="background:#f7fafc; padding:6px 12px; border-radius:8px; font-size:13px; font-weight:600; color:#2d3748; border:1px solid #e2e8f0;">${password}</code>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px; font-weight:600; color:#1a202c; background:#fafbfc;">Role</td>
                  <td style="padding:16px 20px; background:#fafbfc; border-left:1px solid #eef2f8;">
                    <span style="background:linear-gradient(135deg, #667eea20 0%, #764ba220 100%); padding:4px 12px; border-radius:20px; font-size:13px; font-weight:600; color:#5a67d8;">${role}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 32px 24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${websiteUrl}" style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:#ffffff; padding:14px 32px; text-decoration:none; border-radius:50px; font-size:15px; font-weight:600; display:inline-flex; align-items:center; gap:10px; box-shadow:0 8px 20px -8px rgba(102,126,234,0.4); transition:all 0.3s ease;">
                     Access Dashboard
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:20px;">
                    <p style="margin:0; font-size:12px; color:#94a3b8;">
                      Having trouble? Copy and paste this link into your browser:
                      <br />
                      <a href="${websiteUrl}" style="color:#667eea; text-decoration:underline; word-break:break-all;">${websiteUrl}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px; background:#fafbfc; border-top:1px solid #eef2f8; text-align:center;">
              <div style="display:inline-flex; justify-content:center; gap:20px; align-items:center; flex-wrap:wrap;">
                ${socialLinksHtml}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 32px 32px; background:#ffffff;">
              <div style="text-align:center; border-top:1px solid #eef2f8; padding-top:24px;">
                <p style="margin:0 0 8px; font-size:12px; color:#94a3b8;">
                  © ${new Date().getFullYear()} ${title}. All rights reserved.
                </p>
                <p style="margin:0; font-size:11px; color:#cbd5e1;">
                  This email was sent to ${supportEmail} as part of your employee onboarding process.
                </p>
                <p style="margin:12px 0 0 0; font-size:11px; color:#cbd5e1;">
                  <a href="/" style="color:#94a3b8; text-decoration:none;">Privacy Policy</a> •
                  <a href="/" style="color:#94a3b8; text-decoration:none;">Terms of Service</a> •
                  <a href="/" style="color:#94a3b8; text-decoration:none;">Contact Support</a>
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export default registerEmployeeTemplate;
