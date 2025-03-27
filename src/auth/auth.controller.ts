import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUser } from './dto/register-user.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() registerUser: RegisterUser) {
    return this.authService.register(registerUser);
  }

  @Post('login')
  async signIn(@Body() signInDto: { email: string; password: string }) {
    if (!signInDto.email || !signInDto.password)
      throw new BadRequestException('Email and new password are required');

    return this.authService.validateUser(signInDto.email, signInDto.password);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    if (!email) throw new BadRequestException('Email is required');

    const result = await this.authService.forgotPassword(email);
    if (result)
      return {
        message: 'If the email exists, a password reset link has been sent.',
      };
    else throw new BadRequestException('No email found');
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    const result = await this.authService.resetPassword(
      body.token,
      body.newPassword,
    );
    if (result)
      return {
        message: 'Password has been successfully changed. You can now log in.',
      };
    else throw new BadRequestException('Invalid or expired token.');
  }

  @Post('activate')
  async activateAccount(@Body() body: { token: string }) {
    const result = await this.authService.activateUser(body.token);
    if (result)
      return {
        message:
          'Your account has been successfully activated. You can now log in.',
      };
    else throw new BadRequestException('Invalid or expired token.');
  }
}
