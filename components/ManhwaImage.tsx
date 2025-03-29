import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { hp, wp } from '@/helpers/util'
import { ChapterImage } from '@/models/Image'

interface ManhwaImageProps {
    image: ChapterImage
}

const width = wp(100)

const ManhwaImage = ({image}: ManhwaImageProps) => {

    const height = width * (image.height / image.width)

    return (
        <Image
            source={image.image_url}
            style={{width, height}}
            contentFit='cover'
        />
    )
}

export default ManhwaImage

const styles = StyleSheet.create({})