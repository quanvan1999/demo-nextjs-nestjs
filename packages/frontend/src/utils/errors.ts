import { AuthError, CredentialsSignin } from 'next-auth';

export class CustomAuthError extends AuthError {
  static type: string;

  constructor(message?: any) {
    super();

    this.type = message;
  }
}

export class InvalidCredentialsError extends CredentialsSignin {
  code = 'custom';
  constructor(message: string) {
    super(message);
    this.code = message;
  }
}
