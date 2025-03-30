import { StyleSheet, Text, View } from 'react-native'
import { Manhwa } from '@/models/Manhwa'
import React, { useCallback, useEffect, useState } from 'react'
import { fetchLastUpdatedManhwas } from '@/lib/supabase'
import ManhwaHorizontalGrid from './ManhwaHorizontalGrid'
import { router } from 'expo-router'


var page = 0

const ManhwaLastUpdatedComponent = () => {

    const [manhwas, setManhwas] = useState<Manhwa[]>([])

    const init = async () => {        
        await fetchLastUpdatedManhwas(0, 30, 3)
            .then(values => setManhwas([...values]))
    }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
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