import { Lock } from 'lucide-react';
import { Button } from './ui/button';

function CheckoutBtn() {
  return (
    <Button className="w-full mt-5">
      <Lock className="mr-3" size={15} />
      <span>Checkout</span>
    </Button>
  );
}

export default CheckoutBtn;
