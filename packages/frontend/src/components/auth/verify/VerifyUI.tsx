'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { client } from '@/api';
import Link from 'next/link';

const verifySchema = z.object({
  code: z.string().min(1, 'Verification code is required'),
});

type VerifyFormData = z.infer<typeof verifySchema>;

const VerifyUI = ({ id }: { id: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  const handleSubmit = async (data: VerifyFormData) => {
    try {
      setIsLoading(true);

      const user = await client.auth.authControllerCheckCode({
        _id: id,
        code: data.code,
      });

      if (!user) return;

      toast.success('Account verified successfully!');

      router.push('/auth/signin');
    } catch (error) {
      toast.error('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);

      const user = await client.auth.authControllerResendCode({
        _id: id,
      });

      if (!user) return;

      toast.success('Verification code resent!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to resend verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Verify your account</h1>
          <p className="text-sm text-muted-foreground">Enter the verification code sent to your email</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Verification code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the verification code"
                      className={cn('text-center tracking-widest', {
                        'border-destructive': form.formState.errors.code,
                      })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify account'}
            </Button>

            <div className="space-y-4 flex flex-col items-center">
              <p className="text-center text-sm text-muted-foreground">
                Didn't receive a code?{' '}
                <button
                  type="button"
                  className="font-medium text-primary hover:text-primary/90"
                  onClick={handleResendCode}
                >
                  Resend code
                </button>
              </p>

              <div>
                <Link
                  className="w-full text-center block text-sm text-primary hover:text-primary/90"
                  href="/auth/signin"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyUI;
