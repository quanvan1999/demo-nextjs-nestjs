import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from './decorator/customize';
import { CheckCodeDto, CreateAuthDto, RegisterResponseDto, UserLoginDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '@/decorator/customize';
import { PostAPI } from '@/decorator/custom.decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Login successfully')
  @ApiResponse({
    status: 201,
    description: 'User successfully login',
    type: UserLoginDto,
  })
  async handleLogin(@Request() { user }: { user: UserLoginDto }) {
    return this.authService.login(user);
  }

  @PostAPI('register', { type: RegisterResponseDto })
  @Public()
  async handleRegister(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Get('verify-email')
  @Public()
  async verifyEmail() {
    try {
      this.mailerService.sendMail({
        to: 'vanthuanquan@gmail.com',
        subject: 'Test email',
        text: 'Test',
        template: 'register',
        context: {
          name: 'John Doe',
          activationCode: '123456',
        },
      });
      return 'ok';
    } catch (error) {
      console.log(error);
    }
  }

  @Post('check-code')
  @Public()
  @ResponseMessage('Check code successfully')
  @ApiResponse({
    status: 201,
    description: 'User successfully check code',
    type: RegisterResponseDto,
  })
  checkCode(@Body() checkCodeDto: CheckCodeDto) {
    return this.authService.checkCode(checkCodeDto);
  }
}
