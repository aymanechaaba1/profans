import { cart } from '@/drizzle/schema';
import CartItems from './CartItems';
import { getCart } from '@/actions/getCart';
import CartTotal from './CartTotal';
import CheckoutBtn from './CheckoutBtn';
import { getCartTotal } from '@/lib/utils';
import { Separator } from './ui/separator';
import db from '@/drizzle';

async function Cart({
  basket,
}: {
  basket: Awaited<ReturnType<typeof getCart>>;
}) {
  const total = await getCartTotal();

  if (basket)
    return (
      <div>
        <h1 className="text-2xl scroll-m-20 tracking-tight font-semibold">
          Your Cart
        </h1>
        <div className="flex flex-col md:flex-row gap-y-5 md:gap-x-5 mt-5">
          <CartItems items={basket.items} />
          <div className="md:w-1/3">
            <CartTotal total={total} />
            {basket.items.length > 0 && (
              <CheckoutBtn basketItems={basket.items} />
            )}
          </div>
        </div>
      </div>
    );

  return (
    <p className="text-center text-sm tracking-tight scroll-m-20 text-muted-foreground">
      you must log in
    </p>
  );
}

export default Cart;
