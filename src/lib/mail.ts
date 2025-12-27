import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY no está definida")
}

export const resend = new Resend(process.env.RESEND_API_KEY)

type ContactEmailProps = {
  name: string
  email: string
  message: string
}

export async function sendContactEmail({
  name,
  email,
  message,
}: ContactEmailProps) {
  return await resend.emails.send({
    from: "InfraxelLab <no-reply@send.infraxellab.com>",
    to: ["gerencia@infraxellab.com"],
    replyTo: email,
    subject: `Nuevo contacto — ${name}`,
    headers: {
      "X-Form-Type": "contact",
      "X-Origin": "website",
    },
    html: `
<!DOCTYPE html>
<html lang="es">
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" style="background:#ffffff; margin:30px 0; border-radius:6px; overflow:hidden;">
          
          <tr>
            <td style="background:#0f172a; padding:20px; color:#ffffff;">
              <h2 style="margin:0;">InfraxelLab</h2>
              <p style="margin:5px 0 0; font-size:13px;">IT & Security Solutions</p>
            </td>
          </tr>

          <tr>
            <td style="padding:30px; color:#1f2937;">
              <h3>Nuevo contacto recibido</h3>

              <p><strong>Nombre</strong><br>${name}</p>
              <p><strong>Email</strong><br>${email}</p>

              <p><strong>Mensaje</strong></p>
              <div style="background:#f9fafb; padding:15px; border-left:4px solid #0f172a;">
                ${message.replace(/\n/g, "<br />")}
              </div>
            </td>
          </tr>

          <tr>
            <td style="background:#f1f5f9; padding:20px; font-size:12px; color:#475569;">
              <p style="margin:0;">
                Enviado desde el formulario de contacto<br>
                <strong>send.infraxellab.com</strong>
              </p>
              <p style="margin-top:8px;">
                © InfraxelLab — 
                <a href="https://infraxellab.com" style="color:#0f172a;">infraxellab.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
  })
}
