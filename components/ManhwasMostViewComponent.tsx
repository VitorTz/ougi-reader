import { StyleSheet, Text, View } from 'react-native'
import { Manhwa } from '@/models/Manhwa'
import React, { useCallback, useEffect, useState } from 'react'
import { fetchManhwasMostView } from '@/lib/supabase'
import ManhwaHorizontalGrid from './ManhwaHorizontalGrid'


var page = 0

const ManhawasMostViewComponent = () => {

    const [manhwas, setManhwas] = useState<Manhwa[]>([])

    const init = async () => {        
        await fetchManhwasMostView(page)
            .then(values => setManhwas([...values]))
    }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )

    return (        
        <ManhwaHorizontalGrid title='Most View' manhwas={manhwas} />                    
    )
}

export default ManhawasMostViewComponent;

const styles = StyleSheet.create({})