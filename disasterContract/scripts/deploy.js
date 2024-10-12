async function main() {
  console.log("Getting contract factory...");
  const disasterManagement = await ethers.getContractFactory(
    "DisasterManagement"
  );

  console.log("Deploying contract...");
  const disasterContract = await disasterManagement.deploy();

  console.log("Waiting for contract to be deployed...");
  await disasterContract.waitForDeployment();

  console.log("Contract deployed at:", disasterContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
