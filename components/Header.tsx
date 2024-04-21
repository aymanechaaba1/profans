import { logout } from '@/actions/logout';
import Avatar from './Avatar';
import { LogOut, ShoppingBasket, ShoppingCart } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import db from '@/drizzle';
import { getSession } from '@/actions/getSession';
import { getCachedUser, getUser } from '@/lib/utils';
import Image from 'next/image';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import SwitchMode from './SwitchMode';
import { Button } from './ui/button';

async function Header() {
  const user = await getUser();

  return (
    <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 max-w-screen-2xl items-center container gap-x-4">
        {/* logo */}
        <Link href={'/'}>
          <Image
            src={`https://firebasestorage.googleapis.com/v0/b/tadakirnet-clone-ae832.appspot.com/o/tadakirnet-clone%20logo2.png?alt=media&token=1518680c-5586-4e8f-a44a-d8fb1aadf408`}
            height={100}
            width={100}
            alt="logo"
            className="object-cover dark:invert"
          />
        </Link>
        {/* links */}
        <nav className="flex-1 flex items-center gap-4 text-sm lg:gap-6">
          <Link
            href={'/events'}
            className="transition-colors hover:text-foreground/80 text-foreground/60 tracking-tight scroll-m-20"
          >
            events
          </Link>
        </nav>

        {/* login and signup btns if user is not logged in */}
        {/* else display avatar */}
        {user ? (
          <div className="flex items-center gap-x-6">
            <Link href={`/cart`} className="relative">
              <ShoppingCart className="" />
              <p className="text-[10px] absolute top-0 -right-3 bg-gray-900 rounded-full text-white w-5 h-5 text-center align-middle flex items-center justify-center font-bold">
                {user.cart?.items?.length || 0}
              </p>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {user.firstname && user.lastname && (
                  <Avatar firstname={user.firstname} lastname={user.lastname} />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                  <p>
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <Link href={`/account`}>Account</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center justify-between">
                  <SwitchMode />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <form action={logout}>
                    <button type="submit">logout</button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link href={'/login'} className="py-2 px-3 text-sm">
              login
            </Link>
            <Link
              href={'/register'}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-white text-primary-foreground shadow h-9 px-4 py-2 rounded-[6px]"
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
