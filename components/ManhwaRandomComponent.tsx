import { StyleSheet, Text, View } from 'react-native'
import { Manhwa } from '@/models/Manhwa'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { fetchRandomManhwa } from '@/lib/supabase'
import ManhwaHorizontalGrid from './ManhwaHorizontalGrid'
import { router } from 'expo-router'
import { GlobalContext } from '@/helpers/context'


const UPDATE_TIME_INTERVAL =  1 * 60 * 1000


const ManhwaRandomComponent = () => {

    const context = useContext(GlobalContext)
    const [manhwas, setManhwas] = useState<Manhwa[]>([])

    const init = async () => {        
            const lastTime: number | null = context.random_manhwas.last_update
            const currentTime: number = new Date().getTime()        
            if (lastTime == null || currentTime - lastTime > UPDATE_TIME_INTERVAL ) {                
                context.random_manhwas.last_update = currentTime
                await fetchRandomManhwa()
                    .then(values => {
                    context.random_manhwas.mawnhas = values
                    setManhwas([...values])}
                )
            } else {
                if (manhwas.length == 0) {
                    setManhwas([...context.random_manhwas.mawnhas])
                }
            }
        }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )

    return (        
        <ManhwaHorizontalGrid title='Random 🎲' manhwas={manhwas} onPress={() => router.navigate("/pages/RandomManhwaPage")}/>
    )
}

export default ManhwaRandomComponent;

const styles = StyleSheet.create({})