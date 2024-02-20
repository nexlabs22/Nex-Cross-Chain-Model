import { Chain, polygonMumbai, sepolia } from "viem/chains";


export type AddressMap = { [blockchain: string]: Chain };
export const ChainBySelector: AddressMap = {
    [`16015286601757825753`]: sepolia,
    [`12532609583862916517`]: polygonMumbai
};