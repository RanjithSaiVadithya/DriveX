import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent text-sm font-semibold whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/40 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-olive text-warm-white hover:bg-olive-hover focus-visible:ring-olive/40",
        navy: "bg-deep-navy text-warm-white hover:bg-deep-navy/90 focus-visible:ring-deep-navy/40",
        accent:
          "bg-olive text-warm-white hover:bg-olive-hover focus-visible:ring-olive/40",
        outline:
          "border-deep-navy/20 bg-warm-white text-deep-navy hover:bg-muted",
        secondary: "bg-secondary text-deep-navy hover:bg-warm-beige/80",
        ghost: "text-deep-navy hover:bg-muted",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "rounded-md text-olive underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 gap-2 px-5",
        sm: "h-9 gap-1.5 px-4 text-sm",
        lg: "h-12 gap-2 px-7 text-base",
        xl: "h-14 gap-2 px-8 text-base",
        icon: "size-11",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
