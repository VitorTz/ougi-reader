import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef } from 'react'
import { Manhwa } from '@/models/Manhwa'
import { getItemGridDimensions, hp, wp } from '@/helpers/util'
import { FlashList } from '@shopify/flash-list'
import { AppConstants } from '@/constants/AppConstants'
import ManhwaCover from './ManhwaCover'
import { Colors } from '@/constants/Colors'


interface ManhwaGridProps {
    manhwas: Manhwa[]
    onEndReached?: () => void
    loading?: boolean
    hasResults?: boolean
    shouldScrollToTopWhenManhwasChange?: boolean
    paddingHorizontal?: number
    gap?: number
    numColumns?: number
    shouldShowChapterDate?: boolean
}

const ManhwaGrid = ({
    manhwas, 
    onEndReached, 
    loading = false, 
    hasResults = true,
    shouldScrollToTopWhenManhwasChange = false,
    paddingHorizontal = wp(5), 
    gap = 10, 
    numColumns = 1,
    shouldShowChapterDate = true
}: ManhwaGridProps) => {    

    const ref = useRef<FlashList<Manhwa>>()
    const {width, height} = getItemGridDimensions(
        paddingHorizontal,
        gap,
        numColumns,
        AppConstants.ManhwaCoverDimension.width,
        AppConstants.ManhwaCoverDimension.height
    )

    useEffect(
        () => {            
            if (shouldScrollToTopWhenManhwasChange) {
                ref.current?.scrollToOffset({animated: false, offset: 0})
            }
        },
        [manhwas]
    )

    return (
        <View style={{width: '100%', flex: 1, marginBottom: 10}} >
            <FlashList        
                ref={ref as any}
                data={manhwas}
                numColumns={numColumns}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => <ManhwaCover shouldShowChapterDate={shouldShowChapterDate} width={width} height={height} marginBottom={6} manhwa={item} />}
                estimatedItemSize={AppConstants.ManhwaCoverDimension.height + 180}
                ListFooterComponent={
                    <>
                        {
                            loading && hasResults &&
                            <View style={{width: '100%', paddingVertical: 22, alignItems: "center", justifyContent: "center"}} >
                                <ActivityIndicator size={32} color={Colors.white} />
                            </View> 
                        }
                    </>
                }
                onEndReached={onEndReached}
                scrollEventThrottle={4}
                onEndReachedThreshold={1}/>
        </View>
    )
}

export default ManhwaGrid

const styles = StyleSheet.create({})