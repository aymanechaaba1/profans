import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Dispatch, ReactNode, SetStateAction } from 'react';

function CustomSheet({
  children,
  trigger,
  open,
  setIsOpen,
  title,
  description,
  className,
  triggerClassName,
  side = 'left',
}: {
  children: ReactNode;
  trigger: ReactNode;
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title?: string;
  description?: string;
  className?: string;
  triggerClassName?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}) {
  return (
    <Sheet open={open} onOpenChange={setIsOpen}>
      <SheetTrigger className={cn(triggerClassName)}>{trigger}</SheetTrigger>
      <SheetContent side={side} className={cn(className)}>
        <SheetHeader>
          {title && <SheetTitle>{title}</SheetTitle>}
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}

export default CustomSheet;
