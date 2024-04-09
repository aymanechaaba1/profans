'use client';

import { Lock } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function CheckoutBtn() {
  return (
    <Button className="w-full mt-5" onClick={() => {}}>
      <Lock className="mr-3" size={15} />
      <span>Checkout</span>
    </Button>
  );
}

export default CheckoutBtn;
