import { StyleSheet, SafeAreaView, Text, View } from 'react-native'
import TopBar from '@/components/TopBar'
import { hp, wp } from '@/helpers/util'
import { Colors } from '@/constants/Colors'
import React, { useCallback, useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import ReturnButton from '@/components/ReturnButton'
import { Manhwa } from '@/models/Manhwa'
import { fetchManhwaByGenre } from '@/lib/supabase'
import { FlashList } from '@shopify/flash-list'
import { AppConstants } from '@/constants/AppConstants'
import ManhwaCover from '@/components/ManhwaCover'

const ManhwaByGenre = () => {

    const [manhwas, setManhwas] = useState<Manhwa[]>([])
    const params = useLocalSearchParams()
    const genre: string = params.genre as any

    const init = async () => {
        await fetchManhwaByGenre(genre)
            .then(values => setManhwas([...values]))
    }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )

    return (
        <SafeAreaView style={{width: '100%', flex: 1, padding: wp(5), backgroundColor: Colors.backgroundColor}}>
            <TopBar title={genre}>
                <ReturnButton/>
            </TopBar>
            <View style={{width: '100%', height: '100%', paddingBottom: 80}} >
                <FlashList
                    data={manhwas}
                    keyExtractor={(item: Manhwa) => item.manhwa_id.toString()}
                    estimatedItemSize={AppConstants.ManhwaCoverDimension.height}
                    renderItem={({item, index}) => <View style={{alignSelf: 'center', marginBottom: 20}} ><ManhwaCover manhwa={item}/></View>}
                />
            </View>
        </SafeAreaView>
    )
}

export default ManhwaByGenre

const styles = StyleSheet.create({})