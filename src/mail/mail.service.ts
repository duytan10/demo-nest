import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendActivationEmail(email: string, token: string, name: string) {
    const activationLink = `http://localhost:5173/activate?token=${token}`;
    return this.mailerService.sendMail({
      to: email,
      subject: 'Account Activation',
      template: './welcome',
      context: {
        activationLink,
        name,
      },
    });
  }

   sendResetPasswordEmail(email: string, token: string, name: string) {
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    return this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset',
      template: './reset-password', // Path to your email template
      context: {
        resetLink,
        name,
      },
    });
  }
}
