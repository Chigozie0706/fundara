import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assests/images/logo.svg";
import { ethers } from "ethers";

export default function NavigationBar() {
  const [isConnected, setIsConnected] = useState(false);
  const [, setAccount] = useState(null);
  const [, setProvider] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("please install metamask");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const accounts = (await signer).address;
      console.log(signer);
      setAccount(accounts);
      setProvider(provider);
      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setIsConnected(false);
  };

  useEffect(() => {
    // Check if already connected on component mount
    const checkConnection = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await web3Provider.getSigner();
        if (accounts.length > 0) {
          setAccount(accounts);
          setProvider(web3Provider);
          setIsConnected(true);
        }
      }
    };

    checkConnection();
  }, []);

  return (
    <nav className="bg-white shadow-lg w-full">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Centered Logo */}
        <div className="flex justify-center mx-auto">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-10 w-10" />
          </Link>
        </div>

        {/* Centered Navigation Links */}
        <div className="hidden md:flex space-x-8 mx-auto text-gray-700 font-semibold">
          <Link to="/" className="hover:text-gray-900  no-underline">
            Home
          </Link>

          <Link
            to="/disaster-report"
            className="hover:text-gray-900  no-underline"
          >
            Disaster Reports
          </Link>

          <Link
            to="/submit-report"
            className="hover:text-gray-900  no-underline"
          >
            Submit Report
          </Link>
        </div>

        {/* Centered Connect Wallet Button */}
        <div className="hidden md:flex justify-center mx-auto">
          {isConnected ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {/* {`${account.slice(0, 6)}...${account.slice(-4)}`}{" "} */}
                {/* Shortened Address */}
              </span>
              <button
                className="bg-red-600 text-white py-2 px-6 rounded-full hover:bg-red-700 transition-all"
                onClick={disconnectWallet}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              className="bg-blue-700 text-white py-2 px-6 rounded-full hover:bg-blue-800 transition-all"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
