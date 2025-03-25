import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-welcome')
  async sendWelcomeEmail(@Body() body: { email: string; name: string }) {
    if (!body.email || !body.name)
      throw new BadRequestException('Email and new password are required');
    await this.mailService.sendWelcomeEmail(body.email, body.name);
    return { message: 'Email sent successfully' };
  }
}
