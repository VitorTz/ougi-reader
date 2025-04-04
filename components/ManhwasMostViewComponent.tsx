import React, { useCallback, useRef } from 'react'
import ManhwaHorizontalGrid from './ManhwaHorizontalGrid'
import { fetchMostViewedManhwas } from '@/lib/supabase'
import { router, useFocusEffect } from 'expo-router'
import { StyleSheet } from 'react-native'
import { useMostViewManhwasState } from '@/helpers/store'


const UPDATE_TIME_INTERVAL =  5 * 60 * 1000


const MostViewedManhwasComponent = () => {

    const { manhwas, lastUpdate, setManhwas } = useMostViewManhwasState()

    const init = async () => {
        const currentTime: number = new Date().getTime()
        if (manhwas.length == 0 || currentTime - lastUpdate > UPDATE_TIME_INTERVAL ) {
            await fetchMostViewedManhwas().then(values => { setManhwas(values) })
            console.log("requesting new most view manhwas")
        }        
    }    

    useFocusEffect(
        () => {init()}
    )

    const onPress = () => {
        router.navigate("/pages/MostViewPage")
    }

    return (
        <ManhwaHorizontalGrid 
            title='Most View' 
            manhwas={manhwas}
            onPress={onPress}/>
    )
}

export default MostViewedManhwasComponent;

const styles = StyleSheet.create({})