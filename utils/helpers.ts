import { MoroccanCitiesResponse } from '@/types/moroccan-cities';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { APP_URL, MODE } from './config';

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
  return data;
}

export const getFirstLetters = (...names: string[]) =>
  names.map((name) => name[0].toUpperCase()).join('');

export async function getTeams() {
  const url = 'https://api-football-v1.p.rapidapi.com/v2/teams/league/2';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '4ef091339bmsh01863cf3bb48f49p191d37jsnab835b4f8447',
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

export async function simulateLongTask(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export const formatPrice = (price: number, currency: string = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);

export const getUrl = (path: string = '/') => {
  let url =
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
      ? `http://localhost:3000`
      : APP_URL;
  url += path;
  return url;
};

export const upperFirst = (word: string) =>
  word[0].toUpperCase().concat(word.slice(1));

export function htmlToBuffer(html: string) {
  let blob = new Blob([html], { type: 'text/html' });

  let reader = new FileReader();
  let buffer: string | ArrayBuffer | null | undefined;

  reader.onload = function (event) {
    buffer = event?.target?.result;
  };
  reader.readAsArrayBuffer(blob);

  return buffer;
}

export function sum(a: number, b: number) {
  return a + b;
}

export const getPath = (userId: string, orderId: string, ticketId: string) =>
  `/orders/${userId}/${orderId}_${ticketId}`;
