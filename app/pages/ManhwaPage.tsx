import { 
    StyleSheet, 
    ScrollView, 
    SafeAreaView, 
    Text, 
    View
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import ReturnButton from '@/components/ReturnButton'
import { GlobalContext } from '@/helpers/context'
import { Manhwa } from '@/models/Manhwa'
import { Image } from 'expo-image'
import { AppStyle } from '@/style/AppStyles'
import ChapterList from '@/components/ChapterList'
import { Colors } from '@/constants/Colors'
import { fetchManhwaAuthors, fetchManhwaGenres } from '@/lib/supabase'
import GenreComponent from '@/components/GenreComponent'
import { ManhwaAuthor } from '@/models/ManhwaAuthor'
import AuthorComponent from '@/components/AuthorComponent'
import { formatTimestamp, hp, wp } from '@/helpers/util';
import Item from '@/components/Item';
import HomeButton from '@/components/HomeButton';
import Bookmark from '@/components/Bookmark';
import ManhwaRating from '@/components/ManhwaRating';
import AddToLibrary from '@/components/AddToLibrary';


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
            <View style={{flexDirection: 'row', gap: 10}} >                
                <Item text={manhwa.status} backgroundColor={Colors.orange}/>
                <Item text={`Updated at: ${formatTimestamp(manhwa.updated_at)}`}/>
            </View>
            <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}} >
                {
                    genres.map(item => <GenreComponent key={item} genre={item}/>)
                }
                {
                    authors.map(item => <AuthorComponent key={item.name} author={item}/>)
                }
            </View>
        </View>
    )
}


const ManhwaPage = () => {
    
    const context = useContext(GlobalContext)    
    const manhwa: Manhwa = context.manhwa!

    return (
        <SafeAreaView style={[AppStyle.safeArea, {padding: 0}]}>
            <ScrollView style={{flex: 1}} >                
                <LinearGradient 
                    colors={[manhwa.color, Colors.backgroundColor]} 
                    style={styles.linearBackground} />

                <View style={{marginVertical: 10, flexDirection: 'row', alignItems: "center", justifyContent: "space-between", padding: wp(5)}} >
                    <HomeButton/>
                    <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "center", gap: 20}} >
                        <Bookmark manhwa={manhwa}/>
                        <ReturnButton/>
                    </View>
                </View>

                <View style={{width: '100%', gap: 20, alignItems: "center", paddingHorizontal: wp(5), paddingBottom: hp(8)}}>
                    <Image source={manhwa.cover_image_url} style={{width: '100%', maxWidth: 380, height: 480, borderRadius: 4}} />
                    <Text style={[AppStyle.textHeader, {alignSelf: 'flex-start'}]}>{manhwa.title}</Text>
                    <ManhwaRating manhwa={manhwa} />
                    <Text style={[AppStyle.textHeader, {alignSelf: 'flex-start'}]}>Summary</Text>
                    <Text style={[AppStyle.textRegular, {alignSelf: 'flex-start'}]}>{manhwa.descr}</Text>
                    <ManhwaInfo manhwa={manhwa} />
                    <AddToLibrary manhwa={manhwa} />
                    <ChapterList manhwa_id={manhwa.manhwa_id} />
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default ManhwaPage

const styles = StyleSheet.create({
    linearBackground: {
        position: 'absolute',
        width: wp(100),
        left: 0,
        right: 0,
        top: 0,
        height: hp(80)
    }
})