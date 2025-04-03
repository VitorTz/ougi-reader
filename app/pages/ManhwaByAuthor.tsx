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
import { AppStyle } from '@/style/AppStyles'
import { useManhwaByAutorState } from '@/helpers/store'

const ManhwaByAuthor = () => {
    
    const {authorMap, addAuthor} = useManhwaByAutorState()

    const params = useLocalSearchParams()
    const author_id: number = params.author_id as any
    const author_name: string = params.author_name as any
    const author_role: string = params.author_role as any
                
    const [manhwas, setManhwas] = useState<Manhwa[]>([])

    const init = async () => {
        if (!authorMap.has(author_id)) {
            await fetchManhwaByAuthor(author_id)
                .then(values => {
                    addAuthor(author_id, values)
                    setManhwas([...values])
                })
        } else {
            setManhwas([...authorMap.get(author_id)!])
        }
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