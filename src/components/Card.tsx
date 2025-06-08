import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const cardVariants = cva(
  "rounded-lg border bg-white shadow-sm transition-all",
  {
    variants: {
      variant: {
        default: "border-neutral-200 hover:shadow-md",
        elevated: "border-neutral-200 shadow-md hover:shadow-lg",
        outline: "border-neutral-300",
        ghost: "border-transparent shadow-none hover:bg-neutral-50",
      },
      padding: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        none: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

const cardHeaderVariants = cva("flex flex-col space-y-1.5");

const cardTitleVariants = cva(
  "text-lg font-semibold leading-none tracking-tight text-neutral-900"
);

const cardDescriptionVariants = cva("text-sm text-neutral-600");

const cardContentVariants = cva("text-neutral-900");

const cardFooterVariants = cva("flex items-center pt-4");

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = ({ className, variant, padding, ...props }: CardProps) => {
  return (
    <div
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  );
};

export const CardHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn(cardHeaderVariants(), className)} {...props} />;
};

export const CardTitle = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => {
  return <h3 className={cn(cardTitleVariants(), className)} {...props} />;
};

export const CardDescription = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => {
  return <p className={cn(cardDescriptionVariants(), className)} {...props} />;
};

export const CardContent = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn(cardContentVariants(), className)} {...props} />;
};

export const CardFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn(cardFooterVariants(), className)} {...props} />;
};

export default Card;
