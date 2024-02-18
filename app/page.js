"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { themeChange } from "theme-change";

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

    useEffect(() => {
        themeChange(false);
    }, []);

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

            // const testing = await fetch(`/api/ai`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(body),
            // });

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
                <div className="form-control w-full max-w-sm">
                    <label className="label">
                        <span className="label-text">Enter your link</span>
                    </label>
                    <input
                        key={2001}
                        id="link"
                        type="text"
                        placeholder="https://www.abc.com"
                        className="input input-bordered w-full max-w-sm"
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
            {scores.accessibilityScore != 0 && (
                <div className="flex flex-col items-center">
                    <div className="divider"></div>
                    <h2>Here is your Accessibility Score!</h2>
                    <div
                        className={
                            "radial-progress border-4 mt-4" +
                            (scores.accessibilityScore > 0 &&
                            scores.accessibilityScore <= 50
                                ? " bg-error text-error-content border-error"
                                : scores.accessibilityScore > 50 &&
                                  scores.accessibilityScore <= 75
                                ? " bg-warning text-warning-content border-warning"
                                : " bg-success text-success-content border-success")
                        }
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
                    <div className="dropdown mb-72 absolute right-20 top-4">
                        <div tabIndex={0} role="button" className="btn m-1">
                            Theme
                            <svg
                                width="12px"
                                height="12px"
                                className="h-2 w-2 fill-current opacity-60 inline-block"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 2048 2048"
                            >
                                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-32"
                        >
                            <li>
                                <input
                                    type="radio"
                                    name="theme-dropdown"
                                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                    aria-label="Default"
                                    data-set-theme=""
                                    value="default"
                                />
                            </li>
                            <li>
                                <input
                                    type="radio"
                                    name="theme-dropdown"
                                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                    aria-label="Retro"
                                    data-set-theme="retro"
                                    value="retro"
                                />
                            </li>
                            <li>
                                <input
                                    type="radio"
                                    name="theme-dropdown"
                                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                    aria-label="Cyberpunk"
                                    data-set-theme="cyberpunk"
                                    value="cyberpunk"
                                />
                            </li>
                            <li>
                                <input
                                    type="radio"
                                    name="theme-dropdown"
                                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                    aria-label="Valentine"
                                    data-set-theme="valentine"
                                    value="valentine"
                                />
                            </li>
                            <li>
                                <input
                                    type="radio"
                                    name="theme-dropdown"
                                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                    aria-label="Aqua"
                                    data-set-theme="aqua"
                                    value="aqua"
                                />
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </main>
    );
}
