'use client';

import React, { ReactNode } from 'react';
import * as D from '@headlessui/react';
import { cn } from '@/lib/utils';

function Dialog({
  title,
  description,
  children,
  isOpen,
  setIsOpen,
  className,
  trigger,
  panelClassName,
}: {
  title?: string;
  description?: string;
  children: Readonly<React.ReactNode>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  trigger: React.ReactNode;
  panelClassName?: string;
}) {
  return (
    <>
      <button onClick={() => setIsOpen(true)}>{trigger}</button>
      <D.Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className={cn('relative z-50 rounded-lg', className)}
      >
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div
          className={cn(
            'fixed inset-0 flex w-screen items-center justify-center p-4 rounded-lg'
          )}
        >
          <D.DialogPanel
            className={cn('w-full border rounded-lg', panelClassName)}
          >
            {title && (
              <D.DialogTitle className="font-bold mb-2">{title}</D.DialogTitle>
            )}
            {description && <D.Description>{description}</D.Description>}
            {children}
          </D.DialogPanel>
        </div>
      </D.Dialog>
    </>
  );
}

export default Dialog;
