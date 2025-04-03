import { StyleSheet, Pressable, Text, ActivityIndicator, ViewStyle } from 'react-native'
import { Manhwa } from '@/models/Manhwa'
import { Chapter } from '@/models/Chapter'
import { router } from 'expo-router'
import { fetchManhwaChapterList } from '@/lib/supabase'
import React, {useState, useContext} from 'react'
import { GlobalContext } from '@/helpers/context'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyles'
import { formatTimestamp } from '@/helpers/util'
import { StyleProp } from 'react-native'
import { useReadingState } from '@/helpers/store'


interface ChapterLinkProps {
    manhwa: Manhwa
    chapter: Chapter
    shouldShowChapterDate?: boolean    
    prefix?: string    
    style?: StyleProp<ViewStyle>
}

const ChapterLink = ({
    manhwa, 
    chapter,
    shouldShowChapterDate = true,    
    prefix = 'Chapter ',
    style
}: ChapterLinkProps) => {

    const { setManhwa, setChapterMap, setChapterNum } = useReadingState()
    const [loading, setLoading] = useState(false)
    const manhwa_id = manhwa.manhwa_id

    const onPress = async () => {        
        setLoading(true)
        setManhwa(manhwa)
        await fetchManhwaChapterList(manhwa_id)
            .then(values => setChapterMap(values))
        setChapterNum(chapter.chapter_num)
        setLoading(false)
        router.navigate("/pages/ChapterPage")
    }

    return (
        <Pressable onPress={onPress} style={[styles.chapterLink, style]} >
            {
                loading ? 
                <ActivityIndicator size={20} color={Colors.white} /> :
                <>
                    <Text style={AppStyle.textRegular}>{prefix}{chapter.chapter_num}</Text>
                    {
                        shouldShowChapterDate && 
                        <Text style={[AppStyle.textRegular, {paddingRight: 20}]}>{formatTimestamp(chapter.created_at)}</Text>
                    }
                </>
            }
        </Pressable>
    )
}

export default ChapterLink

const styles = StyleSheet.create({
    chapterLink: {
        paddingVertical: 8,        
        borderRadius: 4,
        backgroundColor: Colors.backgroundColor,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        
        gap: 20
    }
})