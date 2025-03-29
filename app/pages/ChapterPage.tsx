import { 
    StyleSheet, 
    Text, 
    SafeAreaView, 
    View, 
    Pressable, 
    ActivityIndicator, 
    FlatList,    
    KeyboardAvoidingView,
    Platform    
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
    chapter?: Chapter
    loading: boolean
    leftChapter: () => void
    rightChapter: () => void
    onReturn: () => void
}

const ChapterPageHeader = ({chapter, loading, leftChapter, rightChapter, onReturn}: ChaperHeaderProps) => {
    return (
        <View
            style={{backgroundColor: 'white', paddingHorizontal: wp(5), paddingTop: 40, paddingBottom: 20}} >
            <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}}>
                <View style={{gap: 10, flexDirection: 'row', alignItems: "center", justifyContent: "center"}} >
                    <Text style={[AppStyle.textHeader, {alignSelf: "flex-start"}]}>Chapter</Text>
                    <Pressable onPress={leftChapter}> 
                        <Ionicons name='chevron-back-outline' size={22} color={Colors.black} />
                    </Pressable>
                    {
                        loading ?
                        <ActivityIndicator size={18} color={Colors.black} /> :
                        <Text style={[AppStyle.textRegular, {fontSize: 20}]}>{chapter ? chapter.chapter_num : ''}</Text>
                    }
                    <Pressable onPress={rightChapter}>
                        <Ionicons name='chevron-forward-outline' size={20} color={Colors.black} />
                    </Pressable>
                </View>
                <View style={{alignItems: "center", justifyContent: "center"}} >
                    <ReturnButton onPress={onReturn} />
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
        <View style={{width: '100%', gap: 20, paddingHorizontal: wp(5), marginBottom: 100}} >
            <View style={{flexDirection: 'row', marginVertical: 20, alignItems: "center", width: '100%'}} >
                <View style={{width: '100%', gap: 10, flexDirection: 'row', alignItems: "center", justifyContent: "flex-end"}} >                    
                    <Pressable onPress={leftChapter}> 
                        <Ionicons name='chevron-back-outline' size={22} color={Colors.black} />
                    </Pressable>                
                    <Text style={[AppStyle.textRegular, {fontSize: 20}]}>{chapter ? chapter.chapter_num : ''}</Text>
                    <Pressable onPress={rightChapter}>
                        <Ionicons name='chevron-forward-outline' size={22} color={Colors.black} />
                    </Pressable>
                </View>
            </View>            
        </View>
    )
}

const ChapterPage = () => {
    
    const context = useContext(GlobalContext)
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState<ChapterImage[]>([])
    const [chapter, setChapter] = useState<Chapter | null>(null)    

    const flashListRef = useRef<FlashList<ChapterImage>>()

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

    const onReturn = () => {        
        context.chapter_index = null
        router.back()
    }

    return (
        <KeyboardAvoidingView 
            style={{flex: 1} } 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <SafeAreaView style={[AppStyle.safeArea, {padding: 0}]}>            
                <FlatList
                    ref={flashListRef as any}
                    nestedScrollEnabled={true}
                    initialNumToRender={1}
                    ListHeaderComponent={<ChapterPageHeader chapter={chapter!} loading={loading} leftChapter={leftChapter} rightChapter={rightChapter} onReturn={onReturn} />}
                    ListFooterComponent={<ChapterPageFooter chapter={chapter!} leftChapter={leftChapter} rightChapter={rightChapter} />}
                    data={images}
                    keyExtractor={(item: ChapterImage, index: number) => index.toString()}
                    renderItem={({item}) => <ManhwaImage image={item} />}/>                
                <Pressable onPress={scrollUp} hitSlop={AppConstants.hitSlopLarge} style={styles.arrowUp} >
                    <Ionicons name='arrow-up-outline' size={20} color={'rgba(0, 0, 0, 0.6)'} />
                </Pressable>
            </SafeAreaView>            
        </KeyboardAvoidingView>
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
        backgroundColor: 'rgba(255, 255, 255, 0.7)'
    },    
    commentInput: {
        width: '100%',
        height: hp(14),
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 4,
        verticalAlign: 'top'
    }
})