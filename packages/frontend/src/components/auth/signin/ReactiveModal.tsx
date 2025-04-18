'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
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

const codeSchema = z.string().min(1, 'Please enter a valid code');

interface ReactiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  initEmail?: string;
}

const ReactiveModal = ({ isOpen, onClose, initEmail }: ReactiveModalProps) => {
  const [code, setCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleClose = () => {
    setCode('');
    setCooldown(0);
    onClose();
  };

  const handleResendCode = async () => {
    try {
      setIsResending(true);

      const user = await client.auth.authControllerResendCode({
        email: initEmail,
      });

      if (!user) return;

      setCooldown(60);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) {
      setError('Please enter a valid code');
      return;
    }

    try {
      const user = await client.auth.authControllerCheckCode({
        email: initEmail,
        code,
      });

      if (!user) return;

      toast.success('Account verified successfully!');

      handleClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to verify code. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Verify your account</DialogTitle>
          <DialogDescription>Please provide your activation code to activate your account.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
            <input
              disabled
              id="email"
              type="email"
              defaultValue={initEmail}
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
                Code
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
              value={code}
              onChange={handleCodeChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter your code"
              aria-label="Code input"
            />
            {error && (
              <p className="text-sm text-red-500" role="alert">
                {error}
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
              Submit
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReactiveModal;
