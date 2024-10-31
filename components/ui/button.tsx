import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex w-full items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 dark:border-white",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:border-white",
        outline:
          "border-2 border-black/80 bg-background hover:bg-accent hover:text-accent-foreground dark:border-white",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:border-white",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:border-white",
        link: "text-primary underline-offset-4 hover:underline dark:border-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-2xl px-8",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  shadowType?: "circle" | "lg-shadow" | "sm-shadow";
  wFull?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, shadowType, wFull, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const renderShadow = () => {
      if (shadowType === "circle") {
        return (
          <div
            className="absolute border-2 rounded-full border-black h-10 w-10 bg-black/60 translate-y-1"
            style={{ zIndex: 0 }}
          />
        );
      } else if (shadowType === "lg-shadow") {
        return (
          <div
            className="absolute border-2 rounded-2xl border-black h-full w-full bg-black/60 translate-y-[5px]"
            style={{ zIndex: 0 }}
          />
        );
      } else if (shadowType === "sm-shadow") {
        return (
          <div
            className="absolute border-2 rounded-md border-black h-full w-full bg-black/60 translate-y-1 translate-x-1"
            style={{ zIndex: 0 }}
          />
        );
      }
      return null;
    };

    return (
      <div
        className={cn(
          "relative flex items-center justify-center",
          wFull && "w-full"
        )}
      >
        {renderShadow()}
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
          style={{ zIndex: 1 }}
        />
      </div>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
