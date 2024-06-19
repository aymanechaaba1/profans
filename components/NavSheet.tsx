'use client';

import { useState } from 'react';
import CustomSheet from './CustomSheet';
import { RiMenu4Line } from 'react-icons/ri';
import Link from 'next/link';
import { IoCalendar } from 'react-icons/io5';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

function NavSheet() {
  let [isOpen, setIsOpen] = useState(false);
  let pathname = usePathname();

  return (
    <CustomSheet
      className="px-0"
      triggerClassName="flex-1"
      trigger={<RiMenu4Line size={20} />}
      open={isOpen}
      setIsOpen={setIsOpen}
    >
      <nav className="flex-1 flex items-center gap-4 text-sm lg:gap-6 mt-10">
        <Link
          onClick={() => setIsOpen(false)}
          href={`/events`}
          className={cn(
            'flex items-center gap-x-5 w-full py-2 px-5 hover:bg-slate-900 text-gray-100',
            {
              'bg-slate-900': pathname === '/events',
            }
          )}
        >
          <IoCalendar size={15} className={cn()} />
          <p>Events</p>
        </Link>
      </nav>
    </CustomSheet>
  );
}

export default NavSheet;
