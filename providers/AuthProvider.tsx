'use client';

import { users } from '@/drizzle/schema';
import { getUser } from '@/lib/utils';
import { ReactNode, createContext } from 'react';

type User = Awaited<ReturnType<typeof getUser>>;
export const AuthContext = createContext<User | undefined>(undefined);

function AuthProvider({
  user,
  children,
}: {
  user: User;
  children: Readonly<ReactNode>;
}) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
