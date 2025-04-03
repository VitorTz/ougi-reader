import { StyleSheet, SafeAreaView } from 'react-native'
import TopBar from '@/components/TopBar'
import ReturnButton from '@/components/ReturnButton'
import { debounce } from 'lodash'
import { AppStyle } from '@/style/AppStyles'
import ManhwaGrid from '@/components/ManhwaGrid'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Manhwa } from '@/models/Manhwa'
import { fetchMostViewedManhwas } from '@/lib/supabase'
import { AppConstants } from '@/constants/AppConstants'
import { useManhwaMostViewPagesState } from '@/helpers/store'


const MostViewPage = () => {
    
    const { pages, addPage } = useManhwaMostViewPagesState()    
    const [manhwas, setManhwas] = useState<Manhwa[]>([])
    const [loading, setLoading] = useState(false)    
    const [hasResults, setHasResults] = useState(true)
    const page = useRef(0)

    const update = async () => {
        const pageNum = page.current
        if (!hasResults) { return }
        setLoading(true)    
        if (pages.has(pageNum)) {
            console.log("cached page", pageNum)
            setManhwas(prev => [...prev, ...pages.get(pageNum)!])
        } else {
            console.log("new page", pageNum)
            await fetchMostViewedManhwas(
                pageNum * AppConstants.MANHWAS_PER_PAGE,
                AppConstants.MANHWAS_PER_PAGE,
                3
            ).then(values => {
                setHasResults(values.length > 0)
                addPage(pageNum, values)
                pageNum > 0 ?
                    setManhwas(prev => [...prev, ...values]) :
                    setManhwas([...values])
            })
        }
        page.current += 1
        setLoading(false)
    }

    
    const debounceUpdate = useCallback(
        debounce(update, 500),
        []
    )

    const init = async () => {
        await debounceUpdate()
    }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )

    return (
        <SafeAreaView style={AppStyle.safeArea}>
            <TopBar title="Most View ⚡">
                <ReturnButton/>
            </TopBar>
            <ManhwaGrid 
                manhwas={manhwas} 
                numColumns={2} 
                shouldShowChapterDate={false}
                loading={loading}
                hasResults={hasResults}
                onEndReached={debounceUpdate}
                />
        </SafeAreaView>        
    )
}

export default MostViewPage

const styles = StyleSheet.create({})