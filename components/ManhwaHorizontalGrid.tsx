import { StyleSheet, Text, View } from 'react-native'
import { AppConstants } from '@/constants/AppConstants'
import { AppStyle } from '@/style/AppStyles'
import { Manhwa } from '@/models/Manhwa'
import { FlashList } from '@shopify/flash-list'
import React from 'react'
import ManhwaCover from './ManhwaCover'


interface ManhwaHorizontalGridProps {
    title: string
    manhwas: Manhwa[]
}

const width: number = AppConstants.ManhwaCoverDimension.width
const height: number = AppConstants.ManhwaCoverDimension.height


const ManhwaHorizontalGrid = ({title, manhwas}: ManhwaHorizontalGridProps) => {
    
    return (
        <View style={{gap: 20}} >
            <Text style={AppStyle.textHeader}>{title}</Text>
            <View style={{alignItems: 'flex-start', height, width: '100%'}}>
                <FlashList                    
                    data={manhwas}
                    horizontal={true}
                    keyExtractor={(item: Manhwa) => item.manhwa_id.toString()}
                    estimatedItemSize={width}
                    renderItem={({item}) => <ManhwaCover manhwa={item} marginRight={4} />}
                />
            </View>
        </View>
    )
}

export default ManhwaHorizontalGrid

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: height + 120, // Adjust based on title and padding
        paddingVertical: 16,
        gap: 20
    },
})