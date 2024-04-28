import { formatId } from '@/lib/utils';
import { formatPrice } from '@/utils/helpers';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Image from 'next/image';

export default async function TicketLayout() {
  return (
    <div className="flex flex-col justify-between border rounded-lg h-screen">
      <header>header</header>
      <main className="">main</main>
      <footer>footer</footer>
    </div>
  );
}
