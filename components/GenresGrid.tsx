import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { fetchGenres } from '@/lib/supabase'
import { AppStyle } from '@/style/AppStyles'
import { router } from 'expo-router'
import { Colors } from '@/constants/Colors'
import Item from './Item'
import { useManhwaGenresState } from '@/helpers/store'


const GenresGrid = () => {

    const { genres, setGenres } = useManhwaGenresState()

    const init = async () => {
        if (genres.length != 0) {
            return
        }
        await fetchGenres()
            .then(values => setGenres(values))
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
                    backgroundColor={Colors.accentColor}
                    style={{marginRight: 6}}/>}
                horizontal={true}
            />
        </View>
    )
}

export default GenresGrid

const styles = StyleSheet.create({
    
})