import React from 'react'
import Identicon from 'identicon.js'
import Image from 'next/image'

interface AvatarProps {
	walletAddress: string
}

const GenericAvatar: React.FC<AvatarProps> = ({ walletAddress }) => {
	// Generate the identicon
	const identicon = new Identicon(walletAddress, {
		
		size: 64, // Adjust the size as needed
		background: [42, 42, 42, 255], // Background color
	})

	const identiconDataUrl = identicon.toString()

	return (
		<div className="w-40 lg:w-2/5 aspect-square bg-colorOne-500 rounded-full flex flex-col items-center justify-center">
			<Image src={`data:image/png;base64,${identiconDataUrl}`} width={20} height={20} className='w-full h-full rounded-full' alt="Identicon" />
		</div>
	)
}

export default GenericAvatar;
