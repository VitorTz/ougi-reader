import React, { useCallback, useEffect, useState } from 'react'
import { fetchLastUpdatedManhwas } from '@/lib/supabase'
import { StyleSheet, SafeAreaView } from 'react-native'
import ReturnButton from '@/components/ReturnButton'
import ManhwaGrid from '@/components/ManhwaGrid'
import { AppStyle } from '@/style/AppStyles'
import TopBar from '@/components/TopBar'
import { Manhwa } from '@/models/Manhwa'


const LatestReleasesPage = () => {

    const [manhwas, setManhwas] = useState<Manhwa[]>([])

    const init = async () => {
        await fetchLastUpdatedManhwas()
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
        <TopBar title="Latest Releases 🔥">
            <ReturnButton/>
        </TopBar>
        <ManhwaGrid 
            manhwas={manhwas} 
            numColumns={2} 
            shouldShowChapterDate={false}/>
    </SafeAreaView>
    )
}

export default LatestReleasesPage

const styles = StyleSheet.create({})