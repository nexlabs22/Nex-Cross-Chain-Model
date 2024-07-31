export const indexTokenAbi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'feeRatePerDayScaled',
				type: 'uint256',
			},
		],
		name: 'FeeRateSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'feeReceiver',
				type: 'address',
			},
		],
		name: 'FeeReceiverSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint8',
				name: 'version',
				type: 'uint8',
			},
		],
		name: 'Initialized',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'methodologist',
				type: 'address',
			},
		],
		name: 'MethodologistSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'string',
				name: 'methodology',
				type: 'string',
			},
		],
		name: 'MethodologySet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'feeReceiver',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'timestamp',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'totalSupply',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'MintFeeToReceiver',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'minter',
				type: 'address',
			},
		],
		name: 'MinterSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'OwnershipTransferred',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		name: 'Paused',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'supplyCeiling',
				type: 'uint256',
			},
		],
		name: 'SupplyCeilingSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'isRestricted',
				type: 'bool',
			},
		],
		name: 'ToggledRestricted',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		name: 'Unpaused',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
		],
		name: 'allowance',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'approve',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		name: 'balanceOf',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'burn',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'decimals',
		outputs: [
			{
				internalType: 'uint8',
				name: '',
				type: 'uint8',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'subtractedValue',
				type: 'uint256',
			},
		],
		name: 'decreaseAllowance',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'feeRatePerDayScaled',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'feeReceiver',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'feeTimestamp',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'addedValue',
				type: 'uint256',
			},
		],
		name: 'increaseAllowance',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'tokenName',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'tokenSymbol',
				type: 'string',
			},
			{
				internalType: 'uint256',
				name: '_feeRatePerDayScaled',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: '_feeReceiver',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '_supplyCeiling',
				type: 'uint256',
			},
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'isRestricted',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'methodologist',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'methodology',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'mint',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'mintToFeeReceiver',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'minter',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'name',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'pause',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'paused',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_proposedOwner',
				type: 'address',
			},
		],
		name: 'proposeOwner',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'proposedOwner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_feeRatePerDayScaled',
				type: 'uint256',
			},
		],
		name: 'setFeeRate',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_feeReceiver',
				type: 'address',
			},
		],
		name: 'setFeeReceiver',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_methodologist',
				type: 'address',
			},
		],
		name: 'setMethodologist',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: '_methodology',
				type: 'string',
			},
		],
		name: 'setMethodology',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_minter',
				type: 'address',
			},
		],
		name: 'setMinter',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_supplyCeiling',
				type: 'uint256',
			},
		],
		name: 'setSupplyCeiling',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'supplyCeiling',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'who',
				type: 'address',
			},
		],
		name: 'toggleRestriction',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'transfer',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'transferFrom',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'unpause',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]

export const indexTokenV2Abi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'feeRatePerDayScaled',
				type: 'uint256',
			},
		],
		name: 'FeeRateSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'feeReceiver',
				type: 'address',
			},
		],
		name: 'FeeReceiverSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint8',
				name: 'version',
				type: 'uint8',
			},
		],
		name: 'Initialized',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'methodologist',
				type: 'address',
			},
		],
		name: 'MethodologistSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'string',
				name: 'methodology',
				type: 'string',
			},
		],
		name: 'MethodologySet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'feeReceiver',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'timestamp',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'totalSupply',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'MintFeeToReceiver',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'minter',
				type: 'address',
			},
		],
		name: 'MinterSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'OwnershipTransferred',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		name: 'Paused',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'supplyCeiling',
				type: 'uint256',
			},
		],
		name: 'SupplyCeilingSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'isRestricted',
				type: 'bool',
			},
		],
		name: 'ToggledRestricted',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		name: 'Unpaused',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
		],
		name: 'allowance',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'approve',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_token',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '_amount',
				type: 'uint256',
			},
		],
		name: 'approveSwapToken',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		name: 'balanceOf',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'burn',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'decimals',
		outputs: [
			{
				internalType: 'uint8',
				name: '',
				type: 'uint8',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'subtractedValue',
				type: 'uint256',
			},
		],
		name: 'decreaseAllowance',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'factoryV2',
		outputs: [
			{
				internalType: 'contract IUniswapV2Factory',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'factoryV3',
		outputs: [
			{
				internalType: 'contract IUniswapV3Factory',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'fee',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'feeRatePerDayScaled',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'feeReceiver',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'feeTimestamp',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'addedValue',
				type: 'uint256',
			},
		],
		name: 'increaseAllowance',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'tokenName',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'tokenSymbol',
				type: 'string',
			},
			{
				internalType: 'uint256',
				name: '_feeRatePerDayScaled',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: '_feeReceiver',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '_supplyCeiling',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: '_weth',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_quoter',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_swapRouterV3',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_factoryV3',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_swapRouterV2',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_factoryV2',
				type: 'address',
			},
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'isRestricted',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'methodologist',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'methodology',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'mint',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'mintToFeeReceiver',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'minter',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'name',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'pause',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'paused',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_proposedOwner',
				type: 'address',
			},
		],
		name: 'proposeOwner',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'proposedOwner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'quoter',
		outputs: [
			{
				internalType: 'contract IQuoter',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_feeRatePerDayScaled',
				type: 'uint256',
			},
		],
		name: 'setFeeRate',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_feeReceiver',
				type: 'address',
			},
		],
		name: 'setFeeReceiver',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_methodologist',
				type: 'address',
			},
		],
		name: 'setMethodologist',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: '_methodology',
				type: 'string',
			},
		],
		name: 'setMethodology',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_minter',
				type: 'address',
			},
		],
		name: 'setMinter',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_supplyCeiling',
				type: 'uint256',
			},
		],
		name: 'setSupplyCeiling',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'supplyCeiling',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'swapRouterV2',
		outputs: [
			{
				internalType: 'contract IUniswapV2Router02',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'swapRouterV3',
		outputs: [
			{
				internalType: 'contract ISwapRouter',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'tokenIn',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'tokenOut',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amountIn',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: '_recipient',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '_swapVersion',
				type: 'uint256',
			},
		],
		name: 'swapSingle',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'who',
				type: 'address',
			},
		],
		name: 'toggleRestriction',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'tokenMarketShare',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'tokenSwapVersion',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'transfer',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'transferFrom',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'unpause',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'weth',
		outputs: [
			{
				internalType: 'contract IWETH',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		stateMutability: 'payable',
		type: 'receive',
	},
]

export const nftAbi = [
	{
		inputs: [
			{
				internalType: 'string',
				name: '_name',
				type: 'string',
			},
			{
				internalType: 'string',
				name: '_symbol',
				type: 'string',
			},
			{
				internalType: 'address',
				name: '_minter',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: '_userAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_amount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_time',
				type: 'uint256',
			},
		],
		name: 'AddBurnRequestNFT',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: '_userAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_amount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_time',
				type: 'uint256',
			},
		],
		name: 'AddMintRequestNFT',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'approved',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'operator',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'approved',
				type: 'bool',
			},
		],
		name: 'ApprovalForAll',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: '_fromTokenId',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_toTokenId',
				type: 'uint256',
			},
		],
		name: 'BatchMetadataUpdate',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: '_tokenId',
				type: 'uint256',
			},
		],
		name: 'MetadataUpdate',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'minter',
				type: 'address',
			},
		],
		name: 'MinterSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'OwnershipTransferred',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: '_indexName',
				type: 'string',
			},
			{
				internalType: 'address',
				name: '_userAddress',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '_amount',
				type: 'uint256',
			},
		],
		name: 'addBurnRequestNFT',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: '_indexName',
				type: 'string',
			},
			{
				internalType: 'address',
				name: '_userAddress',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '_amount',
				type: 'uint256',
			},
		],
		name: 'addMintRequestNFT',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
		],
		name: 'approve',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		name: 'balanceOf',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'baseUrl',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'exampleURL',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: '_indexName',
				type: 'string',
			},
			{
				internalType: 'string',
				name: '_requestType',
				type: 'string',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '_timestamp',
				type: 'uint256',
			},
		],
		name: 'generateURI',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
		],
		name: 'getApproved',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'operator',
				type: 'address',
			},
		],
		name: 'isApprovedForAll',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'minter',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'name',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
		],
		name: 'ownerOf',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
		],
		name: 'safeTransferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
			{
				internalType: 'bytes',
				name: 'data',
				type: 'bytes',
			},
		],
		name: 'safeTransferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'operator',
				type: 'address',
			},
			{
				internalType: 'bool',
				name: 'approved',
				type: 'bool',
			},
		],
		name: 'setApprovalForAll',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_minter',
				type: 'address',
			},
		],
		name: 'setMinter',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes4',
				name: 'interfaceId',
				type: 'bytes4',
			},
		],
		name: 'supportsInterface',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
		],
		name: 'tokenURI',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
		],
		name: 'transferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]

export const tokenAbi = [
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'initialSupply',
				type: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
		],
		name: 'allowance',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'approve',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		name: 'balanceOf',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'decimals',
		outputs: [
			{
				internalType: 'uint8',
				name: '',
				type: 'uint8',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'subtractedValue',
				type: 'uint256',
			},
		],
		name: 'decreaseAllowance',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'addedValue',
				type: 'uint256',
			},
		],
		name: 'increaseAllowance',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'name',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'transfer',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'transferFrom',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]

