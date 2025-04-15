import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '@/utils';
import { CreateAuthDto } from './dto/create-auth.dto';

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

  async login(user: any) {
    const payload = { username: user.email, sub: user._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async handleRegister(registerDto: CreateAuthDto) {
    return this.userService.register(registerDto);
  }
}
