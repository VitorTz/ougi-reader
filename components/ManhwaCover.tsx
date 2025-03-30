import { Falsy, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { Manhwa } from '@/models/Manhwa'
import { Image } from 'expo-image';
import React, { useContext } from 'react'
import { AppConstants } from '@/constants/AppConstants';
import { AppStyle } from '@/style/AppStyles';
import { router } from 'expo-router';
import { GlobalContext } from '@/helpers/context';
import { updateManhwaViews } from '@/lib/supabase';
import ManhwaStatusComponent from './ManhwaStatusComponent';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';


interface ManhwaCoverProps {
    manhwa: Manhwa
}


const coverWidth: number = AppConstants.ManhwaCoverDimension.width
const coverHeight: number = AppConstants.ManhwaCoverDimension.height


interface ManhwaCoverProps {
    manhwa: Manhwa
    width?: number
    height?: number
    marginRight?: number
    marginBottom?: number
    styleProp?: StyleProp<ViewStyle>
}

const borderRadius = 22

const ManhwaCover = ({
    manhwa, 
    width = coverWidth, 
    height = coverHeight, 
    marginRight = 10,
    marginBottom = 0,
    styleProp = false
}: ManhwaCoverProps) => {

    const context = useContext(GlobalContext)    

    const onPress = () => {
        updateManhwaViews(manhwa.manhwa_id)
        context.manhwa = manhwa
        router.navigate("/pages/ManhwaPage")
    }

    return (
        <Pressable style={[{width, marginRight, marginBottom}, styleProp]} onPress={onPress} >
            <Image source={manhwa.cover_image_url} contentFit='cover' style={[styles.image, {width, height}]} />
            <View style={[styles.container, {backgroundColor: manhwa.color}]} >
                <Text style={[AppStyle.textRegular, {fontSize: 20}]}>{manhwa.title}</Text>
            </View>
        </Pressable>
    )
}

export default ManhwaCover

const styles = StyleSheet.create({
    image: {        
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
        borderCurve: "continuous"
    },
    container: {
        padding: 10,
        borderBottomLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
        width: '100%',        
        gap: 10,
        borderTopWidth: 2,
        borderColor: Colors.backgroundColor
    }
})