import { Signer, Contract, ContractFactory } from "ethers";
import { linkLibraries } from "./utils/linkLibraries";
import WETH9 from "./utils/WETH9.json";
import { INonfungiblePositionManager, ISwapRouter, IUniswapV3Factory, IWETH } from "../../typechain-types";

type ContractJson = { abi: any; bytecode: string };
const artifacts: { [name: string]: ContractJson } = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  SwapRouter: require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"),
  NFTDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
  NonfungibleTokenPositionDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  WETH9,
};

// TODO: Should replace these with the proper typechain output.
// type INonfungiblePositionManager = Contract;
// type IUniswapV3Factory = Contract;

export class UniswapV3Deployer {
  static async deploy(actor: Signer): Promise<{ [name: string]: Contract | IWETH | IUniswapV3Factory | ISwapRouter | INonfungiblePositionManager}> {
    const deployer = new UniswapV3Deployer(actor);

    const weth9 = await deployer.deployWETH9() as IWETH;
    const factory = await deployer.deployFactory() as IUniswapV3Factory;
    const router = await deployer.deployRouter(factory.address as string, weth9.address as string) as ISwapRouter;
    const nftDescriptorLibrary = await deployer.deployNFTDescriptorLibrary() as Contract;
    // const positionDescriptor = await deployer.deployPositionDescriptor(
    //   nftDescriptorLibrary.target as string,
    //   weth9.target as string
    // );
    const positionManager = await deployer.deployNonfungiblePositionManager(
      factory.address as string,
      weth9.address as string,
      // positionDescriptor.target as string
      "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
    ) as INonfungiblePositionManager;

    return {
      weth9,
      factory,
      router,
      nftDescriptorLibrary,
      // positionDescriptor,
      positionManager,
    };
  }

  deployer: Signer;

  constructor(deployer: Signer) {
    this.deployer = deployer;
  }

  async deployFactory() {
    return await this.deployContract<Contract>(
      artifacts.UniswapV3Factory.abi,
      artifacts.UniswapV3Factory.bytecode,
      [],
      this.deployer
    );
  }

  async deployWETH9() {
    return await this.deployContract<Contract>(
      artifacts.WETH9.abi,
      artifacts.WETH9.bytecode,
      [],
      this.deployer
    ) as IWETH
  }

  async deployRouter(factoryAddress: string, weth9Address: string) {
    return await this.deployContract<Contract>(
      artifacts.SwapRouter.abi,
      artifacts.SwapRouter.bytecode,
      [factoryAddress, weth9Address],
      this.deployer
    ) as ISwapRouter
  }

  async deployNFTDescriptorLibrary() {
    return await this.deployContract<Contract>(
      artifacts.NFTDescriptor.abi,
      artifacts.NFTDescriptor.bytecode,
      [],
      this.deployer
    );
  }

  async deployPositionDescriptor(
    nftDescriptorLibraryAddress: string,
    weth9Address: string
  ) {
    const linkedBytecode = linkLibraries(
      {
        bytecode: artifacts.NonfungibleTokenPositionDescriptor.bytecode,
        linkReferences: {
          "NFTDescriptor.sol": {
            NFTDescriptor: [
              {
                length: 20,
                start: 1261,
              },
            ],
          },
        },
      },
      {
        NFTDescriptor: nftDescriptorLibraryAddress,
      }
    );

    return (await this.deployContract(
      artifacts.NonfungibleTokenPositionDescriptor.abi,
      linkedBytecode,
      [weth9Address],
      this.deployer
    )) as Contract;
  }

  async deployNonfungiblePositionManager(
    factoryAddress: string,
    weth9Address: string,
    positionDescriptorAddress: string
  ) {
    return await this.deployContract<Contract>(
      artifacts.NonfungiblePositionManager.abi,
      artifacts.NonfungiblePositionManager.bytecode,
      [factoryAddress, weth9Address, positionDescriptorAddress],
      this.deployer
    );
  }

  private async deployContract<T>(
    abi: any,
    bytecode: string,
    deployParams: Array<any>,
    actor: Signer
  ) {
    const factory = new ContractFactory(abi, bytecode, actor);
    return await factory.deploy(...deployParams);
  }
}
