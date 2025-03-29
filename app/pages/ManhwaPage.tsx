import { 
    StyleSheet, 
    ScrollView, 
    SafeAreaView, 
    Text, 
    View, 
    Pressable
} from 'react-native'
import { wp } from '@/helpers/util'
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



const Item = ({text}: {text: string}) => {    
    return (
        <View style={{
            paddingHorizontal: 10, 
            paddingVertical: 12, 
            borderRadius: 4, 
            backgroundColor: Colors.orange,
            alignSelf: 'flex-start'
            
        }} >
            <Text style={AppStyle.textRegular}>{text}</Text>
        </View>
    )
}


const GenresGrid = ({manhwa_id}: {manhwa_id: number}) => {
    const context = useContext(GlobalContext)
    const [genres, setGenres] = useState<string[]>([])
    
    const init = async () => {    
        await fetchManhwaGenres(manhwa_id, context.manhwa_genres)
            .then(values => setGenres([...values]))        
    }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )
    return (
        <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}} >
            {
                genres.map(item => <GenreComponent key={item} genre={item} />)
            }
        </View>
    )
}

const AuthorItem = ({author}: {author: ManhwaAuthor}) => {

    const onPress = () => {
        router.navigate({
            pathname: "/pages/ManhwaByAuthor", 
            params: {author_name: author.name, author_id: author.author_id, author_role: author.role}})
    }

    return (
        <Pressable 
            onPress={onPress}
            style={{
                paddingHorizontal: 10, 
                paddingVertical: 12, 
                borderRadius: 4, 
                backgroundColor: Colors.orange,
                alignSelf: 'flex-start'}} >
            <Text style={AppStyle.textRegular}>{`${author.role}: ${author.name}`}</Text>
        </Pressable>
    )
}

const AuthorsGrid = ({manhwa_id}: {manhwa_id: number}) => {
    const context = useContext(GlobalContext)
    const [authors, setAuthors] = useState<ManhwaAuthor[]>([])
    
    const init = async () => {        
        await fetchManhwaAuthors(manhwa_id, context.manhwa_authors)
            .then(values => setAuthors([...values]))
    }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )
    return (
        <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}} >
            {
                authors.map(item => <AuthorItem key={item.name} author={item} />)
            }
        </View>
    )
}


const ManhwaInfo = ({manhwa}: {manhwa: Manhwa}) => {

    const dt = new Date(manhwa.updated_at).toISOString()?.split('T')[0]

    return (
        <View style={{alignSelf: 'flex-start', gap: 10}}>
            <View style={{flexDirection: 'row', gap: 10}} >
                <ManhwaStatusComponent status={manhwa.status} />
                <Item text={`last update: ${dt}`} />
            </View>
            <GenresGrid manhwa_id={manhwa.manhwa_id} />
            <AuthorsGrid manhwa_id={manhwa.manhwa_id} />
        </View>
    )
}


const ManhwaPage = () => {
    
    const context = useContext(GlobalContext)    
    const manhwa: Manhwa = context.manhwa!
    
    const onReturn = () => {
        context.manhwa = null
        router.back()
    }

    return (
        <SafeAreaView style={{width: '100%', flex: 1, padding: wp(5), backgroundColor: "white"}}>
            <View style={{marginVertical: 20, gap: 20}} >
                <View style={{alignSelf: 'flex-end', marginRight: 10}} >
                    <ReturnButton onPress={onReturn}/>
                </View>
            </View>
            <ScrollView style={{width: '100%'}} >
                <View style={{flex: 1, gap: 20, alignItems: "center"}}>
                    <Image source={manhwa.cover_image_url} style={{width: 300, height: 420, borderRadius: 4}} />                    
                    <Text style={[AppStyle.textHeader, {alignSelf: 'flex-start'}]}>{manhwa.title}</Text>
                    <Text style={[AppStyle.textRegular, {alignSelf: 'flex-start'}]}>{manhwa.descr}</Text>
                    <ManhwaInfo manhwa={manhwa}/>
                    <ChapterList manhwa_id={manhwa.manhwa_id} />
                </View> 
            </ScrollView>
        </SafeAreaView>
    )
}

export default ManhwaPage

const styles = StyleSheet.create({})