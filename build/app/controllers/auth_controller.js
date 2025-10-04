import User from '#models/user';
import { createUserValidator } from '#validators/create_user_validator';
import { randomUUID } from 'node:crypto';
import mail from '@adonisjs/mail/services/main';
export default class AuthController {
    async register({ request, response }) {
        const payload = await request.validateUsing(createUserValidator);
        const existingUser = await User.findBy('email', payload.email);
        if (existingUser) {
            return response.status(409).json({
                message: ' Email already in use',
            });
        }
        const verificationToken = randomUUID();
        const user = await User.create({
            fullName: payload.full_name,
            email: payload.email,
            password: payload.password,
            verificationToken,
            isVerified: false,
        });
        await mail.send((message) => {
            message
                .to(user.email)
                .subject('Verify your account')
                .htmlView('emails/verify', {
                token: verificationToken,
                user: user,
                url: `http://localhost:3000/auth/verify-email?token=${verificationToken}`,
            });
        });
        return response.status(201).json({
            message: 'Registration successful. Please check your email to verify your account.',
        });
    }
    async verifyEmail({ request, response }) {
        const token = request.input('token');
        if (!token) {
            return response.badRequest({ message: 'No token provided' });
        }
        const user = await User.findBy('verificationToken', token);
        if (!user) {
            return response.badRequest({ message: 'Invalid or expired verification token' });
        }
        user.isVerified = true;
        user.verificationToken = null;
        await user.save();
        return response.ok({ message: 'Email verified successfully' });
    }
    async resendVerification({ request, response }) {
        const email = request.input('email');
        const user = await User.findBy('email', email);
        if (!user) {
            return response.notFound({ message: 'User not found' });
        }
        if (user.isVerified) {
            return response.badRequest({ message: 'User already verified' });
        }
        user.verificationToken = crypto.randomUUID();
        await user.save();
        await mail.send((message) => {
            message
                .to(user.email)
                .subject('Verify your email')
                .htmlView('emails/verify', { token: user.verificationToken });
        });
        return response.ok({ message: 'Verification email resent successfully' });
    }
    async login({ request, response }) {
        const { email, password } = request.only(['email', 'password']);
        try {
            const user = await User.verifyCredentials(email, password);
            if (!user.isVerified) {
                return response.unauthorized({
                    message: 'Please verify your email before logging in.',
                });
            }
            const token = await User.accessTokens.create(user);
            const rawToken = token.value.release();
            return response.ok({
                access_token: rawToken,
                token_type: 'bearer',
                user: {
                    id: user.id,
                    email: user.email,
                },
            });
        }
        catch (error) {
            console.log('Login error:', error.message);
            return response.unauthorized({ message: 'Invalid credentials' });
        }
    }
    async me({ auth, response }) {
        try {
            const user = auth.user;
            if (!user) {
                return response.unauthorized({ message: 'Not authenticated' });
            }
            return response.ok({
                user: {
                    id: user.id,
                    email: user.email,
                    isVerified: user.isVerified,
                },
            });
        }
        catch (error) {
            return response.internalServerError({ message: 'Failed to fetch user info' });
        }
    }
    async logout({ auth, response }) {
        await auth.use('api').invalidateToken();
        return response.ok({ message: 'Logged out successfully' });
    }
}
//# sourceMappingURL=auth_controller.js.map