import { relations } from 'drizzle-orm';
import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const genderEnum = pgEnum('gender', ['male', 'female']);
export const statusEnum = pgEnum('status', [
  'pending',
  'processing',
  'success',
  'failed',
]);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    gender: genderEnum('gender').notNull(),
    firstname: text('firstname').notNull(),
    lastname: text('lastname').notNull(),
    cin: text('cin').unique().notNull(),
    birthdate: timestamp('birthdate').notNull(),
    city: text('city').notNull(),
    phone: text('phone').unique().notNull(),
    email: text('email').unique().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex('unique_idx').on(users.email),
    };
  }
);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  status: statusEnum('status').default('pending'),
  total: numeric('total').default('0'),
  userId: uuid('user_id').notNull(),
});

export const tickets = pgTable('tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  stock: integer('stock').default(0),
  eventId: uuid('event_id'),
  optionId: uuid('option_id').notNull(),
});

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  name: text('name').notNull(),
  description: text('description').default(''),
  time: timestamp('time').notNull(),
  location: text('location').notNull(),
  thumbnail: text('thumbnail').default(''),
});

export const eventOptions = pgTable('event_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  name: text('name').notNull(),
  price: numeric('price').default('0'),
  eventId: uuid('event_id').notNull(),
});

export const cart = pgTable('cart', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  userId: uuid('user_id').notNull(),
});

export const cartRelations = relations(cart, ({ one, many }) => ({
  items: many(cartItems),
}));

export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  quantity: integer('quantity').notNull(),
  cartId: uuid('cart_id').notNull(),
  ticketId: uuid('ticket_id').notNull(),
});

export const cartItemsRelations = relations(cartItems, ({ one, many }) => ({
  cart: one(cart, {
    fields: [cartItems.cartId],
    references: [cart.id],
  }),
  ticket: one(tickets, {
    fields: [cartItems.ticketId],
    references: [tickets.id],
  }),
}));

// users-orders (one-to-many)
export const usersRelations = relations(users, ({ many, one }) => ({
  orders: many(orders),
  cart: one(cart, {
    fields: [users.id],
    references: [cart.userId],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  author: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  tickets: many(ordersToTickets),
}));

// events-tickets (one-to-many)
export const eventsRelations = relations(events, ({ many }) => ({
  tickets: many(tickets),
  options: many(eventOptions),
}));

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  author: one(events, {
    fields: [tickets.eventId],
    references: [events.id],
  }),
  orders: many(ordersToTickets),
  eventOption: one(eventOptions, {
    fields: [tickets.optionId],
    references: [eventOptions.id],
  }),
  cartItems: many(cartItems),
}));

// orders-tickets (many-to-many)
export const ordersToTickets = pgTable(
  'orders_to_tickets',
  {
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id),
    ticketId: uuid('ticket_id')
      .notNull()
      .references(() => tickets.id),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.orderId, t.ticketId],
    }),
  })
);

export const ordersToTicketsRelations = relations(
  ordersToTickets,
  ({ one }) => ({
    ticket: one(tickets, {
      fields: [ordersToTickets.ticketId],
      references: [tickets.id],
    }),
    order: one(orders, {
      fields: [ordersToTickets.orderId],
      references: [orders.id],
    }),
  })
);

// events-eventOptions
export const eventOptionsRelations = relations(
  eventOptions,
  ({ one, many }) => ({
    event: one(events, {
      fields: [eventOptions.eventId],
      references: [events.id],
    }),
    tickets: many(tickets),
  })
);

// cart-cartItems
