import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '@/utils';
import { CheckCodeDto, CreateAuthDto, UserLoginDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email');
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');
    return user;
  }

  async login(user: UserLoginDto) {
    const payload = { username: user.email, sub: user._id };
    const accessToken = await this.jwtService.signAsync(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { role, _id, email, name } = user;

    return {
      access_token: accessToken,
      email,
      name,
      role,
      _id,
    };
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const user = await this.userService.register(registerDto);
    return {
      _id: user._id,
    };
  }

  async checkCode(checkCodeDto: CheckCodeDto) {
    return this.userService.checkCode(checkCodeDto);
  }
}
