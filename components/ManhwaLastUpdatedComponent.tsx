import { StyleSheet, Text, View } from 'react-native'
import { Manhwa } from '@/models/Manhwa'
import React, { useCallback, useEffect, useState } from 'react'
import { fetchManhwasLastUpdated } from '@/lib/supabase'
import ManhwaHorizontalGrid from './ManhwaHorizontalGrid'


var page = 0

const ManhwaLastUpdatedComponent = () => {

    const [manhwas, setManhwas] = useState<Manhwa[]>([])

    const init = async () => {        
        await fetchManhwasLastUpdated(page)
            .then(values => setManhwas([...values]))
    }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )

    return (        
        <ManhwaHorizontalGrid title='Last Updated' manhwas={manhwas} />                    
    )
}

export default ManhwaLastUpdatedComponent

const styles = StyleSheet.create({})