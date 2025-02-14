"use client";


import { useEffect, useState } from "react";
import { themeChange } from "theme-change";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import goodSemantics from "@/data/goodSemantics";
import badSemantics from "@/data/badSemantics";


export default function Home() {
    const [submitData, setSubmitData] = useState(0);
    const [formData, setFormData] = useState({ link: "" });
    const [aiFeedback, setAiFeedback] = useState({ text: "" });
    const [aiLoading, setAiLoading] = useState(false);
    const [scores, setScores] = useState({
        goodPts: 0,
        badPts: 0,
        altAttributeCounter: 0,
        placeholderCounter: 0,
        ariaCounter: 0,
        iFrameCounter: 0,
        accessibilityScore: 0,
        headingErrors: 0,
        unlabeledButtons: 0,
        accessibilityScore: 0,
    });

    const api_key = process.env.NEXT_PUBLIC_API_KEY;
    console.log(api_key)
    useEffect(() => {
        themeChange(false);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitData((prev) => prev + 1);
    };

    const formUpdate = (event) => {
        setFormData({
            link: event.target.value,
        });
    };

    const scanWebsite = async (html) => {
        let badPts = 0;
        let goodPts = 0;
        let Iflag = false;
        let iFrameCounter = 0;
        let altAttributeCounter = 0;
        let ariaCounter = 0;
        let placeholderCounter = 0;

        let elements = [];
        let htmlArr = html.split("<");

        for (const i of htmlArr) {
            if (i.includes(">")) {
                const arr = i.split(">");
                if (i[0] !== "/") {
                    elements.push(arr[0]);
                }
            }
        }

        for (const i of elements) {
            if (badSemantics[i] >= 0) {
                badSemantics[i] += 1;
                badPts += 1;
            }
            if (goodSemantics[i] >= 0) {
                goodSemantics[i] += 1;
                goodPts += 1;
            }
            if (Iflag == false) {
                Iflag = true;
            } else if (i.includes("iframe")) {
                iFrameCounter += 1;
                badPts += 1;
            }
            if (i.substring(0, 3) === "img") {
                if (i.includes("alt")) {
                    altAttributeCounter += 1;
                    goodPts += 1;
                } else {
                    badPts += 1;
                }
            }
            if (i.includes("aria")) {
                ariaCounter += 1;
                goodPts += 1;
            }
            if (i.includes("placeholder")) {
                placeholderCounter += 1;
                goodPts += 1;
            }
        }

        let lastHeadingLevel = 0;
        let headingErrors = 0;
        elements.forEach(el => {
            if (el.match(/^h[1-6]/)) {
                const level = parseInt(el[1]);
                if (lastHeadingLevel !== 0 && level - lastHeadingLevel > 1) {
                    headingErrors++;
                }
                lastHeadingLevel = level;
            }
        });

        // Button accessibility check
        let unlabeledButtons = 0;
        elements.forEach(el => {
            if (el.startsWith('button')) {
                if (!el.includes('aria-label') && !el.match(/>.*\S.*</)) {
                    unlabeledButtons++;
                }
            }
        });

        const accessibilityScore = (goodPts / (goodPts + badPts)) * 100;
        return {
            goodPts,
            badPts,
            altAttributeCounter,
            placeholderCounter,
            ariaCounter,
            iFrameCounter,
            accessibilityScore,
            headingErrors,
            unlabeledButtons,
            accessibilityScore,
        };
    };

    const generateAIFeedback = async (tagString) => {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${api_key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
                messages: [
                    {
                        role: 'user',
                        content: `This is the HTML of a wbsite (without the unnecessary content): \n ${tagString} \n\n From this code, give me a few short suggestions about how this site can be made more accessible. These suggestions  can be about about bad semantics like using too many much of a certain tag as well as other bad html structure practices. Your evaluation of the accecibilty of the HTML should be based on how easy it is to navigate the HTML. Vauge tags would make it less accesible. Give me ONLY 3 suggestions of how the structure of the HTML can be improved. Give me these three suggestions in markdown bullet point form using the - symbol for each point. Also put a newline character in between every point. Start each point with a title that is bolded, and then the information that is needed. This format is very strict please follow it exactly. Each point must only be 2-3 sentences NOT MORE NOT LESS. Keep the suggestions brief.`,
                    },
                ],
            }),
        });

        if (response.ok) {
            const data = await response.json();
            return data.choices[0].message.content;
        }
        return "Error generating feedback";
    };


    useEffect(() => {
        const fetchAndAnalyze = async () => {
            if (!formData.link) return;

            try {
                const response = await fetch(formData.link);
                const html = await response.text();
                const scanResults = await scanWebsite(html);
                setScores(scanResults);

                setAiLoading(true);
                const tagString = html.split("<").map(i => {
                    if (i.includes(">")) {
                        const arr = i.split(">");
                        return `<${arr[0]}>`;
                    }
                    return "";
                }).join("");

                const feedback = await generateAIFeedback(tagString); // Added await here
                setAiFeedback({ text: feedback });
                setAiLoading(false);
            } catch (error) {
                console.error("Error analyzing website:", error);
                setAiFeedback({ text: "Error analyzing website. Please try again." });
                setAiLoading(false);
            }
        };

        if (submitData > 0) {
            fetchAndAnalyze();
        }
    }, [submitData, formData.link]);

    return (
        <main className="flex min-h-screen flex-col items-center">
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
            <div className="navbar bg-base-100 flex items-center justify-center mt-4">
                <a className="btn btn-ghost text-xl">NavigateA11y</a>
            </div>
            <p className="mt-12 mb-4">
                Check website accessibility instantly and get insights and
                recommendations.
            </p>
            <div className="flex flex-col items-center">
                <div className="form-control w-full max-w-sm">
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
                                className="progress progress-success w-56 ml-7"
                                value={scores.goodPts}
                                max="100"
                            ></progress>
                        </div>
                        <div className="join items-center justify-between mt-4">
                            <p>Bad Semantics</p>
                            <progress
                                className="progress progress-warning w-56 ml-7"
                                value={scores.badPts}
                                max="100"
                            ></progress>
                        </div>
                        <div className="join items-center justify-between mt-4">
                            <p>Heading Hierarchy Errors</p>
                            <progress
                                className="progress progress-error w-56 ml-7"
                                value={scores.headingErrors}
                                max="10"
                            ></progress>
                        </div>
                        <div className="join items-center justify-between mt-4">
                            <p>Unlabeled Buttons</p>
                            <progress
                                className="progress progress-error w-56 ml-7"
                                value={scores.unlabeledButtons}
                                max="10"
                            ></progress>
                        </div>
                    </div>
                    <button
                        className="btn mt-8"
                        onClick={() =>
                            document.getElementById("my_modal_5").showModal()
                        }
                    >
                        {aiLoading ? (
                            <span className="loading loading-spinner text-secondary"></span>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                                />
                            </svg>
                        )}
                        View AI Suggested Feedback
                    </button>
                    <dialog
                        id="my_modal_5"
                        className="modal modal-bottom sm:modal-middle"
                    >
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">
                                {aiLoading ? (
                                    <>
                                        <p>Feedback Loading</p>{" "}
                                        {
                                            <span className="loading loading-dots loading-md"></span>
                                        }
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                                            />
                                        </svg>
                                        Here are some ideas to make your website
                                        more accessible :)
                                    </>
                                )}
                            </h3>
                            <p className="py-4">
                                {/* <>{aiFeedback.text}</> */}
                                <Markdown remarkPlugins={[remarkGfm]}>
                                    {aiLoading ? "   " : aiFeedback.text}
                                </Markdown>
                            </p>
                            <div className="modal-action">
                                <form method="dialog">
                                    {/* if there is a button in form, it will close the modal */}
                                    <button className="btn">Close</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </div>
            )}
        </main>
    );
}
