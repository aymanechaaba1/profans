'use client';

import { users } from '@/drizzle/schema';
import { ReactNode, createContext } from 'react';

type User = typeof users.$inferSelect;
export const AuthContext = createContext<User | undefined>(undefined);

function AuthProvider({
  user,
  children,
}: {
  user: User | undefined;
  children: Readonly<ReactNode>;
}) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
