import "dotenv/config";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { ParkingLot, schema } from "@/db/schema";
import { NextResponse } from "next/server";

const connection = connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
});

const db = drizzle(connection, { schema });

export async function GET(request) {
    const result = await db.select().from(ParkingLot);

    console.log(result);

    if (result.length != 0) return NextResponse.json({ result: result });

    return NextResponse.json({ result: "not found" });
}
