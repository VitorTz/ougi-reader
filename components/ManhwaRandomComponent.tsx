import { StyleSheet } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { fetchRandomManhwa } from '@/lib/supabase'
import ManhwaHorizontalGrid from './ManhwaHorizontalGrid'
import { router } from 'expo-router'
import { useRandomManhwaState } from '@/helpers/store'


const UPDATE_TIME_INTERVAL =  1 * 60 * 1000


const ManhwaRandomComponent = () => {

    const { manhwas, setManhwas, lastUpdate } = useRandomManhwaState()

    const init = async () => {                    
        if (manhwas.length == 0 || Date.now() - lastUpdate > UPDATE_TIME_INTERVAL ) {                                
            await fetchRandomManhwa().then(values => {setManhwas(values)})
            console.log("requesting random manhwas")
        }
    }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )

    return (        
        <ManhwaHorizontalGrid 
            title='Random'
            manhwas={manhwas} 
            onPress={() => router.navigate("/pages/RandomManhwaPage")}/>
    )
}

export default ManhwaRandomComponent;

const styles = StyleSheet.create({})