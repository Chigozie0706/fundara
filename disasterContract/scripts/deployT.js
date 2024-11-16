async function main() {
  console.log("Getting contract factory...");
  const disasterSystem = await ethers.getContractFactory("DisasterSystem");

  console.log("Deploying contract...");
  const disasterContractt = await disasterSystem.deploy();

  console.log("Waiting for contract to be deployed...");
  await disasterContractt.waitForDeployment();

  console.log("Contract deployed at:", disasterContractt.target);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
