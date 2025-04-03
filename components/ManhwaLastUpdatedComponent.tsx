import React, { useCallback } from 'react'
import ManhwaHorizontalGrid from './ManhwaHorizontalGrid'
import { fetchLastUpdatedManhwas } from '@/lib/supabase'
import { useFocusEffect } from 'expo-router'
import { StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useLatestReleasesManhwaState } from '@/helpers/store'


const UPDATE_TIME_INTERVAL =  5 * 60 * 1000


const ManhwaLastReleasesComponent = () => {

    const { manhwas, setManhwas, lastUpdate } = useLatestReleasesManhwaState()

    const init = async () => {                                    
        if (manhwas.length == 0 || Date.now() - lastUpdate > UPDATE_TIME_INTERVAL ) {
            await fetchLastUpdatedManhwas().then(values => {setManhwas(values)})
        }
    }
    
    useFocusEffect(
        useCallback(() => {
            init()
        }, [])
    )

    return (        
        <ManhwaHorizontalGrid 
            title='Latest Releases 🔥' 
            manhwas={manhwas} 
            onPress={() => router.navigate("/pages/LatestReleasesPage")}/>
    )
}

export default ManhwaLastReleasesComponent

const styles = StyleSheet.create({})