import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";
import type { FieldError } from "react-hook-form";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export interface InputWithLabelProps extends InputProps {
  label?: string;
}

const InputWithLabel = React.forwardRef<HTMLInputElement, InputWithLabelProps>(
  ({ className, name, label, type, ...props }, ref) => {
    const error = props.error;
    return (
      <div className="flex flex-col gap-1">
        <Label htmlFor={name}>{label || name || "Label"}</Label>
        <Input
          type={type}
          className={cn("rounded-md", className)}
          ref={ref}
          name={name}
          {...props}
        />
        {error && (
          <span className="text-sm text-destructive">
            {error && error.message}
          </span>
        )}
      </div>
    );
  },
);
InputWithLabel.displayName = "InputWithLabel";

export { Input, InputWithLabel };
