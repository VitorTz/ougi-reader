import { StyleSheet, SafeAreaView, Text, View } from 'react-native'
import TopBar from '@/components/TopBar'
import { hp, wp } from '@/helpers/util'
import { Colors } from '@/constants/Colors'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import ReturnButton from '@/components/ReturnButton'
import { Manhwa } from '@/models/Manhwa'
import { fetchManhwaByAuthor, fetchManhwaByGenre } from '@/lib/supabase'
import ManhwaGrid from '@/components/ManhwaGrid'
import { GlobalContext } from '@/helpers/context'
import { AppStyle } from '@/style/AppStyles'

const ManhwaByAuthor = () => {

    const context = useContext(GlobalContext)
    const params = useLocalSearchParams()
    const author_id: number = params.author_id as any
    const author_name: string = params.author_name as any
    const author_role: string = params.author_role as any
                
    const [manhwas, setManhwas] = useState<Manhwa[]>([])

    const init = async () => {
        await fetchManhwaByAuthor(author_id, context.manhwa_by_author)
            .then(values => setManhwas([...values]))
    }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )

    return (
        <SafeAreaView style={AppStyle.safeArea}>
            <TopBar title={`${author_role}: ${author_name}`}>
                <ReturnButton/>
            </TopBar>
            <ManhwaGrid 
                manhwas={manhwas} 
                gap={10} 
                paddingHorizontal={wp(5)}
                loading={false}
                hasResults={true}
                />            
        </SafeAreaView>
    )
}

export default ManhwaByAuthor

const styles = StyleSheet.create({})