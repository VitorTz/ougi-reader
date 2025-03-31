import React, { useCallback, useContext, useState } from 'react'
import ManhwaHorizontalGrid from './ManhwaHorizontalGrid'
import { fetchLastUpdatedManhwas } from '@/lib/supabase'
import { GlobalContext } from '@/helpers/context'
import { useFocusEffect } from 'expo-router'
import { StyleSheet } from 'react-native'
import { Manhwa } from '@/models/Manhwa'
import { router } from 'expo-router'


const UPDATE_TIME_INTERVAL =  5 * 60 * 1000


const ManhwaLastUpdatedComponent = () => {

    const context = useContext(GlobalContext)
    const [manhwas, setManhwas] = useState<Manhwa[]>([])

    const init = async () => {            
            const lastTime: number | null = context.last_update_manhwas.last_update
            const currentTime: number = new Date().getTime()        
            if (lastTime == null || currentTime - lastTime > UPDATE_TIME_INTERVAL ) {
                console.log("updating last release manhwas")
                context.last_update_manhwas.last_update = currentTime
                await fetchLastUpdatedManhwas()
                    .then(values => {
                    context.last_update_manhwas.mawnhas = values
                    setManhwas([...values])}
                )
            } else {
                setManhwas([...context.last_update_manhwas.mawnhas])
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
            onPress={() => router.navigate("/pages/LastUpdatePage")}/>
    )
}

export default ManhwaLastUpdatedComponent

const styles = StyleSheet.create({})