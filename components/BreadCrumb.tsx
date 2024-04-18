'use client';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { uuid } from 'uuidv4';

function BreadCrumb() {
  const pathname = usePathname();
  const pathnames = pathname.split('/').slice(1);
  const [n, setN] = useState(0);

  useEffect(() => {
    setN(pathnames.length);
  }, [pathnames]);

  return (
    <Breadcrumb className="mt-5">
      <BreadcrumbList>
        {pathnames.map((pathname, i, arr) => (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {i === n - 1 ? (
                <BreadcrumbPage>{pathname}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={`/${pathnames.slice(0, i + 1).join('/')}`}
                >
                  {pathname}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadCrumb;
