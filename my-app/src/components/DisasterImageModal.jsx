import React, { useState, useEffect } from "react";
import contractABI from "../contract/abi.json";
import { Container } from "reactstrap";
import { ethers } from "ethers";

const DisasterImageModal = ({ id, fetchDisasterReport }) => {
  const [visible, setVisible] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isComplete] = useState(true); // Add your own logic to check completeness
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

  const submitImage = async () => {
    try {
      if (!contract) {
        throw new Error("Contract not loaded");
      }

      // Call the contract method to add a person
      const tx = await contract.addDisasterImage(
        id,
        imgUrl,
        new Date().toISOString()
      );
      await tx.wait(); // Wait for the transaction to be mined
      console.log("Person added successfully:", tx);
      fetchDisasterReport();
    } catch (error) {
      console.error("Error adding person:", error);
    }
  };

  const addDisasterImages = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate image upload process or dispatch action here
    console.log("Image URL submitted:", imgUrl);
    // Reset loading and close modal after processing
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 1000);
  };

  return (
    <Container>
      <div className={"flex flex-row w-full justify-between "}>
        <div>
          {/* Add Disaster Image Button that opens the modal */}
          <button
            type="button"
            onClick={() => setVisible(true)}
            className="inline-block ml-5 px-6 my-5 py-2.5 bg-black text-white font-medium text-md leading-tight rounded-2xl shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Add Images
          </button>

          {/* Modal for adding a disaster image */}
          {visible && (
            <div
              className="fixed z-40 overflow-y-auto top-0 w-full left-0"
              id="modal"
            >
              <form onSubmit={addDisasterImages}>
                <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
                  </div>
                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                    &#8203;
                  </span>
                  <div
                    className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                  >
                    {/* Modal Header */}
                    <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">
                        Add Disaster Image
                      </h2>
                    </div>

                    {/* Modal Body */}
                    <div
                      className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto"
                      style={{ maxHeight: "400px" }}
                    >
                      <label>Image URL ... {id}</label>
                      <input
                        onChange={(e) => setImgUrl(e.target.value.trim())}
                        required
                        type="text"
                        className="w-full bg-gray-100 p-2 mt-2 mb-3"
                      />
                    </div>

                    {/* Modal Footer */}
                    <div className="bg-gray-200 px-4 py-3 text-right">
                      <button
                        type="button"
                        className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
                        onClick={() => setVisible(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !isComplete || !imgUrl}
                        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
                        onClick={submitImage}
                      >
                        {loading ? "Adding..." : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default DisasterImageModal;
