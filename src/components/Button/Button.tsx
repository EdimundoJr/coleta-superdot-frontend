import { Flex } from '@radix-ui/themes';
import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';

const SIZE_TYPES = ["Large", "Medium", "Small", "Extra Small", ""] as const;
const COLOR_TYPES = ['primary', 'red', 'green', 'gray', 'secondary', 'white', 'yellow'] as const;

type size = typeof SIZE_TYPES[number];
type color = typeof COLOR_TYPES[number];

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  size?: size;
  children?: ReactNode;
  className?: string;
  classNameTitle?: string;
  color?: color;
  loading?: boolean;
}

const sizeClasses = {
  Large: 'h-10 px-4 text-base',
  Medium: 'h-8 px-4 text-sm',
  Small: 'h-7 px-3 text-sm',
  'Extra Small': 'h-6 px-2 text-xs',
  '': ''
} satisfies Record<size, string>;

const colorClasses = {
  primary: 'bg-primary text-white hover:bg-secondary active:bg-primary active:brightness-90',
  red: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
  green: 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700',
  gray: 'bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700',
  secondary: 'bg-secondary text-white hover:bg-primary',
  white: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50',
  yellow: 'text-yellow-800 bg-yellow-100 hover:bg-yellow-200 active:bg-yellow-300',
} satisfies Record<color, string>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      title,
      children,
      color = 'primary',
      size = 'Medium',
      className = '',
      classNameTitle = '',
      disabled,
      loading = false,
      ...props
    },
    ref
  ) => {
    const sizeClass = sizeClasses[size as size];
    const colorClass = colorClasses[color as color];

    const baseClasses = [
      'inline-flex items-center justify-center rounded-md font-medium',
      'transition-colors btn-primary',
      disabled && 'opacity-50 cursor-not-allowed',
      sizeClass,
      colorClass,
      className
    ].filter(Boolean).join(' ');

    const Spinner = () => (
      <svg
        className="animate-spin h-5 w-5 "
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled}
        {...props}
      >
        {loading ? (
          <Spinner />
        ) : (
          <Flex align="center" gap="2" justify={'center'}>
            {children}
            <span className={`whitespace-nowrap ${classNameTitle} ${title == "" ? 'hidden' : ""}`}>
              {title}
            </span>
          </Flex>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';