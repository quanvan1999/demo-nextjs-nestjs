import { Body, Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from './decorator/customize';
import {
  CheckCodeDto,
  CreateAuthDto,
  RegisterResponseDto,
  ResendCodeDto,
  ResendPasswordDto,
  UserLoginDto,
  UserLoginResponseDto,
} from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '@/decorator/customize';
import { PostAPI } from '@/decorator/custom.decorators';
import { ResetPasswordDto } from './dto/update-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @PostAPI('login', { type: UserLoginDto })
  @Public()
  async handleLogin(@Request() { user }: { user: UserLoginResponseDto }) {
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

  @PostAPI('check-code', { type: RegisterResponseDto })
  @Public()
  @ResponseMessage('Check code successfully')
  checkCode(@Body() checkCodeDto: CheckCodeDto) {
    return this.authService.checkCode(checkCodeDto);
  }

  @PostAPI('resend-code', { type: RegisterResponseDto })
  @Public()
  @ResponseMessage('Resend code successfully')
  resendCode(@Body() resendCodeDto: ResendCodeDto) {
    return this.authService.resendCode(resendCodeDto);
  }

  @PostAPI('resend-password', { type: RegisterResponseDto })
  @Public()
  @ResponseMessage('Resend password successfully')
  resendPassword(@Body() resendPasswordDto: ResendPasswordDto) {
    return this.authService.resendPassword(resendPasswordDto);
  }

  @PostAPI('reset-password', { type: RegisterResponseDto })
  @Public()
  @ResponseMessage('Reset password successfully')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
