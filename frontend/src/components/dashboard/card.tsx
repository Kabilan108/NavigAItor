import {
  Card as CardBase,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  title: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export default function Card({
  children,
  className,
  title,
  description,
  footer,
}: Props) {
  return (
    <CardBase className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </CardBase>
  );
}
