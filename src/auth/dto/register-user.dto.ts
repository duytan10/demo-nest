import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUser {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;

  @IsNotEmpty({ message: 'First name should not be empty' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name should not be empty' })
  lastName: string;

  @IsNotEmpty({ message: 'Phone should not be empty' })
  phone: string;

  @IsNotEmpty({ message: 'Age should not be empty' })
  age: number;
}
