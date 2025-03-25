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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(user: RegisterUser) {
    const existingUser = await this.usersService.findByEmail(user.email);
    if (existingUser)
      throw new BadRequestException('Email is already registered');

    const hashedPassword = await bcrypt.hash(user.password, 10);
    return this.usersService.createNew({
      ...user,
      password: hashedPassword,
    });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);
    console.log(user);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { sub: user?.id };
      return { access_token: await this.jwtService.signAsync(payload) };
    }
    throw new UnauthorizedException();
  }

  async forgotPassword(email: string, password: string): Promise<string> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return 'Email not registered. Please check and try again.';
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await this.usersService.save(user);
    return 'Password has been successfully updated.';
  }
}
