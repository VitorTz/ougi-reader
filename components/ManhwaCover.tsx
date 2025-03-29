import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Manhwa } from '@/models/Manhwa'
import { Image } from 'expo-image';
import React, { useContext } from 'react'
import { AppConstants } from '@/constants/AppConstants';
import { AppStyle } from '@/style/AppStyles';
import { router } from 'expo-router';
import { GlobalContext } from '@/helpers/context';
import { updateManhwaViews } from '@/lib/supabase';
import ManhwaStatusComponent from './ManhwaStatusComponent';


interface ManhwaCoverProps {
    manhwa: Manhwa
}


const width: number = AppConstants.ManhwaCoverDimension.width
const height: number = AppConstants.ManhwaCoverDimension.height


const ManhwaCover = ({manhwa}: ManhwaCoverProps) => {

    const context = useContext(GlobalContext)

    const onPress = () => {
        updateManhwaViews(manhwa.manhwa_id)
        context.manhwa = manhwa
        router.navigate("/pages/ManhwaPage")
    }

    return (
        <Pressable style={{width, height}} onPress={onPress} >
            <Image source={manhwa.cover_image_url} contentFit='cover' style={{width, height, borderRadius: 4}} />
            <View style={styles.container} >
                <Text style={[AppStyle.textRegular, {color: "white"}]}>{manhwa.title}</Text>
            </View>
            <View style={{position: 'absolute', top: 10, right: 10}} >
                <ManhwaStatusComponent status={manhwa.status} fontSize={14} paddingVertical={8} paddingHorizontal={6} />
            </View>
        </Pressable>
    )
}

export default ManhwaCover

const styles = StyleSheet.create({
    container: {
        width, 
        position: 'absolute', 
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        padding: 10,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4
    }
})