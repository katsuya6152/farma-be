import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const todos = sqliteTable('todoss', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	todo: text('todo').notNull(),
	score: integer('score', { mode: 'number' }).default(0),
	isDone: integer('isDone', { mode: 'boolean' }).default(false),
	createAt: text('create_at').default(sql`CURRENT_TIMESTAMP`),
});

export const shipping = sqliteTable('shipping', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	father: text('father'),
	mothersFather: text('mothers_father'),
	mothersGrandfather: text('mothers_grandfather'),
	grandmothersGrandfather: text('grandmothers_grandfather'),
	matingDate: text('mating_date'),
	expectedBirthDate: text('expected_birth_date'),
	birthDate: text('birth_date'),
	auctionDate: text('auction_date'),
	weight: integer('weight', { mode: 'number' }).default(0),
	daysOld: integer('days_old', { mode: 'number' }).default(0),
	sex: text('sex'),
	price: integer('price', { mode: 'number' }).default(0),
	buyer: text('buyer'),
	memo: text('memo'),
});

export const users = sqliteTable('users', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	passwordHash: text('passwordHash').notNull(),
});
