'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { client } from '@/api';
import { toast } from 'sonner';

const formSchema = z
  .object({
    email: z.string().email('Please enter a valid email'),
    code: z.string().min(1, 'Please enter a valid code'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof formSchema>;

interface UpdatePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initEmail?: string;
}

const UpdatePasswordModal = ({ isOpen, onClose, initEmail }: UpdatePasswordModalProps) => {
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { email } = useWatch({ control });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev: number) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleClose = () => {
    reset();
    setCooldown(0);
    onClose();
  };

  useEffect(() => {
    if (initEmail) {
      reset({ email: initEmail });
    }
  }, [initEmail]);

  const handleResendCode = async () => {
    try {
      setIsResending(true);

      const user = await client.auth.authControllerResendPassword({
        email,
      });

      if (!user) return;

      setCooldown(60);
      toast.success('Verification code sent successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const user = await client.auth.authControllerResetPassword({
        email: data.email,
        code: data.code,
        password: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      if (!user) return;

      toast.success('Password updated successfully!');
      handleClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update password. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Update Password</DialogTitle>
          <DialogDescription>Please verify your email and set a new password.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter your email"
              aria-label="Email input"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="code"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Verification Code
              </label>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={cooldown > 0 || isResending}
                className="text-sm text-primary hover:text-primary/90 disabled:opacity-50"
                aria-label="Resend verification code"
              >
                {isResending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Send code'}
              </button>
            </div>
            <input
              id="code"
              type="text"
              {...register('code')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter verification code"
              aria-label="Verification code input"
            />
            {errors.code && (
              <p className="text-sm text-red-500" role="alert">
                {errors.code.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="newPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              {...register('newPassword')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter new password"
              aria-label="New password input"
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500" role="alert">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Confirm new password"
              aria-label="Confirm password input"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Update Password
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePasswordModal;
