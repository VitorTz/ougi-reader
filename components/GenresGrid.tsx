import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { GlobalContext } from '@/helpers/context'
import { fetchGenres } from '@/lib/supabase'
import { AppStyle } from '@/style/AppStyles'
import { router } from 'expo-router'
import { Colors } from '@/constants/Colors'
import Item from './Item'


const GenreItem = ({genre}: {genre: string}) => {

    const onPress = () => {
        router.navigate({pathname: "/pages/ManhwaByGenre", params: {genre}})
    }

    return (
        <Pressable onPress={onPress} style={styles.item} >
            <Text style={[AppStyle.textRegular, {fontSize: 14, color: 'white'}]}>{genre}</Text>
        </Pressable>
    )
}

const GenresGrid = () => {

    const context = useContext(GlobalContext)
    const [genres, setGenres] = useState<string[]>([])

    const init = async () => {
        await fetchGenres(context.genres)
        setGenres([...Array.from(context.genres)])
    }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )
    
    return (
        <View style={{width: '100%', gap: 20, paddingVertical: 10}} >
            <Text style={AppStyle.textHeader}>Genres</Text>
            <FlatList
                data={genres}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => <Item 
                    text={item} 
                    onPress={() => router.navigate({pathname: "/pages/ManhwaByGenre", params: {genre: item}})} 
                    backgroundColor={Colors.gray}
                    style={{marginRight: 6}}/>}
                horizontal={true}
            />
        </View>
    )
}

export default GenresGrid

const styles = StyleSheet.create({
    item: {
        paddingHorizontal: 10, 
        paddingVertical: 12, 
        marginRight: 10, 
        backgroundColor: Colors.gray,
        alignItems: "center", 
        justifyContent: "center", 
        borderRadius: 4
    }
})