import React from 'react'
import { CheckoutWithCard } from '@paperxyz/react-client-sdk'

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function PaymentModal({ isOpen, onClose }: ModalProps) {

	if (!isOpen) return null;
	return (
		<div className="fixed inset-0  flex items-center justify-center z-[9999] overflow-auto bg-black bg-opacity-50">
			<div className="relative z-[9999] bg-white p-8 rounded-lg shadow-lg w-11/12 lg:w-1/2">
				<h2 className="text-2xl font-semibold mb-4">Fiat Payment</h2>
				<p>No Crypto? Pay just with your credit card.</p>
				<CheckoutWithCard
					configs={{
						// Registered contract ID
						contractId: 'a2b9d595-61f9-40cc-b63f-42fb1990a126',
						// Buyer wallet address
						walletAddress: '0xe98A6145acF43Fa2f159B28C70eB036A5Dc69409',
						// Mint method (for custom contracts only)
						mintMethod: {
							name: 'addMintRequest',
							args: {
								// _to: "$WALLET",
								// _quantity: "$QUANTITY",
								// _tokenId: 0,
								amount: '$QUANTITY',
								// amount: '5',
							},
							payment: {
								value: "0.1 * $QUANTITY",
								// value: '0.1 * 100',
								currency: 'USDC',
							},
						},
					}}
					onPaymentSuccess={(result) => {
						console.log('Payment successful:', result)
					}}
				/>
				<button
					className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full"
					onClick={onClose}
				>
					Close
				</button>
			</div>
		</div>
	)
}
