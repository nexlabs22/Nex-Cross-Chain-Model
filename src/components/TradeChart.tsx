import { useRouter } from 'next/router'

// Components :
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import TradingViewChart from '@/components/TradingViewChart'
import { Shimmer } from 'react-shimmer'

// Store
import { useLandingPageStore } from '@/store/store'
import { useEffect, useRef, useState } from 'react'

// Icons and logos :


const TradeChartBox = () => {
	const router = useRouter()	
	const { index: selectedTradingProduct } = router.query
	const { mode } = useLandingPageStore()

	const parentRef = useRef(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
	useEffect(() => {
	  const handleResize = (entries:any) => {
		if (!entries || entries.length === 0) return;
		const entry = entries[0];
		setDimensions({
		  width: entry.contentRect.width,
		  height: entry.contentRect.height
		});
	  };
  
	  const resizeObserver = new ResizeObserver(handleResize);
	  if (parentRef.current) {
		resizeObserver.observe(parentRef.current);
	  }
  
	  return () => {
		if (resizeObserver && parentRef.current) {
		  resizeObserver.unobserve(parentRef.current);
		}
	  };
	}, [parentRef]);
  
	if (selectedTradingProduct === undefined || selectedTradingProduct === 'undefined') {
	  return (
		<div ref={parentRef} className={`h-full w-full rounded-2xl border border-gray-300/50 ${mode === 'dark' ? 'bg-[#131722]' : 'bg-[#FFFFFF]'} shadow-md shadow-gray-300 ${mode == 'dark' ? 'invert' : ''}`}>
		  <Shimmer width={dimensions.width} height={dimensions.height} className='rounded-2xl'/>
		</div>
	  );
	}

	return (
		<>
			<section className="w-full">
				<div className={`h-full w-full p-3 rounded-2xl border border-gray-300/50 ${mode === 'dark' ? 'bg-[#131722]' : 'bg-[#FFFFFF]'} shadow-md shadow-gray-300`}>
					<div className="h-[70vh] w-full">
						<TradingViewChart selectedIndices={[]} index={selectedTradingProduct} page={'trade'} pwa={false} />
					</div>
				</div>
			</section>
		</>
	)
}

export default TradeChartBox
