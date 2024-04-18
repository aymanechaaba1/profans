import { getSession } from '@/actions/getSession';
import db from '@/drizzle';
import { cartItems, eventOptions, tickets } from '@/drizzle/schema';
import { MoroccanCitiesResponse } from '@/types/moroccan-cities';
import { type ClassValue, clsx } from 'clsx';
import { eq, sql } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getCities() {
  const res = await fetch(
    'https://parseapi.back4app.com/classes/List_of_Morroco_cities?order=asciiname',
    {
      headers: {
        'X-Parse-Application-Id': '2ZOfB60kP39M5kE4WynRqyP7lNGKZ9MB8fVWqAM9', // This is the fake app's application id
        'X-Parse-Master-Key': 'Qq7lEIoEEzRris3IM6POE5ewvYuzACVyA6VKtiVb', // This is the fake app's readonly master key
      },
    }
  );

  if (!res.ok) throw new Error(`something went wrong!`);

  const data: MoroccanCitiesResponse = await res.json();
}

export async function getUser() {
  const session = await getSession();
  let user;

  if (session && session.id)
    user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session.id as string),
      with: {
        cart: {
          with: {
            items: true,
          },
        },
        orders: {
          with: {
            tickets: true,
          },
        },
      },
    });

  return user;
}

export const getCachedUser = unstable_cache(getUser, ['user'], {
  tags: ['user'],
});

export const getCartTotal = async () => {
  // SELECT SUM(event_options.price * cart_items.quantity)
  // FROM event_options
  // JOIN tickets ON event_options.id = tickets.option_id
  // JOIN cart_items ON tickets.id = cart_items.ticket_id;
  const [total] = await db
    .select({
      total: sql<number>`SUM(${eventOptions.price} * ${cartItems.quantity})`,
    })
    .from(eventOptions)
    .fullJoin(tickets, eq(eventOptions.id, tickets.optionId))
    .fullJoin(cartItems, eq(tickets.id, cartItems.ticketId));

  return total.total;
};

export const getUrl = () =>
  process.env.VERCEL_ENV === 'development'
    ? 'http://localhost:3000'
    : `https://${process.env.VERCEL_URL}`;

export const createOrderId = (orderId: string) =>
  orderId
    .split('-')
    .map((word) => word.slice(0, 4).toUpperCase())
    .join('');
