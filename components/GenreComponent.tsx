import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyles'
import React from 'react'
import { router } from 'expo-router'


const GenreComponent = ({genre}: {genre: string}) => {

    const onPress = () => {
        router.navigate({pathname: "/pages/ManhwaByGenre", params: {"genre": genre}})
    }

    return (
    <Pressable 
        onPress={onPress}
        style={{
            paddingHorizontal: 10, 
            paddingVertical: 12, 
            borderRadius: 4, 
            backgroundColor: Colors.clayDust,
            alignSelf: 'flex-start'}}>
        <Text style={AppStyle.textRegular}>{genre}</Text>
    </Pressable>
    )
}

export default GenreComponent

const styles = StyleSheet.create({})