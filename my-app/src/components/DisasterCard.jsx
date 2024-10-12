import React, { useState, useEffect, useCallback } from "react";
import contractABI from "../contract/abi.json";
import { ethers } from "ethers";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";
import { identiconTemplate } from "../helpers/index.tsx";

export default function DisasterCard() {
  const contractAddress = "0xa0525F3DEb64384FD3d07bbb7377191a0C3ddcD0";
  const [disasterReports, setDisasterReports] = useState([]);
  const [, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const loadContract = useCallback(async () => {
    try {
      if (!contractAddress || !ethers.isAddress(contractAddress)) {
        throw new Error("Invalid contract address");
      }

      const provider = new ethers.BrowserProvider(window.ethereum); // Ensure ethers v6+
      await provider.send("eth_requestAccounts", []); // Request user to connect account
      const signer = await provider.getSigner(); // Get the signer from the provider
      const loadedContract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        signer
      );

      // Get the connected account
      const account = await signer.getAddress();
      setAccount(account);
      setContract(loadedContract);

      // Fetch total number of disaster reports
      const reportLength = await loadedContract.getDisasterReportLength();
      console.log("Total Disaster Reports:", reportLength);

      // Fetch all disaster reports
      const allReports = [];
      for (let i = 0; i < reportLength; i++) {
        const report = await loadedContract.getDisasterReport(i);
        console.log(`Disaster Report ${i}:`, report);
        allReports.push(report);
      }

      setDisasterReports(allReports);
    } catch (error) {
      console.error("Error loading provider or contract:", error);
    }
  }, [contractAddress]);

  // Trigger loadContract when contractAddress changes
  useEffect(() => {
    if (contractAddress) {
      loadContract();
    }
  }, [contractAddress, loadContract]);

  const deleteReport = async (index) => {
    try {
      if (!contract) {
        throw new Error("Contract not loaded");
      }

      // Call the contract method to add a person
      const tx = await contract.deleteDisasterReport(index);
      await tx.wait(); // Wait for the transaction to be mined
      console.log("Person added successfully:", tx);
      loadContract();
    } catch (error) {
      console.error("Error adding person:", error);
    }
  };

  return (
    <Container>
      {disasterReports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-5 mb-5">
          {disasterReports.map((report, index) => (
            <div
              key={index}
              className="max-w-sm rounded overflow-hidden shadow-lg border border-gray-200 bg-white"
            >
              {/* Disaster Image */}
              <div className="relative">
                <img
                  className="w-full h-48 object-cover"
                  src={report[4]} // Image URL (imgUrl)
                  alt="Disaster"
                />

                <img
                  src="/delete.png"
                  alt="Delete"
                  className="absolute top-2 right-2 w-8 h-8 cursor-pointer "
                  onClick={(e) => deleteReport(index)}
                />
              </div>

              <div className="px-6 py-4">
                <div className="flex items-center text-sm mb-2 ">
                  {identiconTemplate(report.reporterId)}

                  <p className="font-bold text-gray-900 leading-none ml-1">
                    Reporter: {report[1]}
                  </p>
                </div>
                <p className="text-gray-600 text-sm mb-1 p-0">
                  Disaster Type: {report[3]}
                </p>{" "}
                {/* Disaster Type */}
                <p className="text-gray-600 text-sm m-0 p-0">
                  Date: {report[9]}
                </p>{" "}
                {/* Date */}
                {/* View Button */}
                <div className="text-center mt-4">
                  <Link to={`/disaster-report/${index}`}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading disaster reports...</p>
      )}
    </Container>
  );
}
