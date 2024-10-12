import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import MapComponent from "./MapComponent";
import { useParams } from "react-router-dom";
import contractABI from "../contract/abi.json";
import DisasterImageModal from "./DisasterImageModal";

const DisasterReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [disasterReportImages, setDisasterReportImages] = useState(null);

  // useCallback to memoize fetchDisasterReport
  const fetchDisasterReport = useCallback(async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum); // ethers v6+
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        "0xa0525F3DEb64384FD3d07bbb7377191a0C3ddcD0", // Contract address
        contractABI.abi,
        signer
      );

      // Fetch the disaster report by the id
      const disasterReport = await contract.getDisasterReport(id);
      setReport(disasterReport);

      // Fetch disaster images by the id
      const disasterImages = await contract.getDisasterImages(id);
      console.log(disasterImages);

      // Assuming disasterImages is an array of image URLs or IPFS hashes
      const imageUrls = disasterImages.map((image) => image[2]); // Adjust based on structure
      setDisasterReportImages(imageUrls);
    } catch (error) {
      console.error("Error fetching disaster report:", error);
    }
  }, [id]); 


  useEffect(() => {
    fetchDisasterReport();
  }, [fetchDisasterReport]);

  if (!report) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DisasterImageModal id={id} fetchDisasterReport={fetchDisasterReport} />
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-4 mb-4 bg-white shadow-lg rounded-lg">
        {/* Left Side: Report Details */}
        <div className="w-full md:w-2/3 p-3">
          <h5>Disaster Report Details</h5>
          <img
            src={report[4]}
            alt="Disaster"
            className="w-full h-60 object-cover rounded-lg mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800">
            {report.reporterName}
          </h2>

          {/* ReporterName, Email */}
          <div className="mt-4 flex flex-wrap">
            <div className="w-full md:w-1/2">
              <div className="mb-2">
                <span className="font-semibold">Reporter Name:</span>{" "}
                {report[1]}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Reporter Email:</span>{" "}
                {report[2]}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Disaster Type:</span>{" "}
                {report[3]}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Severity:</span> {report[10]}
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="mb-2">
                <span className="font-semibold">Latitude:</span> {report[5]} N
              </div>
              <div className="mb-2">
                <span className="font-semibold">Longitude:</span> {report[6]} W
              </div>
              <div className="mb-2">
                <span className="font-semibold">City, State:</span> {report[7]},{" "}
                {report[8]}
              </div>
              <div className="mb-4">
                <span className="font-semibold">Impact:</span> {report[11]}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-4">Additional Images</h3>
          {disasterReportImages && disasterReportImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {" "}
              {/* Adjust grid layout as needed */}
              {disasterReportImages.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Disaster  ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              ))}
            </div>
          ) : (
            <p>No images available for this disaster report.</p>
          )}
        </div>

        {/* Right Side: Map */}
        <div className="w-full md:w-1/3 p-6">
          <MapComponent latitude={report[5]} longitude={report[6]} />
        </div>
      </div>
    </>
  );
};

export default DisasterReportDetails;
