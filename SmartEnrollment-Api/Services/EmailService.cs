using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace SmartEnrollment_Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task EnviarCredenciales(string destinatario, string nombre, string username, string contrasena)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_config["Gmail:Email"]));
            email.To.Add(MailboxAddress.Parse(destinatario));
            email.Subject = "SmartEnrollment — Tus credenciales de acceso";

            email.Body = new TextPart("html")
            {
                Text = $@"
                <!DOCTYPE html>
                <html lang='es'>
                <head>
                    <meta charset='UTF-8'>
                    <style>
                        body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }}
                        .container {{ max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }}
                        .header {{ background-color: #1a1a2e; padding: 24px 32px; }}
                        .header h1 {{ color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px; }}
                        .body {{ padding: 32px; color: #333333; }}
                        .body p {{ font-size: 15px; line-height: 1.6; }}
                        .credentials {{ background-color: #f0f4ff; border-left: 4px solid #1a1a2e; padding: 16px 20px; margin: 24px 0; border-radius: 4px; }}
                        .credentials p {{ margin: 6px 0; font-size: 15px; }}
                        .credentials span {{ font-weight: bold; color: #1a1a2e; }}
                        .warning {{ color: #c0392b; font-size: 13px; margin-top: 24px; }}
                        .footer {{ background-color: #1a1a2e; padding: 16px 32px; text-align: center; }}
                        .footer p {{ color: #aaaaaa; font-size: 12px; margin: 4px 0; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>SmartEnrollment</h1>
                        </div>
                        <div class='body'>
                            <p>Hola, <strong>{nombre}</strong>.</p>
                            <p>Su cuenta ha sido creada exitosamente en el sistema <strong>SmartEnrollment</strong>. A continuación encontrará sus credenciales de acceso:</p>
                            <div class='credentials'>
                                <p><span>Usuario:</span> {username}</p>
                                <p><span>Contraseña:</span> {contrasena}</p>
                            </div>
                            <p>Por seguridad, le recomendamos cambiar su contraseña al iniciar sesión por primera vez.</p>
                            <p class='warning'>Si usted no solicitó esta cuenta o no reconoce esta acción, comuníquese con el administrador del sistema de inmediato.</p>
                        </div>
                        <div class='footer'>
                            <p>Este es un correo automático, por favor no responda a este mensaje.</p>
                            <p>&copy; {DateTime.Now.Year} SmartEnrollment. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </body>
                </html>"
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(
                _config["Gmail:Email"],
                _config["Gmail:AppPassword"]
            );
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}