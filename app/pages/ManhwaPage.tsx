import { 
    StyleSheet, 
    ScrollView, 
    SafeAreaView, 
    Text, 
    View, 
    Pressable
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import ReturnButton from '@/components/ReturnButton'
import { GlobalContext } from '@/helpers/context'
import { Manhwa } from '@/models/Manhwa'
import { Image } from 'expo-image'
import { AppStyle } from '@/style/AppStyles'
import ChapterList from '@/components/ChapterList'
import { router } from 'expo-router'
import { Colors } from '@/constants/Colors'
import ManhwaStatusComponent from '@/components/ManhwaStatusComponent'
import { fetchManhwaAuthors, fetchManhwaGenres } from '@/lib/supabase'
import GenreComponent from '@/components/GenreComponent'
import { ManhwaAuthor } from '@/models/ManhwaAuthor'
import AuthorComponent from '@/components/AuthorComponent'
import { hp, wp } from '@/helpers/util';



const ManhwaInfo = ({manhwa}: {manhwa: Manhwa}) => {

    const context = useContext(GlobalContext)
    const [genres, setGenres] = useState<string[]>([])
    const [authors, setAuthors] = useState<ManhwaAuthor[]>([])

    const init = async () => {
        await fetchManhwaAuthors(manhwa.manhwa_id, context.manhwa_authors)
            .then(values => setAuthors([...values]))

        await fetchManhwaGenres(manhwa.manhwa_id, context.manhwa_genres)
            .then(values => setGenres([...values]))        
    }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )

    return (
        <View style={{alignSelf: 'flex-start', gap: 10}}>
            <ManhwaStatusComponent status={manhwa.status} borderRadius={4} />
            <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}} >
                {
                    genres.map(item => <GenreComponent key={item} genre={item} color={Colors.accentColor} />)
                }
                {
                    authors.map(item => <AuthorComponent key={item.name} author={item} color={Colors.accentColor} />)
                }
            </View>
        </View>
    )
}


const ManhwaPage = () => {
    
    const context = useContext(GlobalContext)    
    const manhwa: Manhwa = context.manhwa!
    
    const onReturn = () => {
        router.back()
    }

    return (
        <SafeAreaView style={[AppStyle.safeArea, {padding: 0}]}>
            <ScrollView style={{flex: 1}} >
                <LinearGradient
                    // Background Linear Gradient
                    colors={[manhwa.color, Colors.backgroundColor]}
                    style={styles.background}
                />
                <View style={{marginVertical: 10, alignSelf: "flex-end", padding: wp(5)}} >
                    <ReturnButton onPress={onReturn}/>                    
                </View>
                <View style={{flex: 1, gap: 20, alignItems: "center", paddingHorizontal: wp(5), paddingBottom: wp(8)}}>
                    <Image source={manhwa.cover_image_url} style={{width: 340, height: 480, borderRadius: 4}} />
                    <Text style={[AppStyle.textHeader, {alignSelf: 'flex-start'}]}>{manhwa.title}</Text>
                    <Text style={[AppStyle.textRegular, {alignSelf: 'flex-start'}]}>{manhwa.descr}</Text>
                    <ManhwaInfo manhwa={manhwa} />
                    <ChapterList manhwa_id={manhwa.manhwa_id} />
                </View> 
            </ScrollView>
        </SafeAreaView>
    )
}

export default ManhwaPage

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        width: wp(100),
        left: 0,
        right: 0,
        top: 0,
        height: hp(120)
    }
})