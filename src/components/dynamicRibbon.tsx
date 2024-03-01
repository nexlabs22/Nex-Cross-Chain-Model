import { RibbonContainer, Ribbon } from "react-ribbons";
import dynamic from 'next/dynamic'
import { useLandingPageStore } from '@/store/store'

interface DynamicRibbonProps {
    children: React.ReactNode; // Specifies that children can be any React element or fragment
}

function DynamicRibbon({ children }: DynamicRibbonProps) {

    const {mode} = useLandingPageStore()

    return (
        <div className="w-fit h-fit" id="ribbonBox">
            <RibbonContainer>
                <Ribbon
                    side="left"
                    type="corner"
                    size="normal"
                    backgroundColor={mode == "dark" ? "#4992E2" : "#4992E2"}
                    color={mode == "dark" ? "#FFFFFF" : "#252525"}
                    fontFamily="inter"
                    withStripes={true}
                >
                    <span className="text-black Medium ">
                        <p className='interMedium text-base'>Soon</p>
                    </span>
                </Ribbon>
                {children}

            </RibbonContainer>
        </div>

    )
}

export default DynamicRibbon