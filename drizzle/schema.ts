import {
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const genderEnum = pgEnum('gender', ['male', 'female']);

export const users = pgTable('users', {
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
});
