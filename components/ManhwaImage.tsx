import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'
import { hp, wp } from '@/helpers/util'
import { ChapterImage } from '@/models/Image'
import { Colors } from '@/constants/Colors'

interface ManhwaImageProps {
    image: ChapterImage
}


const MAX_WIDTH = Platform.OS === "web" ? wp(50) : wp(100)

const ManhwaImage = ({image}: ManhwaImageProps) => {

    const width = image.width < MAX_WIDTH ? image.width : MAX_WIDTH;
    const height = width * (image.height / image.width)
    const [loading, setLoading] = useState(false)    

    return (
        <View style={{width, height, alignSelf: "center"}} >
            <ActivityIndicator size={32} color={Colors.white} style={{top: 64, display: loading ? 'flex' : 'none'}} />
            <Image
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
                source={image.image_url}
                style={{width, height}}
                contentFit='cover'
            />
        </View>
    )
}

export default ManhwaImage

const styles = StyleSheet.create({})