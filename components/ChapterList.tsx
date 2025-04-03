import { useReadingHistoryState, useReadingState } from '@/helpers/store'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useEffect, useCallback, useState } from 'react'
import { fetchManhwaChapterList } from '@/lib/supabase'
import { router, useFocusEffect } from 'expo-router'
import { AppStyle } from '@/style/AppStyles'
import { Colors } from '@/constants/Colors'
import { Chapter } from '@/models/Chapter'
import React from 'react'


interface ChapterListProps {
    manhwa_id: number
}


const ChapterListItem = ({chapter, index}: {chapter: Chapter, index: number}) => {

    const { setChapterNum: setChapterNum } = useReadingState()
    const { readingHistoryMap } = useReadingHistoryState()
    const [isReaded, setIsReaded] = useState(false)
    

    useFocusEffect(
        useCallback(() => {
            setIsReaded(readingHistoryMap.has(chapter.chapter_id))
        }, [readingHistoryMap]) 
    )
    
    const onPress = () => {
        setChapterNum(chapter.chapter_num)
        router.navigate("/pages/ChapterPage")
    }
    
    return (
        <Pressable 
            onPress={onPress}
            style={{
                width: 48,
                height: 48,
                borderRadius: 4,
                justifyContent: "center",                 
                alignItems: "center",
                backgroundColor: isReaded ? Colors.white : Colors.accentColor,
                borderColor: isReaded ? Colors.accentColor : 'white',
                flexDirection: 'row'                                
            }}>
            <Text style={[AppStyle.textRegular, {color: isReaded ? Colors.backgroundColor : 'white'}]}>{index + 1}</Text>            
        </Pressable>
    )
}


const ChapterList = ({manhwa_id}: ChapterListProps) => {
        
    const { chapterMap, setChapterMap } = useReadingState()
    
    const init = async () => {
        await fetchManhwaChapterList(manhwa_id)
            .then(values => {setChapterMap(values)})
    }    

    useEffect(
        () => {
            init()
        },
        []
    )    

    return (
        <View style={{width: '100%', gap: 20}} >
            <Text style={AppStyle.textHeader}>Chapters</Text>            
            <View style={{width: '100%', gap: 10, flexDirection: 'row', justifyContent: "center", flexWrap: 'wrap'}} >
                {
                    Array.from(chapterMap.values()).map(
                        (item, index) => 
                            <ChapterListItem 
                                key={item.chapter_id} 
                                chapter={item} 
                                index={index}/>
                    )
                }            
            </View>
        </View>
    )
}

export default ChapterList

const styles = StyleSheet.create({})