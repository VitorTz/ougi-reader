import { StyleSheet, SafeAreaView, Text, View } from 'react-native'
import TopBar from '@/components/TopBar'
import { hp, wp } from '@/helpers/util'
import { debounce } from 'lodash'
import { Colors } from '@/constants/Colors'
import React, { useCallback, useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import ReturnButton from '@/components/ReturnButton'
import { Manhwa } from '@/models/Manhwa'
import { fetchManhwaByGenre } from '@/lib/supabase'
import ManhwaGrid from '@/components/ManhwaGrid'
import { AppStyle } from '@/style/AppStyles'
import { AppConstants } from '@/constants/AppConstants'


var page = 0

const ManhwaByGenre = () => {

    const params = useLocalSearchParams()
    const genre: string = params.genre as any

    const [starting, setStarting] = useState(true)
    const [loading, setLoading] = useState(false)
    const [hasResults, setHasResults] = useState(true)
    const [manhwas, setManhwas] = useState<Manhwa[]>([])
    
    const init = async () => {
        page = 0
        await fetchManhwaByGenre(genre, 0, AppConstants.MANHWAS_PER_PAGE)
            .then(values => setManhwas([...values]))
        setStarting(false)
    }

    const updateManhwas = async () => {
        if (!hasResults) { return }
        setLoading(true)
        page += 1
        console.log(page * AppConstants.MANHWAS_PER_PAGE)
        await fetchManhwaByGenre(genre, page * AppConstants.MANHWAS_PER_PAGE, AppConstants.MANHWAS_PER_PAGE)
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

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )

    return (
        <SafeAreaView style={AppStyle.safeArea}>
            <TopBar title={genre}>
                <ReturnButton/>
            </TopBar>
            {
                !starting &&
                <ManhwaGrid 
                    manhwas={manhwas}
                    numColumns={2}                    
                    onEndReached={debounceUpdate} 
                    loading={loading}
                    hasResults={hasResults}
                    shouldShowChapterDate={false}/>
            }
        </SafeAreaView>
    )
}

export default ManhwaByGenre

const styles = StyleSheet.create({})