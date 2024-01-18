"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/input";

const User = () => {
    const [modeToggle, setModeToggle] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        licensePlate: "",
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
            const { firstName, lastName, licensePlate } = formData;

            let body = {};

            if (modeToggle == "Create") {
                body = {
                    firstName: firstName,
                    lastName: lastName,
                    licensePlate: licensePlate,
                };

                let res = await fetch(`/api/user`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });

                let response = await res.json();

                console.log(response.result);

                body = {
                    licensePlate: licensePlate,
                };

                res = await fetch(`/api/user?` + new URLSearchParams(body), {
                    method: "GET",
                });

                response = await res.json();

                if (response.result[0] == "empty") return;

                if (response.result.length == 0) {
                    console.log("DIDN'T FIND");
                } else {
                    // USER EXISTS
                    console.log(response.result[0]);

                    router.push(
                        `/book?` + new URLSearchParams(response.result[0])
                    );
                }
            } else {
                body = {
                    licensePlate: licensePlate,
                };

                const res = await fetch(
                    `/api/user?` + new URLSearchParams(body),
                    {
                        method: "GET",
                    }
                );

                const response = await res.json();

                if (response.result[0] == "empty") return;

                if (response.result.length == 0) {
                    console.log("DIDN'T FIND");
                } else {
                    // USER EXISTS
                    console.log(response.result[0]);

                    router.push(
                        `/book?` + new URLSearchParams(response.result[0])
                    );
                }
            }
        };

        callAPI();
    }, [submitData]);

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="my-8 flex flex-row gap-8">
                <button
                    className={`btn btn-wide btn-outline btn-primary ${
                        modeToggle == "Create" ? "btn-active" : ""
                    }`}
                    onClick={() => setModeToggle("Create")}
                >
                    First Time User
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
                        id="firstName"
                        label="Enter your First Name"
                        placeholder="Type here"
                        changeHandler={formUpdate}
                    />

                    <Input
                        uniqueId={2}
                        id="lastName"
                        label="Enter is your Last Name"
                        placeholder="Type Here"
                        changeHandler={formUpdate}
                    />

                    <Input
                        uniqueId={3}
                        id="licensePlate"
                        label="Enter is your License Plate Number"
                        placeholder="Type Here"
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
                        id="licensePlate"
                        label="Enter is your License Plate Number"
                        placeholder="Type Here"
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

export default User;
