import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RegisterUser } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() registerUser: RegisterUser) {
    return this.authService.register({ ...registerUser });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.validateUser(signInDto.email, signInDto.password);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() body: { email: string; newPassword: string },
  ): Promise<string> {
    const { email, newPassword } = body;
    if (!email || !newPassword)
      throw new BadRequestException('Email and new password are required');
    return this.authService.forgotPassword(email, newPassword);
  }
}
