import { Pressable, StyleSheet, Text, View } from 'react-native'
import { AppConstants } from '@/constants/AppConstants'
import { AppStyle } from '@/style/AppStyles'
import { Manhwa } from '@/models/Manhwa'
import { FlashList } from '@shopify/flash-list'
import React from 'react'
import ManhwaCover from './ManhwaCover'
import { Colors } from '@/constants/Colors'


const width: number = AppConstants.ManhwaCoverDimension.width
const height: number = AppConstants.ManhwaCoverDimension.height


interface ManhwaHorizontalGridProps {
    title: string
    manhwas: Manhwa[]
    onPress?: () => void
}


const ManhwaHorizontalGrid = ({title, manhwas, onPress}: ManhwaHorizontalGridProps) => {
    return (
        <View style={{gap: 20}} >
            <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}} >
                <Text style={AppStyle.textHeader}>{title}</Text>
                {
                    onPress &&
                    <Pressable onPress={onPress} hitSlop={AppConstants.hitSlopLarge}>
                        <Text style={AppStyle.textLink}>view all</Text>
                    </Pressable>
                }
            </View>
            <View style={{alignItems: 'flex-start', height: height + 220, width: '100%'}}>
                <FlashList                    
                    data={manhwas}
                    horizontal={true}
                    keyExtractor={(item: Manhwa, index: number) => index.toString()}
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