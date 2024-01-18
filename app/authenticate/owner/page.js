"use client";
import Input from "@/components/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Owner = () => {
    const [modeToggle, setModeToggle] = useState("");
    const [formData, setFormData] = useState({
        email: "",
    });
    const [submitData, setSubmitData] = useState(false);
    const router = useRouter();

    const formUpdate = (event) => {
        setFormData((prevState) => ({
            ...prevState,
            [event.target.id]: event.target.value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setSubmitData(true);
    };

    useEffect(() => {
        const callAPI = async () => {
            const { email } = formData;

            let body = {
                email: email,
            };

            let res = undefined;

            if (modeToggle == "Create") {
                res = await fetch(`/api/owner`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });
            }

            if (res == undefined && modeToggle == "Create") return;

            res = await fetch(`/api/owner?` + new URLSearchParams(body), {
                method: "GET",
            });

            if (res == undefined) return;

            let response = await res.json();

            if (response.result == "not found") return; //! DO SOMETHING HERE WHEN INPUT IS WRONG

            console.log(response.result);

            router.push(
                `/dashboard?` + new URLSearchParams(response.result[0])
            );
        };

        callAPI();
    }, [submitData]);

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-row gap-8 my-8">
                <button
                    className={`btn btn-wide btn-outline btn-primary ${
                        modeToggle == "Create" ? "btn-active" : ""
                    }`}
                    onClick={() => setModeToggle("Create")}
                >
                    First Time Owner
                </button>

                <button
                    className={`btn btn-wide btn-outline btn-primary ${
                        modeToggle == "Login" ? "btn-active" : ""
                    }`}
                    onClick={() => setModeToggle("Login")}
                >
                    Find Account
                </button>
            </div>

            {modeToggle == "Create" && (
                <div className="flex flex-col items-center">
                    <Input
                        uniqueId={1}
                        id="email"
                        label="Enter your Email to Create Account"
                        placeholder="Type here"
                        changeHandler={formUpdate}
                    />

                    <button
                        className="btn btn-wide btn-outline btn-secondary mt-6"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            )}

            {modeToggle == "Login" && (
                <div className="flex flex-col items-center">
                    <Input
                        uniqueId={1}
                        id="email"
                        label="Enter your Email to Find Account"
                        placeholder="Type here"
                        changeHandler={formUpdate}
                    />

                    <button
                        className="btn btn-wide btn-outline btn-secondary mt-6"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
};

export default Owner;
