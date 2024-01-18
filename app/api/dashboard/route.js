import "dotenv/config";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { Owner, ParkingLot, schema } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

const connection = connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
});

const db = drizzle(connection, { schema });

export async function GET(request) {
    const email = request.nextUrl.searchParams.get("email");

    //* Get Owner ID
    let result = await db
        .select({ id: Owner.id })
        .from(Owner)
        .where(eq(Owner.email, email));

    let { id } = result[0];

    // console.log(id);
    //* Select Owners Parking Lots
    result = await db
        .select()
        .from(ParkingLot)
        .where(eq(ParkingLot.ownerId, id));

    console.log(result);

    return NextResponse.json({ result: result });
}

export async function POST(request) {
    const { name, location, spacesAvailable, price, email } =
        await request.json();

    let result = await db
        .select({ id: Owner.id })
        .from(Owner)
        .where(eq(Owner.email, email));

    let { id } = result[0];

    try {
        await db.insert(ParkingLot).values({
            name: name,
            location: location,
            spacesAvailable: parseInt(spacesAvailable),
            price: parseInt(price),
            ownerId: id,
        });
    } catch (e) {
        console.log(e);
    }

    return NextResponse.json({ result: "Created Parking Lot" });
}
