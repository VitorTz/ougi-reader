import { StyleSheet, Text, SafeAreaView, View } from 'react-native'
import TopBar from '@/components/TopBar'
import ReturnButton from '@/components/ReturnButton'
import { debounce } from 'lodash'
import { wp } from '@/helpers/util'
import { AppStyle } from '@/style/AppStyles'
import ManhwaGrid from '@/components/ManhwaGrid'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Manhwa } from '@/models/Manhwa'
import { fetchMostViewedManhwas } from '@/lib/supabase'
import { AppConstants } from '@/constants/AppConstants'


var page = 0

const MostViewPage = () => {
    
    const [starting, setStarting] = useState(true)
    const [loading, setLoading] = useState(false)
    const [hasResults, setHasResults] = useState(true)
    const [manhwas, setManhwas] = useState<Manhwa[]>([])

    const init = async () => {
        page = 0
        await fetchMostViewedManhwas(0, AppConstants.MANHWAS_PER_PAGE, 3)
            .then(values => setManhwas([...values]))        
        setStarting(false)
    }

    const updateManhwas = async () => {
        if (!hasResults) { return }
        setLoading(true)
        page += 1
        console.log(page * AppConstants.MANHWAS_PER_PAGE)
        await fetchMostViewedManhwas(page * AppConstants.MANHWAS_PER_PAGE, AppConstants.MANHWAS_PER_PAGE, 3)
            .then(values => {
                setHasResults(values.length > 0)
                setManhwas(prev => [...prev, ...values])}
            )
        setLoading(false)
    }

    const debounceUpdate = useCallback(
        debounce(updateManhwas, 400),
        []
    )

    useEffect(useCallback(() => {
        init()
    }, []), [])

    return (
        <SafeAreaView style={AppStyle.safeArea}>
            <TopBar title="Most View ⚡">
                <ReturnButton/>
            </TopBar>
            {
                !starting &&
                <ManhwaGrid 
                    manhwas={manhwas} 
                    gap={10} 
                    paddingHorizontal={wp(5)} 
                    onEndReached={debounceUpdate} 
                    loading={loading}
                    hasResults={hasResults}
                    />
            }
        </SafeAreaView>
    )
}

export default MostViewPage

const styles = StyleSheet.create({})