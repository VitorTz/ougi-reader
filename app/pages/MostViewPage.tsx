import { StyleSheet, Text, SafeAreaView, View } from 'react-native'
import TopBar from '@/components/TopBar'
import ReturnButton from '@/components/ReturnButton'
import { wp } from '@/helpers/util'
import { AppStyle } from '@/style/AppStyles'
import ManhwaGrid from '@/components/ManhwaGrid'
import React, { useCallback, useEffect, useState } from 'react'
import { Manhwa } from '@/models/Manhwa'
import { fetchMostViewedManhwas } from '@/lib/supabase'

const MostViewPage = () => {
    const [manhwas, setManhwas] = useState<Manhwa[]>([])

    const init = async () => {
        await fetchMostViewedManhwas()
            .then(values => setManhwas([...values]))
    }

    useEffect(useCallback(() => {
        init()
    }, []), [])

    return (
        <SafeAreaView style={AppStyle.safeArea}>
            <TopBar title="Most View">
                <ReturnButton/>
            </TopBar>
            <ManhwaGrid manhwas={manhwas} gap={10} paddingHorizontal={wp(5)} />        
        </SafeAreaView>
    )
}

export default MostViewPage

const styles = StyleSheet.create({})