import { StyleSheet, Text, View } from 'react-native'
import { Manhwa } from '@/models/Manhwa'
import React, { useCallback, useEffect, useState } from 'react'
import { fetchManhwasMostView, fetchRandomManhwa } from '@/lib/supabase'
import ManhwaHorizontalGrid from './ManhwaHorizontalGrid'
import { router } from 'expo-router'


var page = 0

const ManhwaRandomComponent = () => {

    const [manhwas, setManhwas] = useState<Manhwa[]>([])

    const init = async () => {        
        await fetchRandomManhwa()
            .then(values => setManhwas([...values]))
    }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )

    return (        
        <ManhwaHorizontalGrid title='Random' manhwas={manhwas} onPress={() => router.navigate("/pages/RandomManhwaPage")}/>
    )
}

export default ManhwaRandomComponent;

const styles = StyleSheet.create({})