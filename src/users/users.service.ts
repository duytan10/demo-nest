import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUser } from 'src/auth/dto/register-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createNew(userDto: RegisterUser): Promise<User> {
    const user = this.usersRepository.create(userDto);
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }

  async findUserLogin(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email, active: true },
    });
    return user;
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user;
  }

  async findByToken(activationToken: string) {
    if (!activationToken) return null;
    const user = await this.usersRepository.findOne({
      where: { activationToken },
    });
    return user;
  }

  async findByResetToken(resetToken: string) {
    if (!resetToken) return null;
    const user = await this.usersRepository.findOne({
      where: { resetToken },
    });
    return user;
  }

  async save(user: User) {
    return this.usersRepository.save(user);
  }
}
