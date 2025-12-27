import { resend } from "../lib/resend"

interface ContactPayload {
  name: string
  email: string
  message: string
}

/**
 * Email interno a Gerencia
 */
export async function sendContactEmail({
  name,
  email,
  message,
}: ContactPayload) {
  await resend.emails.send({
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
<body style="font-family:Arial, sans-serif; background:#f4f6f8; padding:20px">
  <table width="100%" align="center">
    <tr>
      <td align="center">
        <table width="600" style="background:#ffffff; border-radius:6px; padding:30px">
          <tr>
            <td>
              <h2>Nuevo contacto</h2>

              <p><strong>Nombre:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>

              <hr />

              <p>${message.replace(/\n/g, "<br />")}</p>

              <br />
              <small>Enviado desde el formulario web</small>
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

/**
 * Auto-respuesta al cliente
 */
export async function sendAutoReply({
  name,
  email,
}: Pick<ContactPayload, "name" | "email">) {
  await resend.emails.send({
    from: "InfraxelLab <no-reply@send.infraxellab.com>",
    to: [email],
    replyTo: "gerencia@infraxellab.com",
    subject: "Hemos recibido tu mensaje — InfraxelLab",
    headers: {
      "X-Auto-Response": "true",
    },
    html: `
<!DOCTYPE html>
<html lang="es">
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%">
    <tr>
      <td align="center">
        <table width="600" style="background:#ffffff; margin:30px 0; border-radius:6px;">
          <tr>
            <td style="padding:30px; color:#1f2937;">
              <h2>Hola ${name},</h2>

              <p>
                Gracias por contactar a <strong>InfraxelLab</strong>.
                Hemos recibido tu mensaje correctamente.
              </p>

              <p>
                Nuestro equipo lo revisará y se pondrá en contacto contigo
                lo antes posible.
              </p>

              <p>
                Si tu consulta es urgente, puedes responder directamente
                a este correo.
              </p>

              <br>

              <p>
                Saludos,<br>
                <strong>InfraxelLab</strong><br>
                IT & Security Solutions<br>
                <a href="https://infraxellab.com">https://infraxellab.com</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#f1f5f9; padding:15px; font-size:12px; color:#475569;">
              Este es un mensaje automático, no es necesario responder.
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


export async function sendAutoReplyEmail({
  name,
  email,
}: {
  name: string
  email: string
}) {
  return await resend.emails.send({
    from: "InfraxelLab <no-reply@send.infraxellab.com>",
    to: [email],
    subject: "Hemos recibido tu mensaje – InfraxelLab",
    html: `
<!DOCTYPE html>
<html lang="es">
<body style="font-family:Arial,Helvetica,sans-serif; background:#f4f6f8; padding:30px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" style="background:#ffffff; border-radius:6px; padding:30px;">
          <tr>
            <td>
              <h2 style="margin-top:0;">Hola ${name},</h2>

              <p>
                Hemos recibido tu mensaje correctamente.
              </p>

              <p>
                Nuestro equipo revisará tu solicitud y te contactará lo antes posible.
              </p>

              <p style="margin-top:30px;">
                Saludos,<br />
                <strong>InfraxelLab</strong><br />
                IT & Security Solutions
              </p>

              <hr style="margin:30px 0;" />

              <p style="font-size:12px; color:#6b7280;">
                Este correo fue enviado automáticamente.  
                Por favor no respondas a este mensaje.
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
