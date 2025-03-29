import { StyleSheet, SafeAreaView, Text, View } from 'react-native'
import TopBar from '@/components/TopBar'
import { hp, wp } from '@/helpers/util'
import { Colors } from '@/constants/Colors'
import React, { useCallback, useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import ReturnButton from '@/components/ReturnButton'
import { Manhwa } from '@/models/Manhwa'
import { fetchManhwaByGenre } from '@/lib/supabase'
import ManhwaGrid from '@/components/ManhwaGrid'
import { AppStyle } from '@/style/AppStyles'

const ManhwaByGenre = () => {

    const [manhwas, setManhwas] = useState<Manhwa[]>([])
    const params = useLocalSearchParams()
    const genre: string = params.genre as any

    const init = async () => {
        await fetchManhwaByGenre(genre)
            .then(values => setManhwas([...values]))
    }

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
            <ManhwaGrid manhwas={manhwas} gap={10} paddingHorizontal={wp(5)} />
        </SafeAreaView>
    )
}

export default ManhwaByGenre

const styles = StyleSheet.create({})