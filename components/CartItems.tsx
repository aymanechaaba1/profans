import { cart, cartItems } from '@/drizzle/schema';
import CartItem from './CartItem';

function CartItems({ items }: { items: (typeof cartItems.$inferSelect)[] }) {
  return (
    <div className="flex-1">
      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-y-4 border p-4 rounded-lg">
          {items.map((cartItem) => (
            <CartItem key={cartItem.id} cartItem={cartItem} />
          ))}
        </div>
      ) : (
        <small className="small">your cart is empty.</small>
      )}
    </div>
  );
}

export default CartItems;
