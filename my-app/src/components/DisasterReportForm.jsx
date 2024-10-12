import React, { useState, useEffect } from "react";
import contractABI from "../contract/abi.json";
import { ethers } from "ethers";

export default function DisasterReportForm({ addReport, loading }) {
  // New State Fields
  const [disasterType, setDisasterType] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting] = useState(false);

  // Original State Fields
  const [reporterName, setReporterName] = useState("");
  const [email, setEmail] = useState("");
  //   const [imgUrl, setImgUrl] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [date, setDate] = useState("");
  const [severity, setSeverity] = useState("");
  const [impact, setImpact] = useState("");
  const [, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const contractAddress = "0xa0525F3DEb64384FD3d07bbb7377191a0C3ddcD0";

  useEffect(() => {
    const loadContract = async () => {
      try {
        if (!contractAddress || !ethers.isAddress(contractAddress)) {
          throw new Error("Invalid contract address");
        }

        const provider = new ethers.BrowserProvider(window.ethereum); // Ensure you're using v6+
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner(); // Use await here
        const loadedContract = new ethers.Contract(
          contractAddress,
          contractABI.abi,
          signer
        );

        // Get the connected account
        const account = await signer.getAddress();
        setAccount(account);

        setContract(loadedContract);
      } catch (error) {
        console.error("Error loading provider or contract:", error);
      }
    };

    loadContract();
  }, [contractAddress]);

  const submitReport = async () => {
    try {
      if (!contract) {
        throw new Error("Contract not loaded");
      }

      // Call the contract method to add a person
      const tx = await contract.createDisasterReport(
        reporterName,
        email,
        disasterType,
        imageUrl,
        latitude,
        longitude,
        city,
        state,
        date,
        severity,
        impact
      );
      await tx.wait(); // Wait for the transaction to be mined
      console.log("Person added successfully:", tx);
    } catch (error) {
      console.error("Error adding person:", error);
    }
  };

  const getCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
          console.log("Coordinates set:", position.coords.latitude);
        },
        (error) => {
          console.error("Error fetching coordinates: ", error);
          alert("Unable to fetch location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 mt-5">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Submit Disaster Report
        </h2>

        {/* Reporter Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Reporter Name
          </label>
          <input
            onChange={(e) => setReporterName(e.target.value)}
            required
            type="text"
            className="w-full bg-gray-100 p-3 border border-gray-300 rounded-lg"
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            placeholder="Enter you email address"
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            className="w-full bg-gray-100 p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Disaster Type */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Disaster Type
          </label>
          <select
            value={disasterType}
            onChange={(e) => setDisasterType(e.target.value)}
            required
            className="w-full bg-gray-100 p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Select Disaster Type</option>
            <option value="Flood">Flood</option>
            <option value="Earthquake">Earthquake</option>
            <option value="Fire">Fire</option>
            <option value="Hurricane">Hurricane</option>
            <option value="Tornado">Tornado</option>
          </select>
        </div>

        {/* imageUrl */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Image Url
          </label>
          <input
            placeholder="Enter disaster image url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full bg-gray-100 p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Latitude and Longitude */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Latitude
            </label>
            <input
              placeholder="Latitude"
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full bg-gray-100 p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Longitude
            </label>
            <input
              placeholder="Longitude"
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full bg-gray-100 p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Get Location Button */}
        <button
          type="button"
          className="mb-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={getCoordinates}
        >
          Get Location
        </button>

        {/* City */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">City</label>
          <input
            placeholder="City"
            type="text"
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full bg-gray-100 p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* State */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            State
          </label>
          <input
            placeholder="State"
            type="text"
            onChange={(e) => setState(e.target.value)}
            required
            className="w-full bg-gray-100 p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Date</label>
          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full bg-gray-100 p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Severity */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Severity
          </label>
          <select
            onChange={(e) => setSeverity(e.target.value)}
            required
            className="w-full bg-gray-100 p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Select Severity</option>
            <option value="Minor">Minor</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>
        </div>

        {/* Impact */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Impact
          </label>
          <textarea
            placeholder="Describe the situation"
            onChange={(e) => setImpact(e.target.value)}
            required
            className="w-full bg-gray-100 p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full p-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition ${
            isSubmitting ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isSubmitting}
          onClick={submitReport}
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </div>
  );
}
