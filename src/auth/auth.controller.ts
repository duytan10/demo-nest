import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RegisterUser } from './dto/register-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() registerUser: RegisterUser) {
    return this.authService.register({ ...registerUser });
  }

  @Post('login')
  async signIn(@Body() signInDto: { email: string; password: string }) {
    if (!signInDto.email || !signInDto.password)
      throw new BadRequestException('Email and new password are required');
    return this.authService.validateUser(signInDto.email, signInDto.password);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string, @Res() res: Response) {
    if (!email)
      throw new BadRequestException('Email and new password are required');
    const result = await this.authService.forgotPassword(email);
    return result
      ? res.send('If the email exists, a password reset link has been sent.')
      : res.status(400).send('No email founded!');
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { token: string; newPassword: string },
    @Res() res: Response,
  ) {
    const result = await this.authService.resetPassword(
      body.token,
      body.newPassword,
    );
    if (result) {
      return res.send(
        'Password has been successfully changed. You can now log in.',
      );
    } else {
      return res.status(400).send('Invalid or expired token.');
    }
  }

  @Post('activate')
  async activateAccount(@Body() body: { token: string }) {
    const result = await this.authService.activateUser(body.token);
    return result;
  }
}
