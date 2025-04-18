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
import { CheckCodeDto, client, request } from '@/api';
import { BASE_URL } from '@/constants';

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

      console.log(user);

      if (!user) {
        toast.error('Invalid verification code. Please try again.');
        return;
      }

      toast.success('Account verified successfully!');

      // router.push('/auth/signin');
    } catch (error) {
      toast.error('Invalid verification code. Please try again.');
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
                      placeholder="123456"
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

            <p className="text-center text-sm text-muted-foreground">
              Didn't receive a code?{' '}
              <button
                type="button"
                className="font-medium text-primary hover:text-primary/90"
                onClick={() => {
                  // TODO: Implement resend code logic
                  toast.info('Verification code resent!');
                }}
              >
                Resend code
              </button>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyUI;
