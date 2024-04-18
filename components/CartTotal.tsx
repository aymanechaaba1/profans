import { formatPrice } from '@/utils/helpers';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

function CartTotal({ total }: { total: number }) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Total to Pay</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-semibold text-3xl">{formatPrice(total)}</p>
      </CardContent>
    </Card>
  );
}

export default CartTotal;
