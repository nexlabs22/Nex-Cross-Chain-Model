'use client'

import { Stack, Typography, Button } from "@mui/material"
import { useState } from "react"
import { LuList, LuLayoutGrid } from "react-icons/lu"
import theme from "@/theme/theme"
// project imports : 

import CatalogueIndicesTable from "@/components/ui/catalogue/catalogueTable"
import CatalogueGrid from "@/components/ui/catalogue/catalogueGrid"

const CatalogueView = () => {
    const [view, setView] = useState<'list' | 'grid'>('list')
    return (
        <>
            <Stack width={'100%'} direction={'row'} alignItems={'end'} justifyContent={'space-between'} sx={{
                marginBottom: 20
            }}>

                <Typography variant={'h4'}>Indices</Typography>
                <Stack direction={'row'}>
                    <Button variant={'contained'} onClick={() => setView('list')} sx={{
                        backgroundColor: view === 'list' ? theme.palette.elevations.elevation700.main : theme.palette.elevations.elevation900.main,
                        color: view === 'list' ? theme.palette.text.primary : theme.palette.text.secondary,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                    }}>
                        <LuList size={20} color={theme.palette.info.main} />
                    </Button>
                    <Button variant={'contained'} onClick={() => setView('grid')} sx={{
                        backgroundColor: view === 'grid' ? theme.palette.elevations.elevation700.main : theme.palette.elevations.elevation900.main,
                        color: view === 'grid' ? theme.palette.text.primary : theme.palette.text.secondary,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                    }}>
                        <LuLayoutGrid size={20} color={theme.palette.info.main} />
                    </Button>
                </Stack>
            </Stack>
            {view === 'list' ? <CatalogueIndicesTable /> : <CatalogueGrid />}
        </>
    )
}

export default CatalogueView
