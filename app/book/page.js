"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Input from "@/components/input";

const Book = () => {
    const searchParams = useSearchParams();
    const [parkingData, setParkingData] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [submitData, setSubmitData] = useState(0);
    const [transactionData, setTransactionData] = useState(null);
    const [formData, setFormData] = useState({
        hours: "",
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

    const handleRowClick = (data) => {
        setSelectedData(data);
        const modal = document.querySelector("#bookingModal");
        modal.classList.add("modal-open");
    };

    const closeModal = () => {
        const modal = document.querySelector("#bookingModal");
        modal.classList.remove("modal-open");
    };

    useEffect(() => {
        const getParkingLotData = async () => {
            const res = await fetch(`/api/parkinglot`, {
                method: "GET",
            });

            const response = await res.json();

            setParkingData(response.result);
        };

        getParkingLotData();
    }, []);

    useEffect(() => {
        if (submitData == 0) return;

        const callAPI = async () => {
            const userId = searchParams.get("id");

            const body = {
                userId: userId,
                duration: formData.hours,
                lotId: selectedData.id,
            };

            const res = await fetch(`/api/book`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const response = await res.json();

            console.log(response.result);

            setTransactionData(response.result);
        };

        callAPI();
        // console.log(formData.hours);
    }, [submitData]);

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-xl font-bold underline">Book a Parking Lot</h1>
            <p className="mt-4 text-lg">
                Hello {searchParams.get("firstName")}{" "}
                {searchParams.get("lastName")}
            </p>
            <p className="text-lg">
                Your License Plate is: {searchParams.get("licensePlate")}
            </p>
            <h1 className="mt-6 text-xl font-semibold">
                Available Parking Lots:
            </h1>

            <div className="mt-8 flex flex-col items-center">
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
                                    <tr
                                        key={randNum()}
                                        onClick={() => handleRowClick(data)}
                                        className="hover cursor-pointer"
                                    >
                                        <th key={randNum()}>{data.id}</th>
                                        <td key={randNum()}>{data.name}</td>
                                        <td key={randNum()}>{data.location}</td>
                                        <td key={randNum()}>
                                            {data.spacesAvailable}
                                        </td>
                                        <td key={randNum()}>{data.price}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="modal" id="bookingModal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold underline">
                        Confirm Booking
                    </h3>
                    <p>Name: {selectedData?.name || "No Data"}</p>
                    <p>Location: {selectedData?.location || "No Data"}</p>
                    <p>
                        Spaces Available:{" "}
                        {selectedData?.spacesAvailable || "No Data"}
                    </p>
                    <p>Price: {selectedData?.price || "No Data"}</p>
                    <Input
                        uniqueId={1}
                        id="hours"
                        label="Enter the number of hours you would like to book for?"
                        placeholder="Type here"
                        changeHandler={formUpdate}
                    />
                    <button
                        className="btn btn-wide btn-outline btn-secondary mt-6"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                    {transactionData != null && (
                        <div className="mt-4 rounded-xl p-4 outline">
                            <p className="text-lg underline">Booking Receipt</p>
                            <p>Transaction Id: {transactionData.id}</p>
                            <p>
                                Transaction Amount:{" "}
                                {transactionData.paymentAmount}
                            </p>
                            <p>
                                Transaction Timestamp:{" "}
                                {transactionData.timestamp}
                            </p>
                        </div>
                    )}
                    <div className="modal-action">
                        <a
                            href="#"
                            className="btn"
                            onClick={() => closeModal()}
                        >
                            Close
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Book;
