import React from 'react';
import { BentoGrid, BentoGridItem } from './ui/bento-grid';
import { Headset, HeartHandshake, Zap } from 'lucide-react';

export function FeaturesSection() {
  return (
    <BentoGrid className="container">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}
const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-2xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-gray-900"></div>
);
const items = [
  {
    title: 'Fast Secure Checkout',
    description:
      'Say goodbye to long queues and last-minute hassles! Our secure ticketing system ensures a seamless and hassle-free booking process.',
    header: <Skeleton />,
    className: 'md:col-span-1 dark:bg-gradient-radial',
    icon: <Zap className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'Exclusive Deals and Rewards',
    description:
      "As a valued member of our platform, you'll gain access to exclusive deals, discounts, and rewards.",
    header: <Skeleton />,
    className: 'md:col-span-1 dark:bg-gradient-radial',
    icon: <HeartHandshake className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: '24/7 Online Support',
    description:
      'No matter the time of day or night, our dedicated support team is here to assist you.',
    header: <Skeleton />,
    className: 'md:col-span-1 dark:bg-gradient-radial',
    icon: <Headset className="h-4 w-4 text-neutral-500" />,
  },
];
