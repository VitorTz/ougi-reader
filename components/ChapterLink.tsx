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

    const [loading, setLoading] = useState(false)
    const context = useContext(GlobalContext)

    const onPress = async () => {        
        setLoading(true)
        context.manhwa = manhwa
        context.chapter_index = chapter.chapter_num - 1
        await fetchManhwaChapterList(manhwa.manhwa_id)
            .then(values => context.chapters = values)
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
                        <Text style={AppStyle.textRegular}>{formatTimestamp(chapter.created_at)}</Text>
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
        paddingHorizontal: 10,
        borderRadius: 4,
        backgroundColor: Colors.backgroundColor,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        alignSelf: "flex-start",
        gap: 20
    }
})