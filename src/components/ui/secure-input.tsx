import * as React from "react";
import { Input } from "@/components/ui/input";
import { sanitizeInput } from "@/utils/security";
import { cn } from "@/lib/utils";

interface SecureInputProps extends React.ComponentProps<"input"> {
  sanitize?: boolean;
  maxLength?: number;
}

const SecureInput = React.forwardRef<HTMLInputElement, SecureInputProps>(
  ({ className, type, onChange, sanitize = true, maxLength = 1000, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        if (sanitize && type !== "password") {
          // Don't sanitize passwords, but sanitize other inputs
          const sanitizedValue = sanitizeInput(e.target.value);
          if (sanitizedValue.length <= maxLength) {
            const syntheticEvent = {
              ...e,
              target: { ...e.target, value: sanitizedValue }
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
          }
        } else {
          // For passwords and non-sanitized inputs, just enforce length
          if (e.target.value.length <= maxLength) {
            onChange(e);
          }
        }
      }
    };

    return (
      <Input
        type={type}
        className={cn(className)}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    );
  }
);

SecureInput.displayName = "SecureInput";

export { SecureInput };