export const indexFactoryAbi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'nonce',
				type: 'uint256',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'requester',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'depositAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'timestamp',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'inputRequestHash',
				type: 'bytes32',
			},
		],
		name: 'BurnConfirmed',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'nonce',
				type: 'uint256',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'requester',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'depositAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'timestamp',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'requestHash',
				type: 'bytes32',
			},
		],
		name: 'Burned',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'custodian',
				type: 'address',
			},
		],
		name: 'CustodianSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint8',
				name: 'version',
				type: 'uint8',
			},
		],
		name: 'Initialized',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'merchant',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'depositAddress',
				type: 'address',
			},
		],
		name: 'IssuerDepositAddressSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'issuer',
				type: 'address',
			},
		],
		name: 'IssuerSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'merchant',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'depositAddress',
				type: 'address',
			},
		],
		name: 'MerchantDepositAddressSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'nonce',
				type: 'uint256',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'requester',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'depositAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'timestamp',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'requestHash',
				type: 'bytes32',
			},
		],
		name: 'MintConfirmed',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'nonce',
				type: 'uint256',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'requester',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'depositAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'timestamp',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'requestHash',
				type: 'bytes32',
			},
		],
		name: 'MintRejected',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'nonce',
				type: 'uint256',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'requester',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'depositAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'timestamp',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'requestHash',
				type: 'bytes32',
			},
		],
		name: 'MintRequestAdd',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'nonce',
				type: 'uint256',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'requester',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'requestHash',
				type: 'bytes32',
			},
		],
		name: 'MintRequestCancel',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'nft',
				type: 'address',
			},
		],
		name: 'NFTSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'OwnershipTransferred',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		name: 'Paused',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'token',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'time',
				type: 'uint256',
			},
		],
		name: 'TokenAddressSet',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		name: 'Unpaused',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'usdc',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'uint8',
				name: 'decimals',
				type: 'uint8',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'time',
				type: 'uint256',
			},
		],
		name: 'UsdcAddressSet',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'user',
				type: 'address',
			},
		],
		name: 'addMintRequest',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'user',
				type: 'address',
			},
		],
		name: 'burn',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		name: 'burnRequestNonce',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 'burnRequests',
		outputs: [
			{
				internalType: 'address',
				name: 'requester',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'depositAddress',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'nonce',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'timestamp',
				type: 'uint256',
			},
			{
				internalType: 'enum IndexFactoryInterface.RequestStatus',
				name: 'status',
				type: 'uint8',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'requestHash',
				type: 'bytes32',
			},
		],
		name: 'confirmBurnRequest',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'requestHash',
				type: 'bytes32',
			},
			{
				internalType: 'uint256',
				name: '_tokenAmount',
				type: 'uint256',
			},
		],
		name: 'confirmMintRequest',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'custodianWallet',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'feeRate',
		outputs: [
			{
				internalType: 'uint8',
				name: '',
				type: 'uint8',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getAllBurnRequests',
		outputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'requester',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
					{
						internalType: 'address',
						name: 'depositAddress',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'nonce',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'timestamp',
						type: 'uint256',
					},
					{
						internalType: 'enum IndexFactoryInterface.RequestStatus',
						name: 'status',
						type: 'uint8',
					},
				],
				internalType: 'struct IndexFactoryInterface.Request[]',
				name: '',
				type: 'tuple[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getAllMintRequests',
		outputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'requester',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
					{
						internalType: 'address',
						name: 'depositAddress',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'nonce',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'timestamp',
						type: 'uint256',
					},
					{
						internalType: 'enum IndexFactoryInterface.RequestStatus',
						name: 'status',
						type: 'uint8',
					},
				],
				internalType: 'struct IndexFactoryInterface.Request[]',
				name: '',
				type: 'tuple[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'nonce',
				type: 'uint256',
			},
		],
		name: 'getBurnRequest',
		outputs: [
			{
				internalType: 'uint256',
				name: 'requestNonce',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'requester',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'depositAddress',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'timestamp',
				type: 'uint256',
			},
			{
				internalType: 'string',
				name: 'status',
				type: 'string',
			},
			{
				internalType: 'bytes32',
				name: 'requestHash',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getBurnRequestsLength',
		outputs: [
			{
				internalType: 'uint256',
				name: 'length',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'nonce',
				type: 'uint256',
			},
		],
		name: 'getMintRequest',
		outputs: [
			{
				internalType: 'uint256',
				name: 'requestNonce',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'requester',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'depositAddress',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'timestamp',
				type: 'uint256',
			},
			{
				internalType: 'string',
				name: 'status',
				type: 'string',
			},
			{
				internalType: 'bytes32',
				name: 'requestHash',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getMintRequestsLength',
		outputs: [
			{
				internalType: 'uint256',
				name: 'length',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_custodianWallet',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_issuer',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_token',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_usdc',
				type: 'address',
			},
			{
				internalType: 'uint8',
				name: '_usdcDecimals',
				type: 'uint8',
			},
			{
				internalType: 'address',
				name: '_nft',
				type: 'address',
			},
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'issuer',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'latestFeeUpdate',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		name: 'mintRequestNonce',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 'mintRequests',
		outputs: [
			{
				internalType: 'address',
				name: 'requester',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'depositAddress',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'nonce',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'timestamp',
				type: 'uint256',
			},
			{
				internalType: 'enum IndexFactoryInterface.RequestStatus',
				name: 'status',
				type: 'uint8',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'nft',
		outputs: [
			{
				internalType: 'contract RequestNFT',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'pause',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'paused',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_custodianWallet',
				type: 'address',
			},
		],
		name: 'setCustodianWallet',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint8',
				name: '_newFee',
				type: 'uint8',
			},
		],
		name: 'setFeeRate',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_issuer',
				type: 'address',
			},
		],
		name: 'setIssuer',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_nft',
				type: 'address',
			},
		],
		name: 'setNFT',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_token',
				type: 'address',
			},
		],
		name: 'setTokenAddress',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_usdc',
				type: 'address',
			},
			{
				internalType: 'uint8',
				name: '_usdcDecimals',
				type: 'uint8',
			},
		],
		name: 'setUsdcAddress',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'token',
		outputs: [
			{
				internalType: 'contract IndexToken',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'unpause',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'usdc',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'usdcDecimals',
		outputs: [
			{
				internalType: 'uint8',
				name: '',
				type: 'uint8',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
]

export const indexFactoryV2Abi = [
  {
    "inputs": [],
    "name": "T",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "ChainlinkCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "ChainlinkFulfilled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "ChainlinkRequested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "feeRatePerDayScaled",
        "type": "uint256"
      }
    ],
    "name": "FeeRateSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "feeReceiver",
        "type": "address"
      }
    ],
    "name": "FeeReceiverSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "inputToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "inputAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "outputAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      }
    ],
    "name": "Issuanced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "messageId",
        "type": "bytes32"
      }
    ],
    "name": "MessageSent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "methodologist",
        "type": "address"
      }
    ],
    "name": "MethodologistSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "methodology",
        "type": "string"
      }
    ],
    "name": "MethodologySet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "feeReceiver",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalSupply",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "MintFeeToReceiver",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "minter",
        "type": "address"
      }
    ],
    "name": "MinterSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "outputToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "inputAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "outputAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      }
    ],
    "name": "Redemption",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "supplyCeiling",
        "type": "uint256"
      }
    ],
    "name": "SupplyCeilingSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isRestricted",
        "type": "bool"
      }
    ],
    "name": "ToggledRestricted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "a",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "b",
        "type": "string"
      }
    ],
    "name": "concatenation",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "currentList",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenIn",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint128",
        "name": "amountIn",
        "type": "uint128"
      },
      {
        "internalType": "uint32",
        "name": "secondsAgo",
        "type": "uint32"
      }
    ],
    "name": "estimateAmountOut",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "externalJobId",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "factoryV2",
    "outputs": [
      {
        "internalType": "contract IUniswapV2Factory",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "factoryV3",
    "outputs": [
      {
        "internalType": "contract IUniswapV3Factory",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeRate",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeRatePerDayScaled",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeReceiver",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeTimestamp",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      },
      {
        "internalType": "address[]",
        "name": "_tokens",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_marketShares",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_swapVersions",
        "type": "uint256[]"
      }
    ],
    "name": "fulfillAssetsData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenIn",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_swapVersion",
        "type": "uint256"
      }
    ],
    "name": "getAmountOut",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "finalAmountOut",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenIn",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_swapVersion",
        "type": "uint256"
      }
    ],
    "name": "getExactAmountOut",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "finalAmountOut",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenIn",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      }
    ],
    "name": "getExactAmountOut2",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "finalAmountOut",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amountIn",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_tokenIn",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_swapVersion",
        "type": "uint256"
      }
    ],
    "name": "getIssuanceAmountOut",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amountIn",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_tokenIn",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_swapVersion",
        "type": "uint256"
      }
    ],
    "name": "getIssuanceAmountOut2",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPortfolioBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amountIn",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_swapVersion",
        "type": "uint256"
      }
    ],
    "name": "getRedemptionAmountOut",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amountIn",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_swapVersion",
        "type": "uint256"
      }
    ],
    "name": "getRedemptionAmountOut2",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "indexToken",
    "outputs": [
      {
        "internalType": "contract IndexToken",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_chainlinkToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_oracleAddress",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "_externalJobId",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "_toUsdPriceFeed",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_weth",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_quoter",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_swapRouterV3",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_factoryV3",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_swapRouterV2",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_factoryV2",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "isRestricted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenIn",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_tokenInSwapVersion",
        "type": "uint256"
      }
    ],
    "name": "issuanceIndexTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_inputAmount",
        "type": "uint256"
      }
    ],
    "name": "issuanceIndexTokensWithEth",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastUpdateTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "latestFeeUpdate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "methodologist",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "methodology",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "minter",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_tokens",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_marketShares",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_swapVersions",
        "type": "uint256[]"
      }
    ],
    "name": "mockFillAssetsList",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "oracleList",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "oraclePayment",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "priceInWei",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_proposedOwner",
        "type": "address"
      }
    ],
    "name": "proposeOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proposedOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "quoter",
    "outputs": [
      {
        "internalType": "contract IQuoter",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "reIndexAndReweight",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_tokenOutSwapVersion",
        "type": "uint256"
      }
    ],
    "name": "redemption",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "requestAssetsData",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "_newFee",
        "type": "uint8"
      }
    ],
    "name": "setFeeRate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_toUsdPricefeed",
        "type": "address"
      }
    ],
    "name": "setPriceFeed",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_beforeAddress",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_afterAddress",
        "type": "string"
      }
    ],
    "name": "setUrl",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "supplyCeiling",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "swapRouterV2",
    "outputs": [
      {
        "internalType": "contract IUniswapV2Router02",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "swapRouterV3",
    "outputs": [
      {
        "internalType": "contract ISwapRouter",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "toUsdPriceFeed",
    "outputs": [
      {
        "internalType": "contract AggregatorV3Interface",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "tokenCurrentListIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "tokenCurrentMarketShare",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "tokenOracleListIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "tokenOracleMarketShare",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "tokenSwapVersion",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalCurrentList",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalOracleList",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "weth",
    "outputs": [
      {
        "internalType": "contract IWETH",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]

export const crossChainIndexFactoryV2Abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "router",
        "type": "address"
      }
    ],
    "name": "InvalidRouter",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "messageId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "inputToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "inputAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "outputAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      }
    ],
    "name": "Issuanced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "messageId",
        "type": "bytes32"
      }
    ],
    "name": "MessageSent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "messageId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "outputToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "inputAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "outputAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      }
    ],
    "name": "Redemption",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "messageId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "inputToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "inputAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "outputAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      }
    ],
    "name": "RequestIssuance",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "messageId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "outputToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "inputAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "outputAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      }
    ],
    "name": "RequestRedemption",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "messageId",
            "type": "bytes32"
          },
          {
            "internalType": "uint64",
            "name": "sourceChainSelector",
            "type": "uint64"
          },
          {
            "internalType": "bytes",
            "name": "sender",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "token",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "internalType": "struct Client.EVMTokenAmount[]",
            "name": "destTokenAmounts",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct Client.Any2EVMMessage",
        "name": "message",
        "type": "tuple"
      }
    ],
    "name": "ccipReceive",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_ethAmount",
        "type": "uint256"
      }
    ],
    "name": "convertEthToUsd",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_chainSelector",
        "type": "uint64"
      }
    ],
    "name": "crossChainFactoryBySelector",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_chainSelector",
        "type": "uint64"
      }
    ],
    "name": "crossChainToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_chainSelector",
        "type": "uint64"
      }
    ],
    "name": "crossChainTokenSwapVersion",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentChainSelector",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenIn",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint128",
        "name": "amountIn",
        "type": "uint128"
      },
      {
        "internalType": "uint32",
        "name": "secondsAgo",
        "type": "uint32"
      }
    ],
    "name": "estimateAmountOut",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeRate",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenIn",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_swapVersion",
        "type": "uint256"
      }
    ],
    "name": "getAmountOut",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "finalAmountOut",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPortfolioBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRouter",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "i_link",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "i_maxTokensLength",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "indexFactoryStorage",
    "outputs": [
      {
        "internalType": "contract IndexFactoryStorage",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "indexToken",
    "outputs": [
      {
        "internalType": "contract IndexToken",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_currentChainSelector",
        "type": "uint64"
      },
      {
        "internalType": "address payable",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_chainlinkToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_router",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_weth",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "issuanceCompletedTokensCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenIn",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_inputAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_crossChainFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_tokenInSwapVersion",
        "type": "uint256"
      }
    ],
    "name": "issuanceIndexTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_inputAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_crossChainFee",
        "type": "uint256"
      }
    ],
    "name": "issuanceIndexTokensWithEth",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "issuanceInputAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "issuanceInputToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "issuanceMessageIdByNonce",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "issuanceNonce",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "issuanceNonceRequester",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "issuanceTokenOldAndNewValues",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "oldTokenValue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "newTokenValue",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "latestFeeUpdate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "portfolioTotalValueByNonce",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "priceInWei",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_proposedOwner",
        "type": "address"
      }
    ],
    "name": "proposeOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proposedOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_crossChainFee",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_tokenOutSwapVersion",
        "type": "uint256"
      }
    ],
    "name": "redemption",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "redemptionCompletedTokensCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "redemptionInputAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "redemptionMessageIdByNonce",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "redemptionNonce",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "redemptionNonceOutputToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "redemptionNonceOutputTokenSwapVersion",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "redemptionNonceRequester",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "redemptionNonceTotalValue",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "redemptionOutputToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "destinationChainSelector",
        "type": "uint64"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      },
      {
        "internalType": "enum IndexFactory.PayFeesIn",
        "name": "payFeesIn",
        "type": "uint8"
      }
    ],
    "name": "sendMessage",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "_newFee",
        "type": "uint8"
      }
    ],
    "name": "setFeeRate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_indexFactoryStorage",
        "type": "address"
      }
    ],
    "name": "setIndexFactoryStorage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenIn",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_swapVersion",
        "type": "uint256"
      }
    ],
    "name": "swap",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "tokenValueByNonce",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "updatePortfolioNonce",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "updatedTokensValueCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "weth",
    "outputs": [
      {
        "internalType": "contract IWETH",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]

// export const crossChainIndexFactoryV2Abi = [
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "router",
//         "type": "address"
//       }
//     ],
//     "name": "InvalidRouter",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "T",
//     "type": "error"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "bytes32",
//         "name": "id",
//         "type": "bytes32"
//       }
//     ],
//     "name": "ChainlinkCancelled",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "bytes32",
//         "name": "id",
//         "type": "bytes32"
//       }
//     ],
//     "name": "ChainlinkFulfilled",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "bytes32",
//         "name": "id",
//         "type": "bytes32"
//       }
//     ],
//     "name": "ChainlinkRequested",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "uint8",
//         "name": "version",
//         "type": "uint8"
//       }
//     ],
//     "name": "Initialized",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "bytes32",
//         "name": "messageId",
//         "type": "bytes32"
//       },
//       {
//         "indexed": true,
//         "internalType": "uint256",
//         "name": "nonce",
//         "type": "uint256"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "time",
//         "type": "uint256"
//       }
//     ],
//     "name": "Issuanced",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "bytes32",
//         "name": "messageId",
//         "type": "bytes32"
//       }
//     ],
//     "name": "MessageSent",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "previousOwner",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "newOwner",
//         "type": "address"
//       }
//     ],
//     "name": "OwnershipTransferred",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "address",
//         "name": "account",
//         "type": "address"
//       }
//     ],
//     "name": "Paused",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "bytes32",
//         "name": "messageId",
//         "type": "bytes32"
//       },
//       {
//         "indexed": true,
//         "internalType": "uint256",
//         "name": "nonce",
//         "type": "uint256"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "time",
//         "type": "uint256"
//       }
//     ],
//     "name": "Redemption",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "address",
//         "name": "account",
//         "type": "address"
//       }
//     ],
//     "name": "Unpaused",
//     "type": "event"
//   },
//   {
//     "inputs": [
//       {
//         "components": [
//           {
//             "internalType": "bytes32",
//             "name": "messageId",
//             "type": "bytes32"
//           },
//           {
//             "internalType": "uint64",
//             "name": "sourceChainSelector",
//             "type": "uint64"
//           },
//           {
//             "internalType": "bytes",
//             "name": "sender",
//             "type": "bytes"
//           },
//           {
//             "internalType": "bytes",
//             "name": "data",
//             "type": "bytes"
//           },
//           {
//             "components": [
//               {
//                 "internalType": "address",
//                 "name": "token",
//                 "type": "address"
//               },
//               {
//                 "internalType": "uint256",
//                 "name": "amount",
//                 "type": "uint256"
//               }
//             ],
//             "internalType": "struct Client.EVMTokenAmount[]",
//             "name": "destTokenAmounts",
//             "type": "tuple[]"
//           }
//         ],
//         "internalType": "struct Client.Any2EVMMessage",
//         "name": "message",
//         "type": "tuple"
//       }
//     ],
//     "name": "ccipReceive",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "_ethAmount",
//         "type": "uint256"
//       }
//     ],
//     "name": "convertEthToUsd",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint64",
//         "name": "",
//         "type": "uint64"
//       }
//     ],
//     "name": "crossChainToken",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint64",
//         "name": "",
//         "type": "uint64"
//       },
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "name": "crossChainTokenSwapVersion",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "crossChainVault",
//     "outputs": [
//       {
//         "internalType": "contract CrossChainVault",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "currentChainSelector",
//     "outputs": [
//       {
//         "internalType": "uint64",
//         "name": "",
//         "type": "uint64"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "tokenIn",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "tokenOut",
//         "type": "address"
//       },
//       {
//         "internalType": "uint128",
//         "name": "amountIn",
//         "type": "uint128"
//       },
//       {
//         "internalType": "uint32",
//         "name": "secondsAgo",
//         "type": "uint32"
//       }
//     ],
//     "name": "estimateAmountOut",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountOut",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "factoryV2",
//     "outputs": [
//       {
//         "internalType": "contract IUniswapV2Factory",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "factoryV3",
//     "outputs": [
//       {
//         "internalType": "contract IUniswapV3Factory",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "fee",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "feeRate",
//     "outputs": [
//       {
//         "internalType": "uint8",
//         "name": "",
//         "type": "uint8"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "feeRatePerDayScaled",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "feeReceiver",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "feeTimestamp",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "tokenIn",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "tokenOut",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountIn",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "_swapVersion",
//         "type": "uint256"
//       }
//     ],
//     "name": "getAmountOut",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "finalAmountOut",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "getRouter",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "i_link",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "i_maxTokensLength",
//     "outputs": [
//       {
//         "internalType": "uint16",
//         "name": "",
//         "type": "uint16"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint64",
//         "name": "_currentChainSelector",
//         "type": "uint64"
//       },
//       {
//         "internalType": "address payable",
//         "name": "_crossChainVault",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "_chainlinkToken",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "_router",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "_weth",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "_swapRouterV3",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "_factoryV3",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "_swapRouterV2",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "_factoryV2",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "_toUsdPriceFeed",
//         "type": "address"
//       }
//     ],
//     "name": "initialize",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "name": "isRestricted",
//     "outputs": [
//       {
//         "internalType": "bool",
//         "name": "",
//         "type": "bool"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "name": "issuanceCompletedTokensCount",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "name": "issuanceMessageIdByNonce",
//     "outputs": [
//       {
//         "internalType": "bytes32",
//         "name": "",
//         "type": "bytes32"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "name": "issuanceTokenOldAndNewValues",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "oldTokenValue",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "newTokenValue",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "latestFeeUpdate",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "bytes32",
//         "name": "",
//         "type": "bytes32"
//       }
//     ],
//     "name": "messageDetail",
//     "outputs": [
//       {
//         "internalType": "uint64",
//         "name": "sourceChainSelector",
//         "type": "uint64"
//       },
//       {
//         "internalType": "address",
//         "name": "sender",
//         "type": "address"
//       },
//       {
//         "internalType": "string",
//         "name": "message",
//         "type": "string"
//       },
//       {
//         "internalType": "address",
//         "name": "token",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amount",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "methodologist",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "methodology",
//     "outputs": [
//       {
//         "internalType": "string",
//         "name": "",
//         "type": "string"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "minter",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "oraclePayment",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "owner",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "pause",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "paused",
//     "outputs": [
//       {
//         "internalType": "bool",
//         "name": "",
//         "type": "bool"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "priceInWei",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "_proposedOwner",
//         "type": "address"
//       }
//     ],
//     "name": "proposeOwner",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "proposedOwner",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "quoter",
//     "outputs": [
//       {
//         "internalType": "contract IQuoter",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "name": "receivedMessages",
//     "outputs": [
//       {
//         "internalType": "bytes32",
//         "name": "",
//         "type": "bytes32"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "name": "redemptionMessageIdByNonce",
//     "outputs": [
//       {
//         "internalType": "bytes32",
//         "name": "",
//         "type": "bytes32"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "renounceOwnership",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint64",
//         "name": "destinationChainSelector",
//         "type": "uint64"
//       },
//       {
//         "internalType": "address",
//         "name": "receiver",
//         "type": "address"
//       },
//       {
//         "internalType": "bytes",
//         "name": "_data",
//         "type": "bytes"
//       },
//       {
//         "internalType": "enum CrossChainIndexFactory.PayFeesIn",
//         "name": "payFeesIn",
//         "type": "uint8"
//       }
//     ],
//     "name": "sendMessage",
//     "outputs": [
//       {
//         "internalType": "bytes32",
//         "name": "",
//         "type": "bytes32"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "_router",
//         "type": "address"
//       }
//     ],
//     "name": "setCcipRouter",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint64",
//         "name": "_chainSelector",
//         "type": "uint64"
//       },
//       {
//         "internalType": "address",
//         "name": "_crossChainToken",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "_swapVersion",
//         "type": "uint256"
//       }
//     ],
//     "name": "setCrossChainToken",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address payable",
//         "name": "_crossChainVault",
//         "type": "address"
//       }
//     ],
//     "name": "setCrossChainVault",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "sourceChainSelectorF",
//     "outputs": [
//       {
//         "internalType": "uint64",
//         "name": "",
//         "type": "uint64"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "supplyCeiling",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "bytes4",
//         "name": "interfaceId",
//         "type": "bytes4"
//       }
//     ],
//     "name": "supportsInterface",
//     "outputs": [
//       {
//         "internalType": "bool",
//         "name": "",
//         "type": "bool"
//       }
//     ],
//     "stateMutability": "pure",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "tokenIn",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "tokenOut",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountIn",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address",
//         "name": "_recipient",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "_swapVersion",
//         "type": "uint256"
//       }
//     ],
//     "name": "swap",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "swapRouterV2",
//     "outputs": [
//       {
//         "internalType": "contract IUniswapV2Router02",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "swapRouterV3",
//     "outputs": [
//       {
//         "internalType": "contract ISwapRouter",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "toUsdPriceFeed",
//     "outputs": [
//       {
//         "internalType": "contract AggregatorV3Interface",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "newOwner",
//         "type": "address"
//       }
//     ],
//     "name": "transferOwnership",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "unpause",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "weth",
//     "outputs": [
//       {
//         "internalType": "contract IWETH",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "stateMutability": "payable",
//     "type": "receive"
//   }
// ]

// export const crossChainIndexFactoryV2Abi = [
// 	{
// 		inputs: [
// 			{
// 				internalType: 'address',
// 				name: 'router',
// 				type: 'address',
// 			},
// 		],
// 		name: 'InvalidRouter',
// 		type: 'error',
// 	},
// 	{
// 		anonymous: false,
// 		inputs: [
// 			{
// 				indexed: false,
// 				internalType: 'uint8',
// 				name: 'version',
// 				type: 'uint8',
// 			},
// 		],
// 		name: 'Initialized',
// 		type: 'event',
// 	},
// 	{
// 		anonymous: false,
// 		inputs: [
// 			{
// 				indexed: true,
// 				internalType: 'address',
// 				name: 'user',
// 				type: 'address',
// 			},
// 			{
// 				indexed: true,
// 				internalType: 'address',
// 				name: 'inputToken',
// 				type: 'address',
// 			},
// 			{
// 				indexed: false,
// 				internalType: 'uint256',
// 				name: 'inputAmount',
// 				type: 'uint256',
// 			},
// 			{
// 				indexed: false,
// 				internalType: 'uint256',
// 				name: 'outputAmount',
// 				type: 'uint256',
// 			},
// 			{
// 				indexed: false,
// 				internalType: 'uint256',
// 				name: 'time',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'Issuanced',
// 		type: 'event',
// 	},
// 	{
// 		anonymous: false,
// 		inputs: [
// 			{
// 				indexed: false,
// 				internalType: 'bytes32',
// 				name: 'messageId',
// 				type: 'bytes32',
// 			},
// 		],
// 		name: 'MessageSent',
// 		type: 'event',
// 	},
// 	{
// 		anonymous: false,
// 		inputs: [
// 			{
// 				indexed: true,
// 				internalType: 'address',
// 				name: 'previousOwner',
// 				type: 'address',
// 			},
// 			{
// 				indexed: true,
// 				internalType: 'address',
// 				name: 'newOwner',
// 				type: 'address',
// 			},
// 		],
// 		name: 'OwnershipTransferred',
// 		type: 'event',
// 	},
// 	{
// 		anonymous: false,
// 		inputs: [
// 			{
// 				indexed: true,
// 				internalType: 'address',
// 				name: 'user',
// 				type: 'address',
// 			},
// 			{
// 				indexed: true,
// 				internalType: 'address',
// 				name: 'outputToken',
// 				type: 'address',
// 			},
// 			{
// 				indexed: false,
// 				internalType: 'uint256',
// 				name: 'inputAmount',
// 				type: 'uint256',
// 			},
// 			{
// 				indexed: false,
// 				internalType: 'uint256',
// 				name: 'outputAmount',
// 				type: 'uint256',
// 			},
// 			{
// 				indexed: false,
// 				internalType: 'uint256',
// 				name: 'time',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'Redemption',
// 		type: 'event',
// 	},
// 	{
// 		inputs: [],
// 		name: 'askValues',
// 		outputs: [],
// 		stateMutability: 'nonpayable',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				components: [
// 					{
// 						internalType: 'bytes32',
// 						name: 'messageId',
// 						type: 'bytes32',
// 					},
// 					{
// 						internalType: 'uint64',
// 						name: 'sourceChainSelector',
// 						type: 'uint64',
// 					},
// 					{
// 						internalType: 'bytes',
// 						name: 'sender',
// 						type: 'bytes',
// 					},
// 					{
// 						internalType: 'bytes',
// 						name: 'data',
// 						type: 'bytes',
// 					},
// 					{
// 						components: [
// 							{
// 								internalType: 'address',
// 								name: 'token',
// 								type: 'address',
// 							},
// 							{
// 								internalType: 'uint256',
// 								name: 'amount',
// 								type: 'uint256',
// 							},
// 						],
// 						internalType: 'struct Client.EVMTokenAmount[]',
// 						name: 'destTokenAmounts',
// 						type: 'tuple[]',
// 					},
// 				],
// 				internalType: 'struct Client.Any2EVMMessage',
// 				name: 'message',
// 				type: 'tuple',
// 			},
// 		],
// 		name: 'ccipReceive',
// 		outputs: [],
// 		stateMutability: 'nonpayable',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint64',
// 				name: '',
// 				type: 'uint64',
// 			},
// 		],
// 		name: 'crossChainFactoryBySelector',
// 		outputs: [
// 			{
// 				internalType: 'address',
// 				name: '',
// 				type: 'address',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint64',
// 				name: '',
// 				type: 'uint64',
// 			},
// 		],
// 		name: 'crossChainToken',
// 		outputs: [
// 			{
// 				internalType: 'address',
// 				name: '',
// 				type: 'address',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'currentChainSelector',
// 		outputs: [
// 			{
// 				internalType: 'uint64',
// 				name: '',
// 				type: 'uint64',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '_index',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'currentList',
// 		outputs: [
// 			{
// 				internalType: 'address',
// 				name: '',
// 				type: 'address',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'address',
// 				name: 'tokenIn',
// 				type: 'address',
// 			},
// 			{
// 				internalType: 'address',
// 				name: 'tokenOut',
// 				type: 'address',
// 			},
// 			{
// 				internalType: 'uint128',
// 				name: 'amountIn',
// 				type: 'uint128',
// 			},
// 			{
// 				internalType: 'uint32',
// 				name: 'secondsAgo',
// 				type: 'uint32',
// 			},
// 		],
// 		name: 'estimateAmountOut',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: 'amountOut',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'feeRate',
// 		outputs: [
// 			{
// 				internalType: 'uint8',
// 				name: '',
// 				type: 'uint8',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'firstReweightAction',
// 		outputs: [],
// 		stateMutability: 'nonpayable',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'address',
// 				name: 'tokenIn',
// 				type: 'address',
// 			},
// 			{
// 				internalType: 'address',
// 				name: 'tokenOut',
// 				type: 'address',
// 			},
// 			{
// 				internalType: 'uint256',
// 				name: 'amountIn',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'uint256',
// 				name: '_swapVersion',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'getAmountOut',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: 'finalAmountOut',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'getPortfolioBalance',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'getRouter',
// 		outputs: [
// 			{
// 				internalType: 'address',
// 				name: '',
// 				type: 'address',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'i_link',
// 		outputs: [
// 			{
// 				internalType: 'address',
// 				name: '',
// 				type: 'address',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'i_maxTokensLength',
// 		outputs: [
// 			{
// 				internalType: 'uint16',
// 				name: '',
// 				type: 'uint16',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'indexFactoryStorage',
// 		outputs: [
// 			{
// 				internalType: 'contract IndexFactoryStorage',
// 				name: '',
// 				type: 'address',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'indexToken',
// 		outputs: [
// 			{
// 				internalType: 'contract IndexToken',
// 				name: '',
// 				type: 'address',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint64',
// 				name: '_currentChainSelector',
// 				type: 'uint64',
// 			},
// 			{
// 				internalType: 'address payable',
// 				name: '_token',
// 				type: 'address',
// 			},
// 			{
// 				internalType: 'address',
// 				name: '_chainlinkToken',
// 				type: 'address',
// 			},
// 			{
// 				internalType: 'address',
// 				name: '_router',
// 				type: 'address',
// 			},
// 			{
// 				internalType: 'address',
// 				name: '_weth',
// 				type: 'address',
// 			},
// 		],
// 		name: 'initialize',
// 		outputs: [],
// 		stateMutability: 'nonpayable',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'uint64',
// 				name: '',
// 				type: 'uint64',
// 			},
// 		],
// 		name: 'issuanceChainSelectorFilled',
// 		outputs: [
// 			{
// 				internalType: 'bool',
// 				name: '',
// 				type: 'bool',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'uint64',
// 				name: '',
// 				type: 'uint64',
// 			},
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'issuanceChainSelectorSharesByNonce',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'uint64',
// 				name: '',
// 				type: 'uint64',
// 			},
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'issuanceChainSelectorTokensByNonce',
// 		outputs: [
// 			{
// 				internalType: 'address',
// 				name: '',
// 				type: 'address',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'uint64',
// 				name: '',
// 				type: 'uint64',
// 			},
// 		],
// 		name: 'issuanceChainSelectorTotalSharesByNonce',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'issuanceChainSelectors',
// 		outputs: [
// 			{
// 				internalType: 'uint64',
// 				name: '',
// 				type: 'uint64',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'issuanceCompletedTokensCount',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'address',
// 				name: '_tokenIn',
// 				type: 'address',
// 			},
// 			{
// 				internalType: 'uint256',
// 				name: '_inputAmount',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'uint256',
// 				name: '_crossChainFee',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'uint256',
// 				name: '_tokenInSwapVersion',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'issuanceIndexTokens',
// 		outputs: [],
// 		stateMutability: 'payable',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '_inputAmount',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'uint256',
// 				name: '_crossChainFee',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'issuanceIndexTokensWithEth',
// 		outputs: [],
// 		stateMutability: 'payable',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'issuanceNonce',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'issuanceNonceRequester',
// 		outputs: [
// 			{
// 				internalType: 'address',
// 				name: '',
// 				type: 'address',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'address',
// 				name: '',
// 				type: 'address',
// 			},
// 		],
// 		name: 'issuanceTokenOldAndNewValues',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: 'oldTokenValue',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'uint256',
// 				name: 'newTokenValue',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'latestFeeUpdate',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'owner',
// 		outputs: [
// 			{
// 				internalType: 'address',
// 				name: '',
// 				type: 'address',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'portfolioTotalValueByNonce',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'priceInWei',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'address',
// 				name: '_proposedOwner',
// 				type: 'address',
// 			},
// 		],
// 		name: 'proposeOwner',
// 		outputs: [],
// 		stateMutability: 'nonpayable',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'proposedOwner',
// 		outputs: [
// 			{
// 				internalType: 'address',
// 				name: '',
// 				type: 'address',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: 'amountIn',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'uint256',
// 				name: '_crossChainFee',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'address',
// 				name: '_tokenOut',
// 				type: 'address',
// 			},
// 			{
// 				internalType: 'uint256',
// 				name: '_tokenOutSwapVersion',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'redemption',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'payable',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'uint64',
// 				name: '',
// 				type: 'uint64',
// 			},
// 		],
// 		name: 'redemptionChainSelectorFilled',
// 		outputs: [
// 			{
// 				internalType: 'bool',
// 				name: '',
// 				type: 'bool',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'uint64',
// 				name: '',
// 				type: 'uint64',
// 			},
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'redemptionChainSelectorSharesByNonce',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'uint64',
// 				name: '',
// 				type: 'uint64',
// 			},
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'redemptionChainSelectorTokensByNonce',
// 		outputs: [
// 			{
// 				internalType: 'address',
// 				name: '',
// 				type: 'address',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'uint64',
// 				name: '',
// 				type: 'uint64',
// 			},
// 		],
// 		name: 'redemptionChainSelectorTotalSharesByNonce',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'redemptionChainSelectors',
// 		outputs: [
// 			{
// 				internalType: 'uint64',
// 				name: '',
// 				type: 'uint64',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'redemptionCompletedTokensCount',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'redemptionNonce',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'redemptionNonceOutputToken',
// 		outputs: [
// 			{
// 				internalType: 'address',
// 				name: '',
// 				type: 'address',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'redemptionNonceOutputTokenSwapVersion',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'redemptionNonceRequester',
// 		outputs: [
// 			{
// 				internalType: 'address',
// 				name: '',
// 				type: 'address',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'redemptionNonceTotalValue',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'renounceOwnership',
// 		outputs: [],
// 		stateMutability: 'nonpayable',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'reweightTokensCount',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'reweightWethValueByNonce',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'secondReweightAction',
// 		outputs: [],
// 		stateMutability: 'nonpayable',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint64',
// 				name: 'destinationChainSelector',
// 				type: 'uint64',
// 			},
// 			{
// 				internalType: 'address',
// 				name: 'receiver',
// 				type: 'address',
// 			},
// 			{
// 				internalType: 'bytes',
// 				name: '_data',
// 				type: 'bytes',
// 			},
// 			{
// 				internalType: 'enum IndexFactory.PayFeesIn',
// 				name: 'payFeesIn',
// 				type: 'uint8',
// 			},
// 		],
// 		name: 'sendMessage',
// 		outputs: [],
// 		stateMutability: 'nonpayable',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'address',
// 				name: '_crossChainFactoryAddress',
// 				type: 'address',
// 			},
// 			{
// 				internalType: 'uint64',
// 				name: '_chainSelector',
// 				type: 'uint64',
// 			},
// 		],
// 		name: 'setCrossChainFactory',
// 		outputs: [],
// 		stateMutability: 'nonpayable',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint64',
// 				name: '_chainSelector',
// 				type: 'uint64',
// 			},
// 			{
// 				internalType: 'address',
// 				name: '_crossChainToken',
// 				type: 'address',
// 			},
// 		],
// 		name: 'setCrossChainToken',
// 		outputs: [],
// 		stateMutability: 'nonpayable',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint8',
// 				name: '_newFee',
// 				type: 'uint8',
// 			},
// 		],
// 		name: 'setFeeRate',
// 		outputs: [],
// 		stateMutability: 'nonpayable',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'address',
// 				name: '_indexFactoryStorage',
// 				type: 'address',
// 			},
// 		],
// 		name: 'setIndexFactoryStorage',
// 		outputs: [],
// 		stateMutability: 'nonpayable',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'bytes4',
// 				name: 'interfaceId',
// 				type: 'bytes4',
// 			},
// 		],
// 		name: 'supportsInterface',
// 		outputs: [
// 			{
// 				internalType: 'bool',
// 				name: '',
// 				type: 'bool',
// 			},
// 		],
// 		stateMutability: 'pure',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'address',
// 				name: 'tokenIn',
// 				type: 'address',
// 			},
// 			{
// 				internalType: 'address',
// 				name: 'tokenOut',
// 				type: 'address',
// 			},
// 			{
// 				internalType: 'uint256',
// 				name: 'amountIn',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'address',
// 				name: '_recipient',
// 				type: 'address',
// 			},
// 			{
// 				internalType: 'uint256',
// 				name: '_swapVersion',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'swap',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'nonpayable',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'address',
// 				name: '_address',
// 				type: 'address',
// 			},
// 		],
// 		name: 'tokenChainSelector',
// 		outputs: [
// 			{
// 				internalType: 'uint64',
// 				name: '',
// 				type: 'uint64',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'address',
// 				name: '_address',
// 				type: 'address',
// 			},
// 		],
// 		name: 'tokenCurrentMarketShare',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'address',
// 				name: '_address',
// 				type: 'address',
// 			},
// 		],
// 		name: 'tokenOracleMarketShare',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'address',
// 				name: '_address',
// 				type: 'address',
// 			},
// 		],
// 		name: 'tokenSwapVersion',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 			{
// 				internalType: 'address',
// 				name: '',
// 				type: 'address',
// 			},
// 		],
// 		name: 'tokenValueByNonce',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'totalCurrentList',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'address',
// 				name: 'newOwner',
// 				type: 'address',
// 			},
// 		],
// 		name: 'transferOwnership',
// 		outputs: [],
// 		stateMutability: 'nonpayable',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'updatePortfolioNonce',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		name: 'updatedTokensValueCount',
// 		outputs: [
// 			{
// 				internalType: 'uint256',
// 				name: '',
// 				type: 'uint256',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		inputs: [],
// 		name: 'weth',
// 		outputs: [
// 			{
// 				internalType: 'contract IWETH',
// 				name: '',
// 				type: 'address',
// 			},
// 		],
// 		stateMutability: 'view',
// 		type: 'function',
// 	},
// 	{
// 		stateMutability: 'payable',
// 		type: 'receive',
// 	},
// ]

export const uniswapV3PoolContractAbi = [
	{
		inputs: [],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'int24',
				name: 'tickLower',
				type: 'int24',
			},
			{
				indexed: true,
				internalType: 'int24',
				name: 'tickUpper',
				type: 'int24',
			},
			{
				indexed: false,
				internalType: 'uint128',
				name: 'amount',
				type: 'uint128',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount0',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount1',
				type: 'uint256',
			},
		],
		name: 'Burn',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'int24',
				name: 'tickLower',
				type: 'int24',
			},
			{
				indexed: true,
				internalType: 'int24',
				name: 'tickUpper',
				type: 'int24',
			},
			{
				indexed: false,
				internalType: 'uint128',
				name: 'amount0',
				type: 'uint128',
			},
			{
				indexed: false,
				internalType: 'uint128',
				name: 'amount1',
				type: 'uint128',
			},
		],
		name: 'Collect',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint128',
				name: 'amount0',
				type: 'uint128',
			},
			{
				indexed: false,
				internalType: 'uint128',
				name: 'amount1',
				type: 'uint128',
			},
		],
		name: 'CollectProtocol',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount0',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount1',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'paid0',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'paid1',
				type: 'uint256',
			},
		],
		name: 'Flash',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint16',
				name: 'observationCardinalityNextOld',
				type: 'uint16',
			},
			{
				indexed: false,
				internalType: 'uint16',
				name: 'observationCardinalityNextNew',
				type: 'uint16',
			},
		],
		name: 'IncreaseObservationCardinalityNext',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint160',
				name: 'sqrtPriceX96',
				type: 'uint160',
			},
			{
				indexed: false,
				internalType: 'int24',
				name: 'tick',
				type: 'int24',
			},
		],
		name: 'Initialize',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'int24',
				name: 'tickLower',
				type: 'int24',
			},
			{
				indexed: true,
				internalType: 'int24',
				name: 'tickUpper',
				type: 'int24',
			},
			{
				indexed: false,
				internalType: 'uint128',
				name: 'amount',
				type: 'uint128',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount0',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount1',
				type: 'uint256',
			},
		],
		name: 'Mint',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint8',
				name: 'feeProtocol0Old',
				type: 'uint8',
			},
			{
				indexed: false,
				internalType: 'uint8',
				name: 'feeProtocol1Old',
				type: 'uint8',
			},
			{
				indexed: false,
				internalType: 'uint8',
				name: 'feeProtocol0New',
				type: 'uint8',
			},
			{
				indexed: false,
				internalType: 'uint8',
				name: 'feeProtocol1New',
				type: 'uint8',
			},
		],
		name: 'SetFeeProtocol',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'int256',
				name: 'amount0',
				type: 'int256',
			},
			{
				indexed: false,
				internalType: 'int256',
				name: 'amount1',
				type: 'int256',
			},
			{
				indexed: false,
				internalType: 'uint160',
				name: 'sqrtPriceX96',
				type: 'uint160',
			},
			{
				indexed: false,
				internalType: 'uint128',
				name: 'liquidity',
				type: 'uint128',
			},
			{
				indexed: false,
				internalType: 'int24',
				name: 'tick',
				type: 'int24',
			},
		],
		name: 'Swap',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'int24',
				name: 'tickLower',
				type: 'int24',
			},
			{
				internalType: 'int24',
				name: 'tickUpper',
				type: 'int24',
			},
			{
				internalType: 'uint128',
				name: 'amount',
				type: 'uint128',
			},
		],
		name: 'burn',
		outputs: [
			{
				internalType: 'uint256',
				name: 'amount0',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'amount1',
				type: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				internalType: 'int24',
				name: 'tickLower',
				type: 'int24',
			},
			{
				internalType: 'int24',
				name: 'tickUpper',
				type: 'int24',
			},
			{
				internalType: 'uint128',
				name: 'amount0Requested',
				type: 'uint128',
			},
			{
				internalType: 'uint128',
				name: 'amount1Requested',
				type: 'uint128',
			},
		],
		name: 'collect',
		outputs: [
			{
				internalType: 'uint128',
				name: 'amount0',
				type: 'uint128',
			},
			{
				internalType: 'uint128',
				name: 'amount1',
				type: 'uint128',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				internalType: 'uint128',
				name: 'amount0Requested',
				type: 'uint128',
			},
			{
				internalType: 'uint128',
				name: 'amount1Requested',
				type: 'uint128',
			},
		],
		name: 'collectProtocol',
		outputs: [
			{
				internalType: 'uint128',
				name: 'amount0',
				type: 'uint128',
			},
			{
				internalType: 'uint128',
				name: 'amount1',
				type: 'uint128',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'factory',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'fee',
		outputs: [
			{
				internalType: 'uint24',
				name: '',
				type: 'uint24',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'feeGrowthGlobal0X128',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'feeGrowthGlobal1X128',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount0',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'amount1',
				type: 'uint256',
			},
			{
				internalType: 'bytes',
				name: 'data',
				type: 'bytes',
			},
		],
		name: 'flash',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint16',
				name: 'observationCardinalityNext',
				type: 'uint16',
			},
		],
		name: 'increaseObservationCardinalityNext',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint160',
				name: 'sqrtPriceX96',
				type: 'uint160',
			},
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'liquidity',
		outputs: [
			{
				internalType: 'uint128',
				name: '',
				type: 'uint128',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'maxLiquidityPerTick',
		outputs: [
			{
				internalType: 'uint128',
				name: '',
				type: 'uint128',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				internalType: 'int24',
				name: 'tickLower',
				type: 'int24',
			},
			{
				internalType: 'int24',
				name: 'tickUpper',
				type: 'int24',
			},
			{
				internalType: 'uint128',
				name: 'amount',
				type: 'uint128',
			},
			{
				internalType: 'bytes',
				name: 'data',
				type: 'bytes',
			},
		],
		name: 'mint',
		outputs: [
			{
				internalType: 'uint256',
				name: 'amount0',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'amount1',
				type: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 'observations',
		outputs: [
			{
				internalType: 'uint32',
				name: 'blockTimestamp',
				type: 'uint32',
			},
			{
				internalType: 'int56',
				name: 'tickCumulative',
				type: 'int56',
			},
			{
				internalType: 'uint160',
				name: 'secondsPerLiquidityCumulativeX128',
				type: 'uint160',
			},
			{
				internalType: 'bool',
				name: 'initialized',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint32[]',
				name: 'secondsAgos',
				type: 'uint32[]',
			},
		],
		name: 'observe',
		outputs: [
			{
				internalType: 'int56[]',
				name: 'tickCumulatives',
				type: 'int56[]',
			},
			{
				internalType: 'uint160[]',
				name: 'secondsPerLiquidityCumulativeX128s',
				type: 'uint160[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		name: 'positions',
		outputs: [
			{
				internalType: 'uint128',
				name: 'liquidity',
				type: 'uint128',
			},
			{
				internalType: 'uint256',
				name: 'feeGrowthInside0LastX128',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'feeGrowthInside1LastX128',
				type: 'uint256',
			},
			{
				internalType: 'uint128',
				name: 'tokensOwed0',
				type: 'uint128',
			},
			{
				internalType: 'uint128',
				name: 'tokensOwed1',
				type: 'uint128',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'protocolFees',
		outputs: [
			{
				internalType: 'uint128',
				name: 'token0',
				type: 'uint128',
			},
			{
				internalType: 'uint128',
				name: 'token1',
				type: 'uint128',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint8',
				name: 'feeProtocol0',
				type: 'uint8',
			},
			{
				internalType: 'uint8',
				name: 'feeProtocol1',
				type: 'uint8',
			},
		],
		name: 'setFeeProtocol',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'slot0',
		outputs: [
			{
				internalType: 'uint160',
				name: 'sqrtPriceX96',
				type: 'uint160',
			},
			{
				internalType: 'int24',
				name: 'tick',
				type: 'int24',
			},
			{
				internalType: 'uint16',
				name: 'observationIndex',
				type: 'uint16',
			},
			{
				internalType: 'uint16',
				name: 'observationCardinality',
				type: 'uint16',
			},
			{
				internalType: 'uint16',
				name: 'observationCardinalityNext',
				type: 'uint16',
			},
			{
				internalType: 'uint8',
				name: 'feeProtocol',
				type: 'uint8',
			},
			{
				internalType: 'bool',
				name: 'unlocked',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'int24',
				name: 'tickLower',
				type: 'int24',
			},
			{
				internalType: 'int24',
				name: 'tickUpper',
				type: 'int24',
			},
		],
		name: 'snapshotCumulativesInside',
		outputs: [
			{
				internalType: 'int56',
				name: 'tickCumulativeInside',
				type: 'int56',
			},
			{
				internalType: 'uint160',
				name: 'secondsPerLiquidityInsideX128',
				type: 'uint160',
			},
			{
				internalType: 'uint32',
				name: 'secondsInside',
				type: 'uint32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'recipient',
				type: 'address',
			},
			{
				internalType: 'bool',
				name: 'zeroForOne',
				type: 'bool',
			},
			{
				internalType: 'int256',
				name: 'amountSpecified',
				type: 'int256',
			},
			{
				internalType: 'uint160',
				name: 'sqrtPriceLimitX96',
				type: 'uint160',
			},
			{
				internalType: 'bytes',
				name: 'data',
				type: 'bytes',
			},
		],
		name: 'swap',
		outputs: [
			{
				internalType: 'int256',
				name: 'amount0',
				type: 'int256',
			},
			{
				internalType: 'int256',
				name: 'amount1',
				type: 'int256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'int16',
				name: '',
				type: 'int16',
			},
		],
		name: 'tickBitmap',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'tickSpacing',
		outputs: [
			{
				internalType: 'int24',
				name: '',
				type: 'int24',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'int24',
				name: '',
				type: 'int24',
			},
		],
		name: 'ticks',
		outputs: [
			{
				internalType: 'uint128',
				name: 'liquidityGross',
				type: 'uint128',
			},
			{
				internalType: 'int128',
				name: 'liquidityNet',
				type: 'int128',
			},
			{
				internalType: 'uint256',
				name: 'feeGrowthOutside0X128',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'feeGrowthOutside1X128',
				type: 'uint256',
			},
			{
				internalType: 'int56',
				name: 'tickCumulativeOutside',
				type: 'int56',
			},
			{
				internalType: 'uint160',
				name: 'secondsPerLiquidityOutsideX128',
				type: 'uint160',
			},
			{
				internalType: 'uint32',
				name: 'secondsOutside',
				type: 'uint32',
			},
			{
				internalType: 'bool',
				name: 'initialized',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'token0',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'token1',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
]

export const tokenFaucetAbi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'OwnershipTransferred',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_token',
				type: 'address',
			},
		],
		name: 'getToken',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_token',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '_amount',
				type: 'uint256',
			},
		],
		name: 'withdrawToken',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]

export const uniswapV3FactoryAbi = [
	{
		inputs: [],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint24',
				name: 'fee',
				type: 'uint24',
			},
			{
				indexed: true,
				internalType: 'int24',
				name: 'tickSpacing',
				type: 'int24',
			},
		],
		name: 'FeeAmountEnabled',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'oldOwner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'OwnerChanged',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'token0',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'token1',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'uint24',
				name: 'fee',
				type: 'uint24',
			},
			{
				indexed: false,
				internalType: 'int24',
				name: 'tickSpacing',
				type: 'int24',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'pool',
				type: 'address',
			},
		],
		name: 'PoolCreated',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'tokenA',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'tokenB',
				type: 'address',
			},
			{
				internalType: 'uint24',
				name: 'fee',
				type: 'uint24',
			},
		],
		name: 'createPool',
		outputs: [
			{
				internalType: 'address',
				name: 'pool',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint24',
				name: 'fee',
				type: 'uint24',
			},
			{
				internalType: 'int24',
				name: 'tickSpacing',
				type: 'int24',
			},
		],
		name: 'enableFeeAmount',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint24',
				name: '',
				type: 'uint24',
			},
		],
		name: 'feeAmountTickSpacing',
		outputs: [
			{
				internalType: 'int24',
				name: '',
				type: 'int24',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
			{
				internalType: 'uint24',
				name: '',
				type: 'uint24',
			},
		],
		name: 'getPool',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'parameters',
		outputs: [
			{
				internalType: 'address',
				name: 'factory',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'token0',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'token1',
				type: 'address',
			},
			{
				internalType: 'uint24',
				name: 'fee',
				type: 'uint24',
			},
			{
				internalType: 'int24',
				name: 'tickSpacing',
				type: 'int24',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_owner',
				type: 'address',
			},
		],
		name: 'setOwner',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]

