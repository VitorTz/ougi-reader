import { 
    StyleSheet, 
    Platform,
    ScrollView, 
    SafeAreaView, 
    Text, 
    View,
    KeyboardAvoidingView
} from 'react-native'
import { 
    useMangaAuthorsState, 
    useManhwaGenreState, 
    useReadingState 
} from '@/helpers/store';
import React, { useCallback, useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import ReturnButton from '@/components/ReturnButton'
import { Manhwa } from '@/models/Manhwa'
import { Image } from 'expo-image'
import { AppStyle } from '@/style/AppStyles'
import ChapterList from '@/components/ChapterList'
import { Colors } from '@/constants/Colors'
import { fetchManhwaAuthors, fetchManhwaGenres, updateManhwaViews } from '@/lib/supabase'
import GenreComponent from '@/components/GenreComponent'
import { ManhwaAuthor } from '@/models/ManhwaAuthor'
import AuthorComponent from '@/components/AuthorComponent'
import { formatTimestamp, hp, wp } from '@/helpers/util';
import Item from '@/components/Item';
import HomeButton from '@/components/HomeButton';
import ManhwaRating from '@/components/ManhwaRating';
import AddToLibrary from '@/components/AddToLibrary';
import ManhwaComments from '@/components/ManhwaComments';


const ManhwaInfo = ({manhwa}: {manhwa: Manhwa}) => {

    const { authorsMap, addAuthor } = useMangaAuthorsState()
    const { genresMap, addGenre } = useManhwaGenreState()

    const [genres, setGenres] = useState<string[]>([])
    const [authors, setAuthors] = useState<ManhwaAuthor[]>([])

    const init = async () => {
        if (!authorsMap.has(manhwa.manhwa_id)) {
            await fetchManhwaAuthors(manhwa.manhwa_id)
                .then(values => {
                    addAuthor(manhwa.manhwa_id, values)
                    setAuthors([...values])
                })
        } else {
            setAuthors([...authorsMap.get(manhwa.manhwa_id)!])
        }        

        if (!genresMap.has(manhwa.manhwa_id)) {
            await fetchManhwaGenres(manhwa.manhwa_id)
                .then(values => {
                    addGenre(manhwa.manhwa_id, values)
                    setGenres([...values])
                })
        } else {
            setGenres([...genresMap.get(manhwa.manhwa_id)!])
        }

        updateManhwaViews(manhwa.manhwa_id)
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
    
    const { manhwa } = useReadingState()

    return (
        <SafeAreaView style={[AppStyle.safeArea, {padding: 0}]}>
            <KeyboardAvoidingView 
                style={{flex: 1}} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView 
                    style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps='always'>
                    <LinearGradient 
                        colors={[manhwa!.color, Colors.backgroundColor]} 
                        style={styles.linearBackground} />

                    <View style={{width: '100%', marginVertical: 10, flexDirection: 'row', alignItems: "center", justifyContent: "space-between", padding: wp(5)}} >
                        <HomeButton/>
                        <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "center", gap: 20}} >
                            <ReturnButton/>
                        </View>
                    </View>

                    <View style={{width: '100%', gap: 20, alignItems: "center", paddingHorizontal: wp(5), paddingBottom: hp(8)}}>
                        <Image source={manhwa!.cover_image_url} style={{width: '100%', maxWidth: 380, height: 480, borderRadius: 4}} />
                        <Text style={[AppStyle.textHeader, {alignSelf: 'flex-start'}]}>{manhwa!.title}</Text>
                        <ManhwaRating manhwa={manhwa!} />
                        <View style={{gap: 10, alignSelf: "flex-start"}} >
                            <Text style={[AppStyle.textHeader, {alignSelf: 'flex-start'}]}>Summary</Text>
                            <Text style={[AppStyle.textRegular, {alignSelf: 'flex-start'}]}>{manhwa!.descr}</Text>
                        </View>
                        <AddToLibrary manhwa={manhwa!} />
                        <ManhwaInfo manhwa={manhwa!} />
                        <ChapterList manhwa_id={manhwa!.manhwa_id} />

                        <ManhwaComments manhwa_id={manhwa!.manhwa_id}/>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
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