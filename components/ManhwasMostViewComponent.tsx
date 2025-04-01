import React, { useCallback, useContext, useState } from 'react'
import ManhwaHorizontalGrid from './ManhwaHorizontalGrid'
import { fetchMostViewedManhwas } from '@/lib/supabase'
import { router, useFocusEffect } from 'expo-router'
import { GlobalContext } from '@/helpers/context'
import { StyleSheet } from 'react-native'
import { Manhwa } from '@/models/Manhwa'



const UPDATE_TIME_INTERVAL =  5 * 60 * 1000


const MostViewedManhwasComponent = () => {

    const context = useContext(GlobalContext)
    const [manhwas, setManhwas] = useState<Manhwa[]>([])

    const init = async () => {        
        const lastTime: number | null = context.most_view_manhwas.last_update
        const currentTime: number = new Date().getTime()        
        if (lastTime == null || currentTime - lastTime > UPDATE_TIME_INTERVAL ) {            
            context.most_view_manhwas.last_update = currentTime
            await fetchMostViewedManhwas()
                .then(values => {
                context.most_view_manhwas.mawnhas = values
                setManhwas([...values])}
            )
            return
        } else {
            setManhwas([...context.most_view_manhwas.mawnhas])
        }
        
    }

    useFocusEffect(
        useCallback(() => {
            init()
        }, [])
    )

    const onPress = () => {
        router.navigate("/pages/MostViewPage")
    }

    return (
        <ManhwaHorizontalGrid 
            title='Most View ⚡' 
            manhwas={manhwas} 
            onPress={onPress}/>
    )
}

export default MostViewedManhwasComponent;

const styles = StyleSheet.create({})