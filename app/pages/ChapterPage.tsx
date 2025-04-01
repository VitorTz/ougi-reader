import { 
    StyleSheet, 
    Text, 
    SafeAreaView, 
    View, 
    Pressable, 
    ActivityIndicator, 
    FlatList
} from 'react-native'
import React, { 
    useCallback, 
    useContext, 
    useEffect, 
    useRef, 
    useState 
} from 'react'
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerStateChangeEvent, State } from 'react-native-gesture-handler';
import { fetchChapterImages, fetchRandomManhwa, updateUserReadingHistory } from '@/lib/supabase'
import ManhwaHorizontalGrid from '@/components/ManhwaHorizontalGrid'
import { AppConstants } from '@/constants/AppConstants'
import ReturnButton from '@/components/ReturnButton'
import ManhwaImage from '@/components/ManhwaImage'
import Ionicons from '@expo/vector-icons/Ionicons'
import { GlobalContext } from '@/helpers/context'
import { ChapterImage } from '@/models/Image'
import { AppStyle } from '@/style/AppStyles'
import { Colors } from '@/constants/Colors'
import { Chapter } from '@/models/Chapter'
import { hp, wp } from '@/helpers/util'
import { router } from 'expo-router'
import { Manhwa } from '@/models/Manhwa'


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
    manhwas: Manhwa[]
    leftChapter: () => void
    rightChapter: () => void    
    loading: boolean
}

const ChapterPageFooter = ({chapter, manhwas, loading, leftChapter, rightChapter}: ChapterPageFooterProps) => {
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
            {
                !loading &&
                <View style={{width: '100%', height: 400}} >
                    <ManhwaHorizontalGrid  
                        manhwas={manhwas}
                        title='Sugestions'/>
                </View>
            }
        </View>
    )
}

const ChapterPage = () => {
    
    const context = useContext(GlobalContext)
    const [randomManhwas, setRandomManhwas] = useState<Manhwa[]>([])
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
        
        await fetchChapterImages(newChapter.chapter_id, context.chapter_images)
            .then(values => setImages([...values]))

        await updateUserReadingHistory(newChapter.chapter_id, context.manhwa!.manhwa_id)
            .then(value => value ? context.chapter_readed.add(newChapter.chapter_id) : null)

        if (randomManhwas.length == 0) {
            await fetchRandomManhwa(0, 13, 3)
                .then(values => setRandomManhwas([...values]))
        }

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

    return (                    
            <SafeAreaView style={[AppStyle.safeArea, {padding: 0}]}>                        
                <View style={{width: '100%'}} >
                    <FlatList
                        ref={flashListRef as any}
                        scrollEnabled={true}
                        ListHeaderComponent={
                            <ChapterPageHeader 
                                manhwa_name={context.manhwa!.title} 
                                chapter={chapter!} 
                                loading={loading} 
                                leftChapter={leftChapter} 
                                rightChapter={rightChapter} 
                                onReturn={onReturn} />
                        }
                        ListFooterComponent={
                            <ChapterPageFooter
                                loading={loading}
                                manhwas={randomManhwas} 
                                chapter={chapter!} 
                                leftChapter={leftChapter} 
                                rightChapter={rightChapter}/>
                        }
                        nestedScrollEnabled={true}
                        initialNumToRender={1}
                        data={images}
                        keyExtractor={(item: ChapterImage, index: number) => index.toString()}
                        renderItem={({item}) => <ManhwaImage image={item} />}/>
                </View>
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