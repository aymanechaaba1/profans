import Cart from '@/components/Cart';
import CartItem from '@/components/CartItem';
import { Card } from '@/components/ui/card';
import { getUser } from '@/lib/utils';

async function CartPage() {
  const user = await getUser();

  console.log(user?.cart.items);

  return (
    <div className="">
      <Cart basket={user?.cart} />
    </div>
  );
}

export default CartPage;
