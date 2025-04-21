import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty()
  password: string;

  @IsOptional()
  @ApiProperty()
  name: string;
}

export class UserLoginDto {
  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;
}

export class UserLoginResponseDto {
  @IsString()
  @ApiProperty()
  _id: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  role: string;

  @IsString()
  @ApiProperty()
  access_token: string;

  @IsString()
  @ApiProperty()
  password: string;
}

export class RegisterResponseDto {
  @IsString()
  @ApiProperty()
  _id: string;
}

export class CheckCodeDto {
  @IsString()
  @ApiProperty()
  code: string;

  @IsOptional()
  @ApiProperty({ required: false })
  _id?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  email?: string;
}

export class ResendCodeDto {
  @IsOptional()
  @ApiProperty({ required: false })
  _id?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  email?: string;
}

export class ResendPasswordDto {
  @IsOptional()
  @ApiProperty({ required: false })
  _id?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  email?: string;
}
