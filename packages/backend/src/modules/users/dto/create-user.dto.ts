import { IsNotEmpty, IsEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsEmpty()
  phone: string;

  @IsEmpty()
  address: string;

  @IsEmpty()
  image: string;
}
