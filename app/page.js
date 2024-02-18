"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
    const [submitData, setSubmitData] = useState(0);
    const [formData, setFormData] = useState({ link: "" });

    const handleSubmit = (event) => {
        event.preventDefault();

        setSubmitData((prev) => (prev += 1));

        console.log(submitData);
    };

    const formUpdate = (event) => {
        setFormData({
            link: event.target.value,
        });
    };

    useEffect(() => {
        const callAPI = async () => {
            const body = {
                link: formData.link,
            };

            const res = await fetch(`/api/scan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const {
                goodPts,
                badPts,
                altAttributeCounter,
                placeholderCounter,
                ariaCounter,
                iFrameCounter,
            } = await res.json();

            console.log(
                goodPts,
                badPts,
                altAttributeCounter,
                placeholderCounter,
                ariaCounter,
                iFrameCounter,
            );
        };

        callAPI();
    }, [submitData]);

    return (
        <main className="flex min-h-screen flex-col items-center">
            <h1 className="mt-8 text-xl font-bold underline">
                Welcome to NavigateA11y!
            </h1>
            <div className="mt-12 flex flex-col items-center">
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Enter your link</span>
                    </label>
                    <input
                        key={1}
                        id="link"
                        type="text"
                        placeholder="abc.com"
                        className="input input-bordered w-full max-w-xs"
                        onChange={formUpdate}
                    />

                    <button
                        className="btn btn-wide btn-outline btn-secondary mt-6"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </main>
    );
}
