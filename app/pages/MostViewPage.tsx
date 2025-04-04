import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useManhwaMostViewPagesState } from '@/helpers/store'
import { AppConstants } from '@/constants/AppConstants'
import { StyleSheet, SafeAreaView } from 'react-native'
import { fetchMostViewedManhwas } from '@/lib/supabase'
import ReturnButton from '@/components/ReturnButton'
import ManhwaGrid from '@/components/ManhwaGrid'
import { AppStyle } from '@/style/AppStyles'
import TopBar from '@/components/TopBar'
import { Manhwa } from '@/models/Manhwa'
import { debounce } from 'lodash'


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
                setManhwas(prev => [...prev, ...pages.get(pageNum)!])
            } else {
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
            <TopBar title="Most View">
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