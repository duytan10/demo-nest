import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUser } from './dto/register-user.dto';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(user: RegisterUser): Promise<{ message: string }> {
    /**
     * if user exist -> 
     *  check activateTokenExpiry -> if activateTokenExpiry > Date() -> send noti check email
     */

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(user.email);
    if (existingUser)
      throw new BadRequestException(
        'A user with this email address already exists.',
      );

    // Create a new user with hashed password and activation token
    const activationToken = uuidv4();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await this.usersService.createNew({
      ...user,
      password: hashedPassword,
      activationToken,
    });

    // Send activation email
    this.mailService.sendActivationEmail(
      user.email,
      activationToken,
      user.firstName,
    );

    return {
      message:
        'User created successfully, please check your email to activate your account.',
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);

    if (user && !user.active)
      throw new UnauthorizedException('Account not activated');

    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user?.id };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const resetToken = uuidv4();
      user.resetToken = resetToken;
      user.resetTokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour
      await this.usersService.save(user);
      this.mailService.sendResetPasswordEmail(
        user.email,
        resetToken,
        user.firstName,
      );
      return true;
    }
    return false;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await this.usersService.findByResetToken(token);
    if (!user || user.resetTokenExpiry <= new Date()) return false;

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null as any;
    user.resetTokenExpiry = null as any;
    await this.usersService.save(user);
    return true;
  }

  async activateUser(token: string): Promise<boolean> {
    const user = await this.usersService.findByToken(token);
    if (!user) return false;

    user.active = true;
    user.activationToken = null as any;
    await this.usersService.save(user);
    return true;
  }
}
