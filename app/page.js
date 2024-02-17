"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
    useEffect(() => {
        const callAPI = async () => {
            const res = await fetch(`/api/test`, {
                method: "GET",
            });

            console.log(await res.json());
        };

        callAPI();
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center">
            <h1 className="mt-8 text-xl font-bold underline">Hello!</h1>
        </main>
    );
}
