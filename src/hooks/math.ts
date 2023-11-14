import { BigNumber } from 'alchemy-sdk'

export const num = (value: string | BigNumber | unknown) => Number(value) / 1e18

export function formatAsString(value: number): string {
	let result
	const checkValue = Math.abs(value)

	if (checkValue < 0.0001) result = checkValue.toString()
	else if (checkValue < 2) result = checkValue.toFixed(4)
	else if (checkValue <= 1000) result = checkValue.toFixed(2)
	else if (checkValue < 10_000) result = checkValue.toLocaleString('en-US')
	else if (checkValue < 1_000_000) result = (checkValue / 1000).toFixed(2) + 'K'
	else if (checkValue < 1_000_000_000) result = (checkValue / 1_000_000).toFixed(2) + 'Mil.'
	else if (checkValue < 1_000_000_000_000) result = (checkValue / 1_000_000_000).toFixed(2) + 'B.'
	else if (checkValue < 1_000_000_000_000_000) result = (checkValue / 1_000_000_000_000).toFixed(2) + 'T.'
	else result = checkValue.toExponential(2)
	return result
}

export function formatAsNumber(value: number): number {
	let result: number
	const checkValue = Math.abs(value)

	if (checkValue < 0.0001) result = checkValue
	else if (checkValue < 2) result = Number(checkValue.toFixed(4))
	else if (checkValue <= 1000) result = Number(checkValue.toFixed(2))
	else if (checkValue <= 10_000) result = Number(checkValue.toFixed(0))
	// else result = Number((checkValue / 1000).toFixed(0));
	else result = checkValue
	return result
}

export function formatAsPercent(value: number): string {
	return value.toFixed(2) + '%'
}

export function FormatToViewNumber({
	value,
	returnType = 'string',
}: {
	value: number
	returnType?: 'string' | 'number' | 'percent'
}) {
	if (!value || typeof value !== 'number') return returnType === 'percent' ? value + '%' : value

	switch (returnType) {
		case 'string':
			return formatAsString(value)
		case 'number':
			return formatAsNumber(value)
		case 'percent':
			return formatAsPercent(value)
		default:
			return value
	}
}
