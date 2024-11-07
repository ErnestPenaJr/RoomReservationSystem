import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, icon: Icon, error, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-foreground mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <input
            ref={ref}
            className={`block w-full rounded-md border-border bg-background px-3 py-2 shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm
              ${Icon ? 'pl-10' : ''} 
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} 
              ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;