import env from '#start/env';
import { defineConfig, transports } from '@adonisjs/mail';
if (!env.get('SMTP_USERNAME') || !env.get('SMTP_PASSWORD') || !env.get('SMTP_HOST')) {
    throw new Error('Missing mail credentials. Please check .env settings.');
}
const mailConfig = defineConfig({
    default: 'smtp',
    mailers: {
        smtp: transports.smtp({
            host: env.get('SMTP_HOST'),
            port: Number(env.get('SMTP_PORT') || 587),
            auth: {
                type: 'login',
                user: env.get('SMTP_USERNAME'),
                pass: env.get('SMTP_PASSWORD'),
            },
            secure: false,
            tls: {
                rejectUnauthorized: false,
            },
        }),
    },
});
export default mailConfig;
//# sourceMappingURL=mail.js.map