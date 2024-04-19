type Ticket = {
  ticketId: string;
  stripePriceId: string;
};

export const tickets: Ticket[] = [
  // PSG VS DORTMUND Semi-Finals Leg 1 of 2
  {
    ticketId: '86b58c86-832f-43a5-964c-dd1cdc7c37f8', // BASIC
    stripePriceId: 'price_1P7GCCGaTqN0NXIPdUl90iHk',
  },
  {
    ticketId: '8a79f03f-ed9b-44f9-b40b-10d3abcd9c29', // VIP PREMIUM PLAYERS ZONE
    stripePriceId: 'price_1P7GDbGaTqN0NXIPWKfMAzii',
  },
  {
    ticketId: '0bb01444-9220-45a1-80d6-51b529bb70ec', // VIP PREMIUM HONOR ZONE
    stripePriceId: 'price_1P7GECGaTqN0NXIPAhuThDqZ',
  },
  // REAL MADRID Semi-Finals Leg 1 of 2
  {
    ticketId: '', // BASIC
    stripePriceId: 'price_1P7GEtGaTqN0NXIPh2I6HLHe',
  },
  {
    ticketId: '', // VIP PREMIUM PLAYERS ZONE
    stripePriceId: 'price_1P7GFNGaTqN0NXIPqfCpD8gc',
  },
  {
    ticketId: '', // VIP PREMIUM HONOR ZONE
    stripePriceId: 'price_1P7GGWGaTqN0NXIPl2xggEW3',
  },
];
