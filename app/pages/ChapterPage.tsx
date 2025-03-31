import { 
    StyleSheet, 
    Text, 
    SafeAreaView, 
    View, 
    Pressable, 
    ActivityIndicator, 
    FlatList,    
    KeyboardAvoidingView,
    Platform,    
    ScrollView
} from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AppConstants } from '@/constants/AppConstants'
import ReturnButton from '@/components/ReturnButton'
import { fetchChapterImages } from '@/lib/supabase'
import ManhwaImage from '@/components/ManhwaImage'
import Ionicons from '@expo/vector-icons/Ionicons'
import { GlobalContext } from '@/helpers/context'
import { FlashList } from '@shopify/flash-list'
import { ChapterImage } from '@/models/Image'
import { AppStyle } from '@/style/AppStyles'
import { Colors } from '@/constants/Colors'
import { Chapter } from '@/models/Chapter'
import { hp, wp } from '@/helpers/util'
import { router } from 'expo-router'


interface ChaperHeaderProps {    
    manhwa_name: string
    chapter?: Chapter
    loading: boolean
    leftChapter: () => void
    rightChapter: () => void
    onReturn: () => void
}

const ChapterPageHeader = ({manhwa_name, chapter, loading, leftChapter, rightChapter, onReturn}: ChaperHeaderProps) => {
    return (
        <View style={styles.pageHeader} >
            <View style={{width: '100%', flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}} >
                <Text style={[AppStyle.textHeader, {maxWidth: '80%'}]}>{manhwa_name}</Text>            
                <ReturnButton onPress={onReturn} />            
            </View>
            <View style={{flexDirection: 'row', gap: 10, alignItems: "center", justifyContent: "flex-start"}} >
                <Text style={AppStyle.textHeader}>Chapter</Text>
                <View style={{flexDirection: 'row', alignItems: "center", gap: 10, alignSelf: 'flex-end'}} >
                    <Pressable onPress={leftChapter}> 
                        <Ionicons name='chevron-back-outline' size={22} color='white' />
                    </Pressable>
                    {
                        loading ?
                        <ActivityIndicator size={18} color={Colors.white} /> :
                        <Text style={[AppStyle.textRegular, {fontSize: 20}]}>{chapter ? chapter.chapter_num : ''}</Text>
                    }
                    <Pressable onPress={rightChapter}>
                        <Ionicons name='chevron-forward-outline' size={20} color='white' />
                    </Pressable>
                </View>
            </View>
        </View>
    )
}


interface ChapterPageFooterProps {
    chapter: Chapter
    leftChapter: () => void
    rightChapter: () => void    
}

const ChapterPageFooter = ({chapter, leftChapter, rightChapter}: ChapterPageFooterProps) => {
    return (
        <View style={styles.pageFooter} >
            <View style={{width: '100%', gap: 10, flexDirection: 'row', justifyContent: "center", alignItems: "center"}} >
                <Text style={AppStyle.textHeader}>Chapter </Text>
                <Pressable onPress={leftChapter}> 
                    <Ionicons name='chevron-back-outline' size={22} color='white' />
                </Pressable>                
                <Text style={[AppStyle.textRegular, {fontSize: 20}]}>{chapter ? chapter.chapter_num : ''}</Text>
                <Pressable onPress={rightChapter}>
                    <Ionicons name='chevron-forward-outline' size={22} color='white' />
                </Pressable>
            </View>            
        </View>
    )
}

const ChapterPage = () => {
    
    const context = useContext(GlobalContext)
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState<ChapterImage[]>([])
    const [chapter, setChapter] = useState<Chapter | null>(null)    

    const flashListRef = useRef<FlatList<ChapterImage>>()
    
    const update = async () => {
        setLoading(true)
        
        flashListRef.current?.scrollToOffset({animated: false, offset: 0})        
        const newChapter = context.chapters![context.chapter_index!]
        context.chapter_readed.add(newChapter.chapter_id)
        setChapter(newChapter)
        
        await fetchChapterImages(
            newChapter.chapter_id,
            context.chapter_images            
        ).then(values => setImages([...values]))

        setLoading(false)
    }

    useEffect(
        useCallback(() => {
            update()
        }, []),
        []
    )

    const leftChapter = async () => {
        if (context.chapter_index! > 0) {
            context.chapter_index! -= 1            
            await update()
        }
    }

    const rightChapter = async () => {
        if (context.chapter_index! + 1 < context.chapters!.length) {
            context.chapter_index! += 1
            await update()
        }
    }

    const scrollUp = () => {
        flashListRef.current?.scrollToOffset({animated: false, offset: 0})
    }

    const scrollDown = () => {
        flashListRef.current?.scrollToEnd({animated: false})
    }

    const onReturn = () => {        
        context.chapter_index = null
        router.back()
    }
    let totalHeight = 0
    images.forEach(item => totalHeight += item.height)
    const mediumHeight = images.length > 0 ? totalHeight / images.length : 512

    return (
        <SafeAreaView style={[AppStyle.safeArea, {padding: 0}]}>            
            <ScrollView style={{flex: 1}} >
                <ChapterPageHeader 
                    manhwa_name={context.manhwa!.title} 
                    chapter={chapter!} 
                    loading={loading} 
                    leftChapter={leftChapter} 
                    rightChapter={rightChapter} 
                    onReturn={onReturn} />
                <View style={{width: '100%', height: hp(100)}} >
                    <FlashList                        
                        ref={flashListRef as any}                    
                        nestedScrollEnabled={true}
                        estimatedItemSize={mediumHeight}
                        estimatedListSize={{width: wp(100), height: totalHeight}}
                        data={images}
                        keyExtractor={(item: ChapterImage, index: number) => index.toString()}
                        renderItem={({item}) => <ManhwaImage image={item} />}/>
                </View>
                <ChapterPageFooter 
                    chapter={chapter!} 
                    leftChapter={leftChapter} 
                    rightChapter={rightChapter} />
            </ScrollView>
            <Pressable onPress={scrollUp} hitSlop={AppConstants.hitSlopLarge} style={styles.arrowUp} >
                <Ionicons name='arrow-up-outline' size={20} color={'rgba(0, 0, 0, 0.6)'} />
            </Pressable>
            <Pressable onPress={scrollDown} hitSlop={AppConstants.hitSlopLarge} style={styles.arrowDown} >
                <Ionicons name='arrow-down-outline' size={20} color={'rgba(0, 0, 0, 0.6)'} />
            </Pressable>
        </SafeAreaView>
    )
}

export default ChapterPage

const styles = StyleSheet.create({
    arrowUp: {
        position: 'absolute', 
        bottom: 20, 
        right: 10, 
        padding: 6, 
        borderRadius: 32, 
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },    
    arrowDown: {
        position: 'absolute', 
        bottom: 20, 
        right: 60, 
        padding: 6, 
        borderRadius: 32, 
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },
    commentInput: {
        width: '100%',
        height: hp(14),
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 4,
        verticalAlign: 'top'
    },
    pageHeader: {
        backgroundColor: Colors.almostBlack, 
        paddingHorizontal: wp(5), 
        paddingTop: 40, 
        paddingBottom: 20, 
        gap: 20
    },
    pageFooter: {
        width: '100%', 
        gap: 20, 
        paddingHorizontal: wp(5), 
        alignItems: "center", 
        justifyContent: "center", 
        marginTop: 80,
        marginBottom: 300
    }
})