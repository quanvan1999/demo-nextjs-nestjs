import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
} as const;

const Spinner = ({ size = 'md', className }: SpinnerProps) => {
  return (
    <div role="status" aria-label="Loading" className={cn('flex items-center justify-center', className)}>
      <motion.div
        className={cn('rounded-full border-primary border-r-transparent', sizeClasses[size])}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 0.8,
          ease: 'linear',
          repeat: Infinity,
        }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export { Spinner };
