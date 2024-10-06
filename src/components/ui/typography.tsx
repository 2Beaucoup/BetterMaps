import { twMerge } from "tailwind-merge";

interface TypographyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

interface TypographyHProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

export function LandingH1({ children, className, ...props }: TypographyHProps) {
  return (
    <h1
      className={twMerge(
        "text-6xl font-semibold",
        "tracking-tighter leading-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H1({ children, className, ...props }: TypographyHProps) {
  return (
    <h1
      className={twMerge(
        "text-5xl font-semibold",
        "tracking-tight leading-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className, ...props }: TypographyHProps) {
  return (
    <h2
      className={twMerge("text-4xl font-semibold", "tracking-tight", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className, ...props }: TypographyHProps) {
  return (
    <h3
      className={twMerge(
        "text-3xl font-semibold",
        "tracking-tighter",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function H4({ children, className, ...props }: TypographyHProps) {
  return (
    <h4
      className={twMerge("text-xl font-medium tracking-tight", className)}
      {...props}
    >
      {children}
    </h4>
  );
}

export function P({ children, className, ...props }: TypographyProps) {
  return (
    <p className={twMerge("text-inherit", className)} {...props}>
      {children}
    </p>
  );
}

export function Subtitle({ children, className, ...props }: TypographyProps) {
  return (
    <p
      className={twMerge(
        "text-lg font-medium tracking-wider",
        "uppercase",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
