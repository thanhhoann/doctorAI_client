import {
	useAddress,
	useContract,
	useContractWrite,
	useMetamask,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import React, { useContext, createContext } from "react";
import { createThirdwebClient, getContract, resolveMethod } from "thirdweb";
import { defineChain } from "thirdweb/chains";

const StateContext = createContext();

export const client = createThirdwebClient({
	clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

// connect to your contract
export const contract = getContract({
	client,
	chain: defineChain(80002),
	address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
});

export const StateContextProvider = ({ children }) => {
	const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

	const donate = async (pId, amount) => {
		const data = await contract.call("donateToCampaign", [pId], {
			value: ethers.utils.parseEther(amount),
		});

		return data;
	};

	const getDonations = async (pId) => {
		const donations = await contract.call("getDonators", [pId]);
		const numberOfDonations = donations[0].length;

		const parsedDonations = [];

		for (let i = 0; i < numberOfDonations; i++) {
			parsedDonations.push({
				donator: donations[0][i],
				donation: ethers.utils.formatEther(donations[1][i].toString()),
			});
		}

		return parsedDonations;
	};
};
