import { logout } from '@/actions/logout';
import Avatar from './Avatar';
import { getSession } from '@/actions/getSession';
import { LogOut } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

async function Header() {
  const session = await getSession();

  return (
    <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 max-w-screen-2xl items-center container gap-x-4">
        {/* logo */}
        <Link href={'/'}>logo</Link>
        {/* links */}
        <nav className="flex-1 flex items-center gap-4 text-sm lg:gap-6">
          <Link
            href={'/'}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            link
          </Link>
        </nav>
        {/* login and signup btns if user is not logged in */}
        {/* else display avatar */}
        {session && session.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {session.user.firstname && session.user.lastname && (
                <Avatar
                  firstname={session.user.firstname}
                  lastname={session.user.lastname}
                />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>
                <p>
                  {session?.user?.firstname} {session?.user?.lastname}
                </p>
                <p className="text-xs text-gray-500">{session.user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <form action={logout}>
                  <button type="submit">logout</button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-4">
            <Link href={'/login'} className="py-2 px-3 text-sm">
              login
            </Link>
            <Link
              href={'/register'}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-primary-foreground shadow hover:bg-blue-600 h-9 px-4 py-2 rounded-[6px]"
            >
              signup
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
