import { 
    StyleSheet, 
    Text, 
    SafeAreaView, 
    View, 
    Pressable, 
    ActivityIndicator, 
    FlatList
} from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import ReturnButton from '@/components/ReturnButton'
import ManhwaImage from '@/components/ManhwaImage'
import { fetchChapterImages } from '@/lib/supabase'
import Ionicons from '@expo/vector-icons/Ionicons'
import { GlobalContext } from '@/helpers/context'
import { FlashList } from '@shopify/flash-list'
import { ChapterImage } from '@/models/Image'
import { AppStyle } from '@/style/AppStyles'
import { Colors } from '@/constants/Colors'
import { Chapter } from '@/models/Chapter'
import { hp, wp } from '@/helpers/util'
import { router } from 'expo-router'
import { AppConstants } from '@/constants/AppConstants'


interface ChaperHeaderProps {    
    chapter?: Chapter
    leftChapter: () => void
    rightChapter: () => void
    onReturn: () => void
}

const ChapterHeader = ({chapter, leftChapter, rightChapter, onReturn}: ChaperHeaderProps) => {
    return (
        <View style={{flexDirection: 'row', paddingHorizontal: wp(5), marginTop: 40, marginBottom: 20, alignItems: "center", justifyContent: "space-between"}} >
            <View style={{gap: 10, flexDirection: 'row', alignItems: "center", justifyContent: "center"}} >
                <Text style={[AppStyle.textHeader, {alignSelf: "flex-start"}]}>Chapter</Text>
                <Pressable onPress={leftChapter}> 
                    <Ionicons name='chevron-back-outline' size={22} color={Colors.black} />
                </Pressable>                
                <Text style={[AppStyle.textRegular, {fontSize: 20}]}>{chapter ? chapter.chapter_num : ''}</Text>
                <Pressable onPress={rightChapter}>
                    <Ionicons name='chevron-forward-outline' size={22} color={Colors.black} />
                </Pressable>
            </View>
            <View style={{alignItems: "center", justifyContent: "center"}} >
                <ReturnButton onPress={onReturn} />
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
        flashListRef.current?.scrollToOffset({animated: false, offset: 0})
        
        const newChapter = context.chapters![context.chapter_index!]
        context.chapter_readed.add(newChapter.chapter_id)
        console.log(context.chapter_readed)
        
        setLoading(true)
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
        flashListRef.current?.scrollToOffset({animated: true, offset: 0})
    }

    const onReturn = () => {        
        context.chapter_index = null
        router.back()
    }

    return (
        <SafeAreaView style={{width: '100%', flex: 1, backgroundColor: "white"}}>            
            <View style={{flex: 1}}>                
                <View style={{justifyContent: 'flex-start', flex: 1}}>
                    {!loading &&                    
                        <FlatList
                            nestedScrollEnabled={true}
                            ref={flashListRef as any}                            
                            initialNumToRender={1}
                            ListHeaderComponent={<ChapterHeader chapter={chapter!} leftChapter={leftChapter} rightChapter={rightChapter} onReturn={onReturn} />}
                            data={images}                        
                            keyExtractor={(item: ChapterImage, index: number) => index.toString()}                            
                            renderItem={({item}) => <ManhwaImage image={item} />}/>
                    } 
                </View>
            </View>
            <Pressable onPress={scrollUp} hitSlop={AppConstants.hitSlopLarge} style={{position: 'absolute', bottom: 20, right: 10, padding: 6, borderRadius: 32, backgroundColor: "white"}} >
                <Ionicons name='arrow-up-outline' size={20} color={Colors.black} />
            </Pressable>
        </SafeAreaView>
    )
}

export default ChapterPage

const styles = StyleSheet.create({})