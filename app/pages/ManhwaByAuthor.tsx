import { StyleSheet, SafeAreaView, Text, View } from 'react-native'
import TopBar from '@/components/TopBar'
import { hp, wp } from '@/helpers/util'
import { Colors } from '@/constants/Colors'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import ReturnButton from '@/components/ReturnButton'
import { Manhwa } from '@/models/Manhwa'
import { fetchManhwaByAuthor, fetchManhwaByGenre } from '@/lib/supabase'
import { FlashList } from '@shopify/flash-list'
import { AppConstants } from '@/constants/AppConstants'
import ManhwaCover from '@/components/ManhwaCover'
import { GlobalContext } from '@/helpers/context'
import { AppStyle } from '@/style/AppStyles'

const ManhwaByAuthor = () => {

    const context = useContext(GlobalContext)
    const [manhwas, setManhwas] = useState<Manhwa[]>([])
    const params = useLocalSearchParams()

    const author_id: number = params.author_id as any
    const author_name: string = params.author_name as any
    const author_role: string = params.author_role as any

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
            <View style={{width: '100%', height: '100%', paddingBottom: 80}} >
                <FlashList
                    data={manhwas}
                    keyExtractor={(item: Manhwa) => item.manhwa_id.toString()}
                    estimatedItemSize={AppConstants.ManhwaCoverDimension.height}
                    renderItem={({item, index}) => <ManhwaCover manhwa={item} marginBottom={20} styleProp={{alignSelf: "center"}}/>}
                />
            </View>
        </SafeAreaView>
    )
}

export default ManhwaByAuthor

const styles = StyleSheet.create({})