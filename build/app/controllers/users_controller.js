import User from '#models/user';
import { forgotPasswordValidator } from '#validators/password';
import { resetPasswordValidator } from '#validators/password';
import crypto from 'node:crypto';
import { DateTime } from 'luxon';
import mail from '@adonisjs/mail/services/main';
export default class UsersController {
    async forgotPassword({ request, response }) {
        const { email } = await request.validateUsing(forgotPasswordValidator);
        const user = await User.findBy('email', email);
        if (!user) {
            return response.notFound({ message: 'User not found' });
        }
        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiresAt = DateTime.utc().plus({ hours: 1 });
        await user.save();
        await mail.send((message) => {
            message
                .from('"JMTodo" <info@demomailtrap.co>')
                .to(user.email)
                .subject('Reset Your Password')
                .htmlView('emails/forgot_password', { user, token });
        });
        return response.ok({ message: 'Password reset token sent to email' });
    }
    async resetPassword({ request, response }) {
        const { token, password } = await request.validateUsing(resetPasswordValidator);
        const user = await User.findBy('resetToken', token);
        if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < DateTime.utc()) {
            return response.badRequest({ message: 'Invalid or expired token' });
        }
        user.password = password;
        user.resetToken = null;
        user.resetTokenExpiresAt = null;
        await user.save();
        return response.ok({ message: 'Password has been reset successfully' });
    }
}
//# sourceMappingURL=users_controller.js.map