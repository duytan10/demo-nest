import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: 1 })
  age: number;

  @Column({ nullable: true })
  activationToken: string;

  @Column({ default: false })
  active: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resetToken: string;

  @Column({ type: 'datetime', nullable: true })
  resetTokenExpiry: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
