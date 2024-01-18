import { mysqlTable, bigint, varchar, timestamp } from "drizzle-orm/mysql-core";

// Parking System
// Parking Lot:
//      id, name, location, spaces available, price per space
// User:
//      id, name, license plate
// Parked:
//      id, license plate, location id, duration
// Transcations:
//      id, payment to, payment from, payment amount, date, payment method, parking id,
//

export const ParkingLot = mysqlTable("ParkingLot", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    ownerId: varchar("ownerId", { length: 256 }),
    name: varchar("name", { length: 256 }).unique(),
    location: varchar("location", { length: 256 }),
    spacesAvailable: bigint("spacesAvailable", { mode: "number" }),
    price: bigint("price", { mode: "number" }),
});

export const User = mysqlTable("User", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    firstName: varchar("firstName", { length: 256 }),
    lastName: varchar("lastName", { length: 256 }),
    licensePlate: varchar("licensePlate", { length: 256 }).unique(),
});

export const Owner = mysqlTable("Owner", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    email: varchar("email", { length: 256 }).unique(),
});

export const Parked = mysqlTable("Parked", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    userId: varchar("userId", { length: 256 }),
    lotId: bigint("lotId", { mode: "number" }),
    duration: bigint("duration", { mode: "number" }),
});

export const Transcations = mysqlTable("Transactions", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    paymentTo: bigint("paymentTo", { mode: "number" }),
    paymentFrom: bigint("paymentFrom", { mode: "number" }),
    paymentAmount: bigint("paymentAmount", { mode: "number" }),
    timestamp: timestamp("timestamp").defaultNow(),
    parkingId: bigint("parkingId", { mode: "number" }),
});
