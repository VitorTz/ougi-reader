import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Manhwa } from '@/models/Manhwa'
import { getItemGridDimensions, hp } from '@/helpers/util'
import { FlashList } from '@shopify/flash-list'
import { AppConstants } from '@/constants/AppConstants'
import ManhwaCover from './ManhwaCover'


interface ManhwaGridProps {
    manhwas: Manhwa[]
    paddingHorizontal: number
    gap: number
}

const ManhwaGrid = ({manhwas, paddingHorizontal, gap}: ManhwaGridProps) => {

    const {width, height} = getItemGridDimensions(
        paddingHorizontal, 
        gap, 
        2, 
        AppConstants.ManhwaCoverDimension.width, 
        AppConstants.ManhwaCoverDimension.height
    )

    return (
        <View style={{width: '100%', flex: 1, marginBottom: 10}} >
            <FlashList
                data={manhwas}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => <ManhwaCover marginBottom={6} manhwa={item} width={width} height={height}/>}
                estimatedItemSize={300}/>
        </View>
    )
}

export default ManhwaGrid

const styles = StyleSheet.create({})