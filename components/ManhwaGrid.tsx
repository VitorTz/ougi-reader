import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Manhwa } from '@/models/Manhwa'
import { getItemGridDimensions, hp, wp } from '@/helpers/util'
import { FlashList } from '@shopify/flash-list'
import { AppConstants } from '@/constants/AppConstants'
import ManhwaCover from './ManhwaCover'


interface ManhwaGridProps {
    manhwas: Manhwa[]
    paddingHorizontal: number
    gap: number
    numColumns?: number
}

const ManhwaGrid = ({manhwas, paddingHorizontal = wp(5), gap = 10, numColumns = 1}: ManhwaGridProps) => {    

    const {width, height} = getItemGridDimensions(
        paddingHorizontal,
        gap,
        numColumns,
        AppConstants.ManhwaCoverDimension.width,
        AppConstants.ManhwaCoverDimension.height
    )

    return (
        <View style={{width: '100%', flex: 1, marginBottom: 10}} >
            <FlashList
                data={manhwas}
                numColumns={numColumns}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => <ManhwaCover width={width} height={height} marginBottom={6} manhwa={item} />}
                estimatedItemSize={300}/>
        </View>
    )
}

export default ManhwaGrid

const styles = StyleSheet.create({})