import { StyleSheet, SafeAreaView, Text, View, Pressable } from 'react-native'
import TopBar from '@/components/TopBar'
import { AppStyle } from '@/style/AppStyles'
import ReturnButton from '@/components/ReturnButton'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Manhwa } from '@/models/Manhwa'
import { fetchUserCompleteReadingHistory } from '@/lib/supabase'
import { AppConstants } from '@/constants/AppConstants'
import { Image } from 'expo-image'
import { hp, wp } from '@/helpers/util'
import { Chapter } from '@/models/Chapter'
import { FlashList } from '@shopify/flash-list'
import ChapterLink from '@/components/ChapterLink'
import { router } from 'expo-router'
import { useReadingState } from '@/helpers/store'


const width = 160
const height = width * (AppConstants.ManhwaCoverDimension.height / AppConstants.ManhwaCoverDimension.width)

const ChapterLinkGroup = ({chapters, manhwa}: {chapters: Chapter[] | null, manhwa: Manhwa}) => {
    return (
        <View style={{ gap: 10}} >
            {
                chapters?.map(
                    (item, index) => 
                        <ChapterLink 
                            prefix='' 
                            chapter={item} 
                            style={{width: 46, height: 36, marginRight: 10, alignItems: "center", justifyContent: "center"}} 
                            key={index} 
                            manhwa={manhwa} 
                            shouldShowChapterDate={false}/>
                )
            }
        </View>
    )
}

const ReadingHistoryItem = ({manhwa}: {manhwa: Manhwa}) => {
    
    const { setManhwa } = useReadingState()
    
    const chapterGroupList: Chapter[][] = []
    const numChapterInGroup = 4
    let group: Chapter[] = []
    let index = 0

    manhwa.chapters?.forEach(item => {
        if (index % numChapterInGroup == 0) {
            chapterGroupList.push(group)
            group = [item]
        } else {
            group.push(item)
        }
        index += 1
    })

    if (group.length != 0) {
        chapterGroupList.push(group)
    }

    const onPress = () => {
        setManhwa(manhwa)
        router.navigate("/pages/ManhwaPage")
    }

    return (
        <View            
            style={{width: '100%', backgroundColor: manhwa.color, borderRadius: 20, flexDirection: 'row', gap: 10, marginBottom: 20}} >
            <Pressable onPress={onPress}>
                <Image source={manhwa.cover_image_url} style={{width, height, borderRadius: 20, borderTopRightRadius: 0, borderBottomRightRadius: 0}} />
            </Pressable>
            <View style={{width: wp(43), gap: 10, height: height}} >
                <Text numberOfLines={1} style={[AppStyle.textHeader, {fontSize: 22, color: 'black'}]}>{manhwa.title}</Text>
                <FlashList
                    data={chapterGroupList}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    estimatedItemSize={200}
                    renderItem={({item}) => <ChapterLinkGroup chapters={item} manhwa={manhwa} />}
                />                
            </View>
        </View>
    )
}

const ReadingHistoryPage = () => {

    const [manhwas, setManhwas] = useState<Manhwa[]>()

    const init  = async () => {
        await fetchUserCompleteReadingHistory()
            .then(values => setManhwas([...values]))
    }    

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )

    return (
    <SafeAreaView style={AppStyle.safeArea}>
        <TopBar title="Reading History">
            <ReturnButton/>
        </TopBar>
        <View style={{flex: 1, paddingBottom: hp(2)}} >
            <FlashList
                data={manhwas}
                keyExtractor={(item, index) => index.toString()}
                estimatedItemSize={height * 2}
                renderItem={({item}) => <ReadingHistoryItem manhwa={item} />}
            />
        </View>
    </SafeAreaView>
    )
}

export default ReadingHistoryPage

const styles = StyleSheet.create({})