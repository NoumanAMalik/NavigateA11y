import "dotenv/config";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { ParkingLot, Transcations, schema, Parked } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

const connection = connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
});

const db = drizzle(connection, { schema });

export async function POST(request) {
    let { userId, duration, lotId } = await request.json();

    [userId, duration, lotId] = [
        parseInt(userId),
        parseInt(duration),
        parseInt(lotId),
    ];

    console.log(userId, duration, lotId);

    //* Get Price
    let result = await db
        .select({ price: ParkingLot.price })
        .from(ParkingLot)
        .where(eq(ParkingLot.id, lotId));

    let { price } = result[0];

    //* Calculate Price of Purchase
    let purchaseAmount = price * duration;

    //* Add Parking
    await db.insert(Parked).values({
        userId: userId,
        lotId: lotId,
        duration: duration,
    });

    //* Get Parking Id
    result = await db
        .select({ id: Parked.id })
        .from(Parked)
        .where(
            and(
                eq(Parked.userId, userId),
                eq(Parked.lotId, lotId),
                eq(Parked.duration, duration)
            )
        );

    let { id } = result[0];

    //* Add Transaction
    await db.insert(Transcations).values({
        paymentTo: lotId,
        paymentFrom: userId,
        paymentAmount: purchaseAmount,
        parkingId: id,
    });

    //* Get Transaction Info To Return to User
    result = await db
        .select()
        .from(Transcations)
        .where(
            and(
                eq(Transcations.paymentTo, lotId),
                eq(Transcations.paymentFrom, userId),
                eq(Transcations.paymentAmount, purchaseAmount),
                eq(Transcations.parkingId, id)
            )
        );

    let transaction = result[0];

    return NextResponse.json({ result: transaction });
}
