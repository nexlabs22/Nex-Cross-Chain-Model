| Section                            | Link                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------ |
| Protocol Overview                  | [Protocol Overview](#protocol-overview)                                  |
| Contracts & Modules                | [Contracts & Modules](#contracts--modules)                               |
| Mainnet Deployment Addresses       | [Mainnet Deployment Addresses](#mainnet-deployment-addresses)            |
| High-Level Cross-Chain Workflow    | [High-Level Cross-Chain Workflow](#high-level-cross-chain-workflow)      |
| Integration & Architecture Details | [Integration & Architecture Details](#integration--architecture-details) |
| Getting Started (Developer Setup)  | [Getting Started (Developer Setup)](#getting-started-developer-setup)    |
| License                            | [License](#license)                                                      |

---

## Protocol Overview

A cross-chain index protocol lets you issue and redeem “index tokens” whose underlying baskets of assets live on multiple blockchains. Instead of holding all components on a single network, each chain runs a lightweight version of the same logic:

* **Issuance (Minting):** Users deposit a stablecoin or ETH on their chain. The contract swaps it into underlying tokens on that chain via Uniswap, and, for any portion belonging to other chains, sends a cross-chain message and token payload (via Chainlink CCIP) so those chains can perform their own swaps. Once each chain’s portion is settled, the final index token supply is minted in proportion to the total value locked across all chains.

* **Redemption (Burning):** The reverse of issuance. Burning index tokens triggers local swaps of each chain’s holdings back to WETH (or native), then cross-chain messages return the necessary amounts of bridgeable tokens. After gathering returns from all chains, the user receives the chosen output (e.g., a stablecoin or ETH).

* **Re-Indexing & Re-Weighting:** Periodically, an off-chain oracle updates the target list of tokens and their weight percentages.

  1. **Ask-Values:** Each chain reports the USD value of its vault holdings via a cross-chain message.
  2. **First Reweight (“Sell Overweight Chains”):** Any chain whose actual share > target share sells surplus tokens to WETH; surplus WETH is forwarded to underweight chains.
  3. **Second Reweight (“Buy Underweight Chains”):** Underweight chains combine their existing WETH plus any cross-chain WETH to buy missing tokens, restoring target allocations.

Because each operation may involve multiple chains, the protocol relies on Chainlink CCIP to send messages and token transfers securely between them, and Uniswap V2/V3 on each chain for swaps.

---

## Contracts & Modules

Below is a high-level description of each component. Code details are omitted—only roles and interactions are noted.

1. ### CrossChainIndexFactory

   * **Role:** Entry point for cross-chain actions.
   * **Responsibilities:**

     * Receives CCIP messages (issuance, redemption, ask-values, first reweight, second reweight).
     * Executes local swaps or deposits/withdrawals from the Vault.
     * Sends CCIP replies back to the originating chain with updated values or extra WETH.

2. ### IndexFactory (Local Chain Logic)

   * **Role:** Handles issuance/redemption when the user interacts on a single chain.
   * **Responsibilities:**

     * Validates and collects cross-chain fees.
     * Swaps user deposits into WETH, deducts local protocol fee, and deposits WETH into the local Vault (or sends cross-chain requests).
     * Burns index tokens on redemption, swaps local Vault tokens to WETH, and distributes or sends cross-chain payloads for other chains’ portions.

3. ### IndexFactoryBalancer (Local Chain Logic)

   * **Role:** Executes “ask-values” and reweight actions on one chain.
   * **Responsibilities:**

     * **Ask-Values:** Pauses issuance, collects local USD valuations, then requests other chains to do the same.
     * **First Reweight:** Sells any overweight local tokens, sends surplus WETH cross-chain.
     * **Second Reweight:** Combines local and cross-chain WETH, buys missing tokens to meet target weights, then resumes issuance.

4. ### IndexFactoryStorage

   * **Role:** Shared on-chain storage per chain for local issuance, redemption, and reweight nonces, fees, Uniswap path data, and token lists.
   * **Responsibilities:**

     * Tracks nonces and per-nonce state (old/new token values, pending amounts).
     * Stores protocol parameters (fee rate, slippage tolerance, price feeds).
     * Holds mappings for `fromETHPath`/`toETHPath` (Uniswap paths) for each token.
     * Records cross-chain allowances (approved factory addresses and cross-chain token addresses).

5. ### Vault

   * **Role:** Custodial holding of each chain’s underlying tokens.
   * **Responsibilities:**

     * Only authorized operators (factory, balancer, or cross-chain handlers) can withdraw funds for swaps.

6. ### FunctionsOracle & PathHelpers

   * **FunctionsOracle:** Off-chain or on-chain oracle that provides:

     * Current token lists per chain and their target shares (for both “current” and “oracle” lists).
     * For each token, the Uniswap path data needed to swap to/from WETH.
   * **PathHelpers:** Utility to encode/decode Uniswap path information into bytes for CCIP payloads.

7. ### CoreSender & BalancerSender

   * **Role:** CCIP helpers to send issuance/redemption or reweight instructions (and WETH payments) to other chains.
   * **Responsibilities:**

     * Package nonce, chainSelector, token addresses, and path bytes into a CCIP payload.
     * Forward any bridged WETH amount needed for other chains to execute their portion of issuance/redemption or reweight.

---

## Mainnet Deployment Addresses

Below are the mainnet addresses (Arbitrum, Ethereum, BSC) for ANFI and CRYPTO5.

### ANFI (Arbitrum)

| Component                      | Address                                    |
| ------------------------------ | ------------------------------------------ |
| Index Token                    | 0x41Fecfb0E330E5FE13452B80049127991248345C |
| Index Factory Storage          | 0x8Dcb7aAe8486dEC33729a4bf15906646693af191 |
| Index Factory (Local)          | 0x6a41A7431556B5F14a3c0872175302B7A5B4D110 |
| Index Factory Balancer (Local) | 0x169dbccd891dE9676aBA701F86662C12F559cd35 |
| Vault                          | 0x8A9597D62f2F9ea8775c30586c4e4fa86851821c |
| Functions Oracle (Arbitrum)    | 0x21B15A5c6829d62ca93aa1c8db837D5A7A0e7187 |
| Core Sender (CCIP)             | 0xA33Ec66fDD910418b5C85DC5cB1b2A00b9D8701B |
| Balancer Sender (CCIP)         | 0xcC7fA3Fc08f3b735f618744776C65A149E09a943 |

### ANFI (Ethereum)

| Component                      | Address                                    |
| ------------------------------ | ------------------------------------------ |
| Vault (Ethereum)               | 0x95e9FB1be73AAED5DaEfa504A77E59F5174552b3 |
| Cross-Chain Factory (Ethereum) | 0xE2fBE16888dED5616934E603f6f03CFD8486140b |
| Cross-Chain Factory Storage    | 0xE3Aa4bFBe8FEfD04C1bB3d01Cedf683a113e13d5 |

### CRYPTO5 (Arbitrum)

| Component                      | Address                                    |
| ------------------------------ | ------------------------------------------ |
| Index Token                    | 0xdA184FC12cCe81dF499561E88f3d9a06cb229dfC |
| Index Factory Storage          | 0x3CE7E36B62e2F26E4427dB7112d4E4aE9D3CF5C4 |
| Index Factory (Local)          | 0xA00be13EbfaCa5ADB3780096F88dEA42d6a021c8 |
| Index Factory Balancer (Local) | 0x41D0aFd6Bd72bfe319408d07D79969DdDF35A75C |
| Vault                          | 0x92f9239D8950c2088Aeed3d01A4F7229cA72d93F |
| Functions Oracle (Arbitrum)    | 0x873798d59FBA2d0B0C1Cd049740c7b40fb5D84CF |
| Core Sender (CCIP)             | 0xe7CDe099c0faFD2B9BbeB07FeD167737e8bDfd78 |
| Balancer Sender (CCIP)         | 0xaC00d47A66A7e37D7A2809CAba48CaC5ba95A30F |

### Cross-Chain (BSC)

| Component                         | Address                                    |
| --------------------------------- | ------------------------------------------ |
| Vault (BSC)                       | 0x963Da1C59Ed32a36451CeCA761A3e0f5f9C333d9 |
| Cross-Chain Factory (BSC)         | 0xFE501505DA469ff0134D9e3d9dA27674A92c3234 |
| Cross-Chain Factory Storage (BSC) | 0x8e977fE53f4cDDBDdB69664027253b7d7f362971 |

---

## High-Level Cross-Chain Workflow

1. **Issuance (Minting)**

   * **User → Local Chain:** Deposit stablecoin or ETH. Pay both local fee and cross-chain fees.
   * **Local Swap:** Swap to WETH, deduct local fee, deposit WETH into Vault for local token portion.
   * **Cross-Chain Dispatch:** Send WETH payload to each other chain’s `CrossChainIndexFactory`, which performs its local swaps to deposit into its Vault.
   * **Final Mint:** Once all chains send back USD value confirmations, a keeper calculates and calls `IndexToken.mint(user, amountToMint)`.

2. **Redemption (Burning)**

   * **User → Local Chain:** Burn index tokens. Pay cross-chain fees.
   * **Local Swap:** Withdraw underlying tokens from Vault, swap to WETH, accumulate local WETH portion.
   * **Cross-Chain Dispatch:** Send CCIP requests to other chains to swap their Vault tokens → WETH and forward bridged token to origin.
   * **Final Pay-Out:** Once all WETH portions arrive, deduct fees, swap to desired output (e.g., ETH or stablecoin), and send to user.

3. **Ask-Values (Portfolio Valuation)**

   * **Local Chain:** Pause issuance, fetch local USD values for all Vault tokens, store them.
   * **Cross-Chain Dispatch:** Send CCIP “ask-values” messages to remote chains. Remote `CrossChainIndexFactory` replies with local USD values.
   * **Origin Chain:** Gather all chains’ values; once complete, the total portfolio valuation is known, and reweight can begin.

4. **First Reweight (“Sell Overweight Chains”)**

   * **Origin Chain:** Compare each chain’s actual USD share vs. oracle share. For any chain where actual share > target:

     * If it’s self: withdraw tokens → WETH, sell down to target allocation, store extra WETH locally.
     * If remote: send CCIP to that chain’s `CrossChainIndexFactory` to do the same and return extra WETH via CCIP.
   * Once all overweight actions done, origin knows total extra WETH to distribute.

5. **Second Reweight (“Buy Underweight Chains”)**

   * **Origin Chain:** For each chain where actual share < target:

     * If self: combine local WETH + cross-chain WETH from storage, swap to missing tokens, deposit into Vault.
     * If remote: send CCIP to that chain’s `CrossChainIndexFactory` with WETH payload so it can do the same locally.
   * Once all underweight actions done, protocol resumes normal issuance/redemption.

---

## Integration & Architecture Details

* **Multi-Chain Storage:** Each chain runs its own `IndexFactoryStorage` (or `CrossChainIndexFactoryStorage`) containing nonces, fees, Uniswap paths, and cross-chain token/factory registrations.
* **Cross-Chain Messaging:** Chainlink CCIP is used for all cross-chain requests and token transfers. Payloads include an `actionType` field to indicate issuance (0), redemption (1), ask-values (2), first reweight (3), or second reweight (4).
* **Uniswap Paths:** For every ERC-20 in each chain’s index, storage holds a “fromETHPath” (token→WETH) and a “toETHPath” (WETH→token), including the V3 fee tiers. These are used for all local swaps.
* **Fees:**

  * **Local Protocol Fee:** 0.01 %–1 % of the swap value, paid in WETH to a `feeReceiver`.
  * **Cross-Chain Fee:** Covers CCIP gas; calculated by summing each other chain’s fee for that portion and adding a 20 % overhead. Paid upfront in native ETH when calling issuance/redemption.
* **Oracle & Targets:** A `FunctionsOracle` (or equivalent off-chain service) provides per-token target weights (for “currentList” vs. “oracleList”) and is responsible for regularly updating these on each chain.
* **Access Control:**

  * Only the contract `owner()` or an authorized `functionsOracle.isOperator(...)` may trigger reweight or ask-values.
  * Only the registered cross-chain factory addresses can send CCIP messages to a given chain’s `CrossChainIndexFactory`.
  * The `Vault` only allows withdrawal by approved operators (factories or cross-chain handlers).

---

## Getting Started (Developer Setup)

1. **Clone & Install**

   ```bash
   git clone git@github.com:nexlabs22/Nex-Cross-Chain-Model.git
   cd Nex-Cross-Chain-Model
   npm install
   forge install
   ```

2. **Environment Variables**
   Create a `.env` with your node URLs and private key, for example:

   ```env
   ARBITRUM_RPC_URL="https://arb1.arbitrum.io/rpc"
   ETHEREUM_RPC_URL="https://mainnet.infura.io/v3/YOUR_INFURA_KEY"
   ```

3. **Compile & Test**

   ```bash
   forge compile
   forge build
   ```

4. **Deploy on Each Chain**

   * **Storage Contract:** Deploy `IndexFactoryStorage` (or `CrossChainIndexFactoryStorage`) with initial parameters (WETH, Uniswap routers, price feeds, feeReceiver).
   * **Vault:** Deploy and call `Vault.initialize()`, then `Vault.setOperator(IndexFactory, true)` and `Vault.setOperator(IndexFactoryBalancer, true)`.
   * **FunctionsOracle:** Deploy or point to an existing oracle that will set token lists and weight shares.
   * **IndexFactory & IndexFactoryBalancer (Local):** Deploy both, calling their `initialize(...)` methods with appropriate chainSelector, contract addresses, and WETH.
   * **CoreSender & BalancerSender:** Deploy helpers to facilitate CCIP cross-chain Sends. Register them in the storage contract (via `setCoreSender(...)` and `setBalancerSender(...)`).
   * **CrossChainIndexFactory (on cross-chain hub chains):** Deploy with `initialize(storageAddress, CCIP_ROUTER, LINK_TOKEN)`. Register its address in each storage contract as `crossChainFactoryBySelector[chainSelector]`.

5. **Configure Oracle & Paths**

   * Off-chain, set each chain’s “currentList” and “oracleList” token arrays in `FunctionsOracle`, along with each token’s target share (in 1e18 units).
   * Call `IndexFactoryStorage.setFromETHPath(token, pathArray, feeTierArray)` and `setToETHPath(...)` for every token you expect to trade, using Uniswap pool fee tiers.
   * Register cross-chain tokens (e.g., WETH on each chain) via `setCrossChainToken(chainSelector, tokenAddress, fromETHPath, fromETHFees)` and `setCrossChainFactory(chainFactoryAddress, chainSelector)`.

6. **Automate Keepers**

   * Monitor `RequestIssuance` / `RequestRedemption` events; wait for CCIP replies. When all local/remote tokens’ values are known, calculate final mint or pay-out and submit the on-chain transaction.
   * Periodically trigger `askValues()`, then `firstReweightAction()`, then `secondReweightAction()` on each chain once oracle data changes.

---

## License

This project is released under the **MIT License**. Please see the `LICENSE` file for full details.
