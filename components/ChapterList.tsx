import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Chapter } from '@/models/Chapter'
import { fetchManhwaChapterList } from '@/lib/supabase'
import { useState, useEffect, useCallback, useContext} from 'react'
import React from 'react'
import { AppStyle } from '@/style/AppStyles'
import { GlobalContext } from '@/helpers/context'
import { router, useFocusEffect } from 'expo-router'
import { Colors } from '@/constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { AppConstants } from '@/constants/AppConstants'
import { formatTimestamp } from '@/helpers/util'


interface ChapterListProps {
    manhwa_id: number
}


const ChapterItem = ({chapter, index}: {chapter: Chapter, index: number}) => {    

    const context = useContext(GlobalContext)

    const [isReaded, setIsReaded] = useState(context.chapter_readed.has(chapter.chapter_id))    

    useFocusEffect(
        useCallback(() => {            
            setIsReaded(context.chapter_readed.has(chapter.chapter_id))
        }, [])
    )
    
    const onPress = () => {
        context.chapter_index = index
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
            <Text style={[AppStyle.textRegular, {color: isReaded ? Colors.almostBlack : 'white'}]}>{chapter.chapter_num}</Text>            
        </Pressable>
    )
}


const ChapterList = ({manhwa_id}: ChapterListProps) => {

    const context = useContext(GlobalContext)
    const [chapters, setChapter] = useState<Chapter[]>([])

    const init = async () => {   
        context.chapter_index = null     
        fetchManhwaChapterList(manhwa_id)
            .then(values => {
                    context.chapters = values
                    setChapter([...values])
                }
            )
    }    

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )    

    return (
        <View style={{width: '100%', gap: 20}} >
            <Text style={AppStyle.textHeader}>Chapters</Text>            
            <View style={{width: '100%', gap: 10, flexDirection: 'row', justifyContent: "center", flexWrap: 'wrap'}} >
                {
                    chapters.map(
                        (item, index) => <ChapterItem key={item.chapter_id} index={index} chapter={item} />
                    )
                }            
            </View>
        </View>
    )
}

export default ChapterList

const styles = StyleSheet.create({})