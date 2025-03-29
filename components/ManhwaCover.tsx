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
        <Pressable style={[{marginRight, marginBottom}, styleProp]} onPress={onPress} >
            <Image source={manhwa.cover_image_url} contentFit='cover' style={{width, height, borderRadius: 4}} />
            <View style={{position: 'absolute', left: 0, top: 0}} >
                <ManhwaStatusComponent status={manhwa.status} fontSize={12} paddingVertical={8} paddingHorizontal={6} />
            </View>
            <View style={styles.container} >
                <View style={{backgroundColor: Colors.clayDust, borderTopRightRadius: 4, paddingHorizontal: 10, borderBottomLeftRadius: 4, paddingVertical: 8}} >
                    <Text style={[AppStyle.textRegular, {color: "black", fontSize: 14}]}>{manhwa.title}</Text>
                </View>
            </View>            
        </Pressable>
    )
}

export default ManhwaCover

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        position: 'absolute',
        left: 0,
        bottom: 0
    }
})