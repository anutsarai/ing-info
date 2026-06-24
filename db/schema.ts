import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["ADMIN", "USER"]);

export const guestbookUsers = pgTable("guestbook_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  role: userRole("role").notNull().default("USER"),
});

export const guestbook = pgTable("guestbook", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull(),
  message: text("message").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});