"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
    const [submitData, setSubmitData] = useState(0);
    const [formData, setFormData] = useState({ link: "" });
    const [scores, setScores] = useState({
        goodPts: 0,
        badPts: 0,
        altAttributeCounter: 0,
        placeholderCounter: 0,
        ariaCounter: 0,
        iFrameCounter: 0,
        accessibilityScore: 0,
    });

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
                accessibilityScore,
            } = await res.json();

            setScores({
                goodPts: goodPts ? goodPts : 0,
                badPts: badPts ? badPts : 0,
                altAttributeCounter: altAttributeCounter
                    ? altAttributeCounter
                    : 0,
                placeholderCounter: placeholderCounter ? placeholderCounter : 0,
                ariaCounter: ariaCounter ? ariaCounter : 0,
                iFrameCounter: iFrameCounter ? iFrameCounter : 0,
                accessibilityScore: accessibilityScore ? accessibilityScore : 0,
            });

            console.log(
                goodPts,
                badPts,
                altAttributeCounter,
                placeholderCounter,
                ariaCounter,
                iFrameCounter,
                accessibilityScore
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
                        key={2001}
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
            <div className="divider"></div>
            <h2>Here is your Accessibility Score!</h2>
            <div
                className="radial-progress bg-primary text-primary-content border-4 border-primary mt-4"
                style={{ "--value": scores.accessibilityScore }}
                role="progressbar"
            >
                {scores.accessibilityScore.toFixed(0)}%
            </div>

            <div className="join join-vertical gap-3 justify-around">
                <div className="join items-center justify-between mt-4">
                    <p>Good Semantics</p>
                    <progress
                        className="progress w-56 ml-7"
                        value={scores.goodPts}
                        max="100"
                    ></progress>
                </div>
                <div className="join items-center justify-between mt-4">
                    <p>Bad Semantics</p>
                    <progress
                        className="progress w-56 ml-7"
                        value={scores.badPts}
                        max="100"
                    ></progress>
                </div>
                <div className="join items-center justify-between mt-4">
                    <p>Alt Attributes</p>
                    <progress
                        className="progress w-56 ml-7"
                        value={scores.altAttributeCounter}
                        max="100"
                    ></progress>
                </div>
                <div className="join items-center justify-between mt-4">
                    <p>Placeholder Attributes</p>
                    <progress
                        className="progress w-56 ml-7"
                        value={scores.placeholderCounter}
                        max="100"
                    ></progress>
                </div>
                <div className="join items-center justify-between mt-4">
                    <p>Aria Elements</p>
                    <progress
                        className="progress w-56 ml-7"
                        value={scores.ariaCounter}
                        max="100"
                    ></progress>
                </div>
                <div className="join items-center justify-between mt-4">
                    <p>iFrame Elements</p>
                    <progress
                        className="progress w-56 ml-7"
                        value={scores.iFrameCounter}
                        max="100"
                    ></progress>
                </div>
            </div>
        </main>
    );
}
