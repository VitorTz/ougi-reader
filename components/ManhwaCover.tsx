import { ActivityIndicator, Falsy, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { Manhwa } from '@/models/Manhwa'
import { Image } from 'expo-image';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AppConstants } from '@/constants/AppConstants';
import { AppStyle } from '@/style/AppStyles';
import { Chapter } from '@/models/Chapter';
import { router } from 'expo-router';
import { GlobalContext } from '@/helpers/context';
import { fetchBookmarkStatus, fetchManhwaChapterList, getSession, updateManhwaViews } from '@/lib/supabase';
import ManhwaStatusComponent from './ManhwaStatusComponent';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { formatTimestamp } from '@/helpers/util';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from './Toast';



const ChapterLink = ({manhwa, chapter}: {manhwa: Manhwa, chapter: Chapter}) => {

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
        <Pressable onPress={onPress} style={styles.chapterLink} >
            {
                loading ? 
                <ActivityIndicator size={20} color={Colors.white} /> :
                <>
                    <Text style={AppStyle.textRegular}>Chapter {chapter.chapter_num}</Text>
                    <Text style={AppStyle.textRegular}>{formatTimestamp(chapter.created_at)}</Text>
                </>
            }
        </Pressable>
    )
}


const Bookmark = ({manhwa}: {manhwa: Manhwa}) => {

    const context = useContext(GlobalContext)
    const [status, setStatus] = useState(context.user_bookmarks.has(manhwa.manhwa_id))
    const [loading, setLoading] = useState(false)    
    const iconName = status == true ? 'bookmark' : 'bookmark-outline'
    
    useEffect(() => {
        setStatus(context.user_bookmarks.has(manhwa.manhwa_id));
    }, [context.user_bookmarks, manhwa.manhwa_id]);


    const addOrRemoveFromContext = (status: boolean) => {
        if (status) {
            context.user_bookmarks.set(manhwa.manhwa_id, manhwa)
        } else {
            context.user_bookmarks.delete(manhwa.manhwa_id)
        }
    }
    
    const toggleBookmark = async () => {        
        const session = await getSession()
        if (!session) {
            Toast.show({title: "Error", message: "You are not logged", type: "error"})
            return
        }
        setLoading(true)
        await fetchBookmarkStatus(manhwa.manhwa_id)
            .then(value => {
                if (value) {
                    setStatus(value)
                    addOrRemoveFromContext(value!)
                }
                }
            )
        setLoading(false)
    }

    return (
        <Pressable 
            onPress={toggleBookmark}
            style={{
                position: 'absolute',
                right: 10,
                top: 10,
                padding: 8,
                backgroundColor: Colors.accentColor,
                borderRadius: 32
            }} >
            {
                loading ?
                <ActivityIndicator size={20} color={Colors.white} /> :
                <Ionicons name={iconName} size={20} color={Colors.white}/>
            }
        </Pressable>
    )
}


interface ManhwaCoverProps {
    manhwa: Manhwa
    width?: number
    height?: number
    marginRight?: number
    marginBottom?: number
    styleProp?: StyleProp<ViewStyle>
}

const coverWidth: number = AppConstants.ManhwaCoverDimension.width
const coverHeight: number = AppConstants.ManhwaCoverDimension.height

const ManhwaCover = ({
    manhwa, 
    width = coverWidth, 
    height = coverHeight, 
    marginRight = 10,
    marginBottom = 0,
    styleProp = false
}: ManhwaCoverProps) => {

    const context = useContext(GlobalContext)    

    const onPress = () => {
        updateManhwaViews(manhwa.manhwa_id)
        context.manhwa = manhwa
        router.navigate("/pages/ManhwaPage")
    }    

    return (
        <Pressable style={[{width, marginRight, marginBottom}, styleProp]} onPress={onPress} >
            <Image 
                source={manhwa.cover_image_url} 
                contentFit='cover' 
                style={[{borderRadius: 22, width, height}]}
            />
            <View style={styles.container} >
                <Text numberOfLines={1} style={[AppStyle.textRegular, {fontSize: 20}]}>{manhwa.title}</Text>
                {manhwa.chapters && manhwa.chapters.map(
                    (item) => <ChapterLink key={item.chapter_num} manhwa={manhwa} chapter={item} />
                )}                
            </View>
            <View style={{
                position: 'absolute', 
                left: 10, 
                top: 10, 
                paddingHorizontal: 10, 
                paddingVertical: 8, 
                backgroundColor: manhwa.status == "Completed" ? Colors.accentColor : "#C87E6A", 
                borderRadius: 22
            }} >
                <Text style={[AppStyle.textRegular, {fontSize: 12, color: 'white'}]}>{manhwa.status}</Text>
            </View>
            <Bookmark manhwa={manhwa} />
        </Pressable>
    )
}

export default ManhwaCover

const styles = StyleSheet.create({    
    container: {
        padding: 10,        
        width: '100%',        
        gap: 10,        
        borderTopWidth: 2,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4        
    },
    chapterLink: {
        paddingVertical: 8, 
        paddingHorizontal: 10,
        borderRadius: 4,
        backgroundColor: Colors.backgroundColor,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20
    },
    shadow: {
        shadowColor: 'black',
        shadowOffset: { width: 8, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5    
    }
})