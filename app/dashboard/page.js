"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Input from "@/components/input";

const Dashboard = () => {
    const searchParams = useSearchParams();
    const [modeToggle, setModeToggle] = useState("View");
    const [submitData, setSubmitData] = useState(0);
    const [parkingData, setParkingData] = useState([]);
    const [fetchData, setFetchData] = useState(0);
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        spacesAvailable: "",
        price: "",
    });

    const formUpdate = (event) => {
        setFormData((prevState) => ({
            ...prevState,
            [event.target.id]: event.target.value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setSubmitData((prev) => prev + 1);
    };

    const randNum = () => {
        return Math.floor(Math.random() * 10000 + 1);
    };

    useEffect(() => {
        const getParkingLotData = async () => {
            const email = searchParams.get("email");

            const body = {
                email: email,
            };

            const res = await fetch(
                `/api/dashboard?` + new URLSearchParams(body),
                {
                    method: "GET",
                },
            );

            const response = await res.json();

            setParkingData(response.result);
        };

        getParkingLotData();
    }, [fetchData]);

    useEffect(() => {
        if (submitData == 0) return;
        const callAPI = async () => {
            const email = searchParams.get("email");
            const { name, location, spacesAvailable, price } = formData;

            if (name == "") return;

            const body = {
                name: name,
                location: location,
                spacesAvailable: spacesAvailable,
                price: price,
                email: email,
            };

            const res = await fetch(`/api/dashboard`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const response = await res.json();

            setModeToggle("View");
            setFetchData((prev) => prev + 1);
            router.refresh();
        };

        callAPI();
    }, [submitData]);

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-xl font-bold underline">
                Owner Dashboard Page
            </h1>
            <p>Welcome {searchParams.get("email")}</p>

            <div className="my-8 flex flex-row gap-8">
                <button
                    className={`btn btn-wide btn-outline btn-primary ${
                        modeToggle == "View" ? "btn-active" : ""
                    }`}
                    onClick={() => setModeToggle("View")}
                >
                    View Dashboard
                </button>

                <button
                    className={`btn btn-wide btn-outline btn-primary ${
                        modeToggle == "Add" ? "btn-active" : ""
                    }`}
                    onClick={() => setModeToggle("Add")}
                >
                    Add Parking Lot
                </button>
            </div>

            {modeToggle == "View" && (
                <div className="flex flex-col items-center">
                    <h1 className="text-lg">Your Parking Lots:</h1>
                    <div className="overflow-x-auto">
                        <table className="table-zebra table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Location</th>
                                    <th>Spaces Available</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parkingData.map((data) => {
                                    return (
                                        <tr key={randNum()}>
                                            <th key={randNum()}>{data.id}</th>
                                            <td key={randNum()}>{data.name}</td>
                                            <td key={randNum()}>
                                                {data.location}
                                            </td>
                                            <td key={randNum()}>
                                                {data.spacesAvailable}
                                            </td>
                                            <td key={randNum()}>
                                                {data.price}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {modeToggle == "Add" && (
                <div className="flex flex-col items-center">
                    <h1 className="text-lg">Create a new Parking Lot:</h1>
                    <Input
                        uniqueId={1}
                        id="name"
                        label="Enter the name of the Parking Lot"
                        placeholder="Type here"
                        changeHandler={formUpdate}
                    />
                    <Input
                        uniqueId={2}
                        id="location"
                        label="Enter the Address"
                        placeholder="Type here"
                        changeHandler={formUpdate}
                    />
                    <Input
                        uniqueId={3}
                        id="spacesAvailable"
                        label="Enter the number of spaces"
                        placeholder="Type here"
                        changeHandler={formUpdate}
                    />
                    <Input
                        uniqueId={4}
                        id="price"
                        label="Enter the Price per Hour"
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

export default Dashboard;
