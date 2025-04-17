import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty()
  password: string;

  @IsEmpty()
  @ApiProperty()
  phone: string;

  @IsEmpty()
  @ApiProperty()
  address: string;

  @IsEmpty()
  @ApiProperty()
  image: string;
}