export const crossChainFactoryStorageAbi = [
    {
      "inputs": [],
      "name": "T",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        }
      ],
      "name": "ChainlinkCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        }
      ],
      "name": "ChainlinkFulfilled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "id",
          "type": "bytes32"
        }
      ],
      "name": "ChainlinkRequested",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "version",
          "type": "uint8"
        }
      ],
      "name": "Initialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_chainSelector",
          "type": "uint64"
        }
      ],
      "name": "allCurrentChainSelectorTokenShares",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_chainSelector",
          "type": "uint64"
        }
      ],
      "name": "allCurrentChainSelectorTokens",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "tokens",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_chainSelector",
          "type": "uint64"
        }
      ],
      "name": "allCurrentChainSelectorVersions",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "versions",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_chainSelector",
          "type": "uint64"
        }
      ],
      "name": "allOracleChainSelectorTokenShares",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_chainSelector",
          "type": "uint64"
        }
      ],
      "name": "allOracleChainSelectorTokens",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "tokens",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_chainSelector",
          "type": "uint64"
        }
      ],
      "name": "allOracleChainSelectorVersions",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "versions",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "a",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "b",
          "type": "string"
        }
      ],
      "name": "concatenation",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "name": "crossChainFactoryBySelector",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "name": "crossChainToken",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "crossChainTokenSwapVersion",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentChainSelector",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "currentChainSelectorTokenShares",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "currentChainSelectorTokens",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_chainSelector",
          "type": "uint64"
        }
      ],
      "name": "currentChainSelectorTokensCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "name": "currentChainSelectorTotalShares",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "currentChainSelectorVersions",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "currentChainSelectors",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentChainSelectorsCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentFilledCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "currentList",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenIn",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenOut",
          "type": "address"
        },
        {
          "internalType": "uint128",
          "name": "amountIn",
          "type": "uint128"
        },
        {
          "internalType": "uint32",
          "name": "secondsAgo",
          "type": "uint32"
        }
      ],
      "name": "estimateAmountOut",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "externalJobId",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "factoryV2",
      "outputs": [
        {
          "internalType": "contract IUniswapV2Factory",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "factoryV3",
      "outputs": [
        {
          "internalType": "contract IUniswapV3Factory",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "feeRate",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "requestId",
          "type": "bytes32"
        },
        {
          "internalType": "address[]",
          "name": "_tokens",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_marketShares",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_swapVersions",
          "type": "uint256[]"
        },
        {
          "internalType": "uint64[]",
          "name": "_chainSelectors",
          "type": "uint64[]"
        }
      ],
      "name": "fulfillAssetsData",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenIn",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenOut",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_swapVersion",
          "type": "uint256"
        }
      ],
      "name": "getAmountOut",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "finalAmountOut",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getPortfolioBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "indexFactory",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "indexFactoryBalancer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "indexToken",
      "outputs": [
        {
          "internalType": "contract IndexToken",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_currentChainSelector",
          "type": "uint64"
        },
        {
          "internalType": "address payable",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_chainlinkToken",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_oracleAddress",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "_externalJobId",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "_toUsdPriceFeed",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_weth",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_swapRouterV3",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_factoryV3",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_swapRouterV2",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_factoryV2",
          "type": "address"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "name": "isCurrentChainSelectorStored",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "name": "isOracleChainSelectorStored",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "lastUpdateTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "latestFeeUpdate",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_tokens",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_marketShares",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_swapVersions",
          "type": "uint256[]"
        },
        {
          "internalType": "uint64[]",
          "name": "_chainSelectors",
          "type": "uint64[]"
        }
      ],
      "name": "mockFillAssetsList",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "mockUpdateCurrentList",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "oracleChainSelectorTokenShares",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "oracleChainSelectorTokens",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_chainSelector",
          "type": "uint64"
        }
      ],
      "name": "oracleChainSelectorTokensCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "name": "oracleChainSelectorTotalShares",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "oracleChainSelectorVersions",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "oracleChainSelectors",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "oracleChainSelectorsCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "oracleFilledCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "oracleList",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "oraclePayment",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "priceInWei",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_proposedOwner",
          "type": "address"
        }
      ],
      "name": "proposeOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "proposedOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "quoter",
      "outputs": [
        {
          "internalType": "contract IQuoter",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "requestAssetsData",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_crossChainFactoryAddress",
          "type": "address"
        },
        {
          "internalType": "uint64",
          "name": "_chainSelector",
          "type": "uint64"
        }
      ],
      "name": "setCrossChainFactory",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_chainSelector",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "_crossChainToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_swapVersion",
          "type": "uint256"
        }
      ],
      "name": "setCrossChainToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_indexFactory",
          "type": "address"
        }
      ],
      "name": "setIndexFactory",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_indexFactoryBalancer",
          "type": "address"
        }
      ],
      "name": "setIndexFactoryBalancer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_toUsdPricefeed",
          "type": "address"
        }
      ],
      "name": "setPriceFeed",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_beforeAddress",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_afterAddress",
          "type": "string"
        }
      ],
      "name": "setUrl",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenIn",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenOut",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_swapVersion",
          "type": "uint256"
        }
      ],
      "name": "swap",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "swapRouterV2",
      "outputs": [
        {
          "internalType": "contract IUniswapV2Router02",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "swapRouterV3",
      "outputs": [
        {
          "internalType": "contract ISwapRouter",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "toUsdPriceFeed",
      "outputs": [
        {
          "internalType": "contract AggregatorV3Interface",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "tokenChainSelector",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "tokenCurrentListIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "tokenCurrentMarketShare",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "tokenOracleListIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "tokenOracleMarketShare",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "tokenSwapVersion",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalCurrentChainSelectors",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalCurrentList",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalOracleChainSelectors",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalOracleList",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "updateCurrentList",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "weth",
      "outputs": [
        {
          "internalType": "contract IWETH",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

export const stockFactoryABI = [
    {
      "inputs": [],
      "name": "EnforcedPause",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ExpectedPause",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidInitialization",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotInitializing",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "x",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "y",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "denominator",
          "type": "uint256"
        }
      ],
      "name": "PRBMath_MulDiv_Overflow",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "version",
          "type": "uint64"
        }
      ],
      "name": "Initialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "nonce",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "inputToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "inputAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "outputAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "time",
          "type": "uint256"
        }
      ],
      "name": "Issuanced",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "nonce",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "outputToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "inputAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "outputAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "time",
          "type": "uint256"
        }
      ],
      "name": "Redemption",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "nonce",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "inputToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "inputAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "outputAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "time",
          "type": "uint256"
        }
      ],
      "name": "RequestIssuance",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "nonce",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "outputToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "inputAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "outputAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "time",
          "type": "uint256"
        }
      ],
      "name": "RequestRedemption",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "actionInfoById",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "actionType",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "nonce",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "burnedTokenAmountByNonce",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "buyRequestPayedAmountById",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "calculateBuyRequestFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_inputAmount",
          "type": "uint256"
        }
      ],
      "name": "calculateIssuanceFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_issuanceNonce",
          "type": "uint256"
        }
      ],
      "name": "cancelIssuance",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "cancelIssuanceComplted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "cancelIssuanceRequestId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_redemptionNonce",
          "type": "uint256"
        }
      ],
      "name": "cancelRedemption",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "cancelRedemptionComplted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "cancelRedemptionRequestId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_reqeustId",
          "type": "uint256"
        }
      ],
      "name": "checkMultical",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "coaByIssuanceNonce",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "coaByRedemptionNonce",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_issuanceNonce",
          "type": "uint256"
        }
      ],
      "name": "completeCancelIssuance",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_redemptionNonce",
          "type": "uint256"
        }
      ],
      "name": "completeCancelRedemption",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_issuanceNonce",
          "type": "uint256"
        }
      ],
      "name": "completeIssuance",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_redemptionNonce",
          "type": "uint256"
        }
      ],
      "name": "completeRedemption",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "factoryStorage",
      "outputs": [
        {
          "internalType": "contract IndexFactoryStorage",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "feeRate",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_requestId",
          "type": "uint256"
        }
      ],
      "name": "getActionType",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "getIssuanceAmountOut",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "getOrderInstanceById",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint64",
              "name": "requestTimestamp",
              "type": "uint64"
            },
            {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "assetToken",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "paymentToken",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "sell",
              "type": "bool"
            },
            {
              "internalType": "enum IOrderProcessor.OrderType",
              "name": "orderType",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "assetTokenQuantity",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "paymentTokenQuantity",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "enum IOrderProcessor.TIF",
              "name": "tif",
              "type": "uint8"
            }
          ],
          "internalType": "struct IOrderProcessor.Order",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getPortfolioValue",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "getRedemptionAmountOut",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        }
      ],
      "name": "getVaultDshareBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        }
      ],
      "name": "getVaultDshareValue",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_factoryStorage",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_orderManager",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_issuer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_vault",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_usdc",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "_usdcDecimals",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "_isMainnet",
          "type": "bool"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isMainnet",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "issuanceIndexTokenPrimaryTotalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_inputAmount",
          "type": "uint256"
        }
      ],
      "name": "issuanceIndexTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "issuanceInputAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "issuanceIsCompleted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "issuanceNonce",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "issuanceRequestId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "issuanceRequesterByNonce",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "issuanceTokenPrimaryBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "issuer",
      "outputs": [
        {
          "internalType": "contract IOrderProcessor",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "latestFeeUpdate",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_issuanceNonce",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_mintAmount",
          "type": "uint256"
        }
      ],
      "name": "mockCompleteIssuance",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_redemptionNonce",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "mockCompleteRedemption",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_requestId",
          "type": "uint256"
        }
      ],
      "name": "multical",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "orderInstanceById",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "requestTimestamp",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "assetToken",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "paymentToken",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "sell",
          "type": "bool"
        },
        {
          "internalType": "enum IOrderProcessor.OrderType",
          "name": "orderType",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "assetTokenQuantity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "paymentTokenQuantity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "enum IOrderProcessor.TIF",
          "name": "tif",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "orderManager",
      "outputs": [
        {
          "internalType": "contract OrderManager",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "portfolioValueByNonce",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        }
      ],
      "name": "priceInWei",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_inputAmount",
          "type": "uint256"
        }
      ],
      "name": "redemption",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "redemptionIndexTokenPrimaryTotalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "redemptionInputAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "redemptionIsCompleted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "redemptionNonce",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "redemptionRequestId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "redemptionRequesterByNonce",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "redemptionTokenPrimaryBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "sellRequestAssetAmountById",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_newFee",
          "type": "uint8"
        }
      ],
      "name": "setFeeRate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_factoryStorage",
          "type": "address"
        }
      ],
      "name": "setIndexFactoryStorage",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_issuer",
          "type": "address"
        }
      ],
      "name": "setIssuer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        }
      ],
      "name": "setTokenAddress",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_usdc",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "_usdcDecimals",
          "type": "uint8"
        }
      ],
      "name": "setUsdcAddress",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "token",
      "outputs": [
        {
          "internalType": "contract IndexToken",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "tokenShortagePercentByNonce",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "tokenValueByNonce",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "totalShortagePercentByNonce",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "usdc",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "usdcDecimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "vault",
      "outputs": [
        {
          "internalType": "contract NexVault",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]