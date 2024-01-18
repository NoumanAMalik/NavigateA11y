"use client";

import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center">
            <h1 className="text-xl font-bold mt-8 underline">
                Welcome to ParkHub!
            </h1>
            <h1 className="text-xl font-bold mt-8">
                Please Select an Option to Continue
            </h1>

            <div className="my-auto flex flex-row gap-8">
                <Link href="/authenticate/user">
                    <button className="btn btn-wide btn-outline btn-primary">
                        Find Parking
                    </button>
                </Link>

                <Link href="/authenticate/owner">
                    <button className="btn btn-wide btn-outline btn-primary">
                        List Parking Lot
                    </button>
                </Link>
            </div>
        </main>
    );
}
