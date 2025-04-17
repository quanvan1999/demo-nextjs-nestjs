import { auth } from '@/auth';
import SignInUI from '@/components/auth/signin/SignInUI';

export default async function SignIn() {
  const session = await auth();

  console.log(session);

  return <SignInUI />;
}
