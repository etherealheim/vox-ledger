import { integer, pgTable, serial, text, varchar, date, time } from 'drizzle-orm/pg-core';

export const politicians = pgTable('politicians', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    twitter: varchar('twitter', { length: 255 }),
    wikipedia: varchar('wikipedia', { length: 255 }),
    party: varchar('party', { length: 255 }).notNull(),
});

export const votingSessions = pgTable('voting_sessions', {
    id: serial('id').primaryKey(),
    date: date('date').notNull(),
    time: time('time').notNull(),
    title: text('title').notNull(),
    meetingDetails: text('meeting_details').notNull(),
});

export const votes = pgTable('votes', {
    id: serial('id').primaryKey(),
    politicianId: integer('politician_id')
        .notNull()
        .references(() => politicians.id),
    votingSessionId: integer('voting_session_id')
        .notNull()
        .references(() => votingSessions.id),
    vote: varchar('vote', { length: 50 }).notNull(),
});