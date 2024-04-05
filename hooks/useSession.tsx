'use client';

import { AuthContext } from '@/providers/AuthProvider';
import { useContext } from 'react';

function useSession() {
  const user = useContext(AuthContext);
  return { user };
}

export default useSession;
