// Import the required modules and configuration functions
// const {
//     getProviderRpcUrl,
//     getRouterConfig,
//     getMessageStatus,
//   } = require("./config");
  const { ethers, JsonRpcProvider } = require("ethers");
  // const routerAbi = require("../../abi/Router.json");
  import routerAbi from "@constants/router.json"
  // const offRampAbi = require("../../abi/OffRamp.json");
  import offRampAbi from "@constants/OffRamp.json"
  
  // Command: node src/get-status.js sourceChain destinationChain messageId
  // Examples(sepolia-->Fuji):
  // node src/get-status.js ethereumSepolia avalancheFuji 0xbd2f751ffab340b98575a8f46efc234e8d884db7b654c0144d7aabd72ff38595
  const messageExecutionState : { [key: string]: string } = {
    "0": "UNTOUCHED",
    "1": "IN_PROGRESS",
    "2": "SUCCESS",
    "3": "FAILURE"
  }

  const getMessageStatus = (status:string) => {
    if (status in messageExecutionState) {
      return messageExecutionState[status];
    }
    return "unknown";
  };

  const handleArguments = () => {
    // Check if the correct number of arguments are passed
    // if (process.argv.length !== 5) {
    //   throw new Error("Wrong number of arguments");
    // }
  
    // Extract the arguments from the command line
    const chain = "ethereumSepolia";
    const targetChain = "polygonMumbai";
    const messageId = "";
  
    // Return the arguments in an object
    return {
      chain,
      targetChain,
      messageId,
    };
  };
  
  // Main function to get the status of a message by its ID
  export const getStatus = async () => {
    // Parse command-line arguments
    const { chain, targetChain, messageId } = handleArguments();
  
    // Get the RPC URLs for both the source and destination chains
    const destinationRpcUrl = "getProviderRpcUrl(targetChain)";
    const sourceRpcUrl = "getProviderRpcUrl(chain)";
  
    // Initialize providers for interacting with the blockchains
    const destinationProvider = new JsonRpcProvider(destinationRpcUrl);
    const sourceProvider = new JsonRpcProvider(sourceRpcUrl);
  
    // Retrieve router configuration for the source and destination chains
    const sourceRouterAddress = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59";
    const sourceChainSelector = "16015286601757825753";
    const destinationRouterAddress = "0x1035CabC275068e0F4b745A29CEDf38E13aF41b1";
    const destinationChainSelector = "12532609583862916517";
  
    // Instantiate the router contract on the source chain
    const sourceRouterContract = new ethers.Contract(
      sourceRouterAddress,
      routerAbi,
      sourceProvider
    );
  
    const isChainSupported = await sourceRouterContract.isChainSupported(
      destinationChainSelector
    );
  
    if (!isChainSupported) {
      throw new Error(`Lane ${chain}->${targetChain} is not supported}`);
    }
  
    // Instantiate the router contract on the destination chain
    const destinationRouterContract = new ethers.Contract(
      destinationRouterAddress,
      routerAbi,
      destinationProvider
    );
  
    // Fetch the OffRamp contract addresses on the destination chain
    const offRamps = await destinationRouterContract.getOffRamps();
  
    const matchingOffRamps = offRamps.filter(
      (offRamp: any) => offRamp.sourceChainSelector.toString() === sourceChainSelector
    );
  
    for (const matchingOffRamp of matchingOffRamps) {
      const offRampContract = new ethers.Contract(
        matchingOffRamp.offRamp,
        offRampAbi,
        destinationProvider
      );
      const events = await offRampContract.queryFilter(
        offRampContract.filters.ExecutionStateChanged(undefined, messageId)
      );
  
      if (events.length > 0) {
        const { state } = events[0].args;
        const status = getMessageStatus(state);
        console.log(
          `Status of message ${messageId} on offRamp ${matchingOffRamp.offRamp} is ${status}\n`
        );
        return;
      }
    }
  
    // If no event found, the message has not yet been processed on the destination chain
    console.log(
      `Either the message ${messageId} does not exist OR it has not been processed yet on destination chain\n`
    );
  };  

  // Run the getStatus function and handle any errors
  getStatus().catch((e) => {
    console.error(e);
    process.exit(1);
  });