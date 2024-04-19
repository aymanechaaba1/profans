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
    ticketId: 'e2607883-d141-43e9-a9dd-610ff95c8603', // BASIC
    stripePriceId: 'price_1P7GEtGaTqN0NXIPh2I6HLHe',
  },
  {
    ticketId: '04a07a43-b744-4438-a3f4-8156354b1ea5', // VIP PREMIUM PLAYERS ZONE
    stripePriceId: 'price_1P7GFNGaTqN0NXIPqfCpD8gc',
  },
  {
    ticketId: '990acdb1-11a5-4d3d-907e-9046de4eb31a', // VIP PREMIUM HONOR ZONE
    stripePriceId: 'price_1P7GGWGaTqN0NXIPl2xggEW3',
  },
];
