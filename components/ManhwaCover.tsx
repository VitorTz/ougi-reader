import { 
    Pressable, 
    StyleProp, 
    StyleSheet, 
    Text, 
    View, 
    ViewStyle 
} from 'react-native'
import { Manhwa } from '@/models/Manhwa'
import { Image } from 'expo-image';
import React  from 'react'
import { AppConstants } from '@/constants/AppConstants';
import { AppStyle } from '@/style/AppStyles';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import ChapterLink from './ChapterLink';
import ManhwaStatusComponent from './ManhwaStatusComponent';
import { useReadingState } from '@/helpers/store';



interface ManhwaCoverProps {
    manhwa: Manhwa
    width?: number
    height?: number
    marginRight?: number
    marginBottom?: number
    styleProp?: StyleProp<ViewStyle>
    showChaptersPreview?: boolean
    shouldShowChapterDate?: boolean
}


const ManhwaCover = ({
    manhwa, 
    width = AppConstants.ManhwaCoverDimension.width, 
    height = AppConstants.ManhwaCoverDimension.height, 
    marginRight = 10,
    marginBottom = 0,
    styleProp = false,
    showChaptersPreview = true,
    shouldShowChapterDate = true    
}: ManhwaCoverProps) => {

    const { setManhwa } = useReadingState()

    const manhwaStatusColor = manhwa.status == "Completed" ? Colors.orange : Colors.backgroundColor

    const onPress = () => {
        setManhwa(manhwa)
        router.navigate("/pages/ManhwaPage")
    }    

    return (
        <Pressable style={[{width, marginRight, marginBottom}, styleProp]} onPress={onPress} >
            <Image 
                source={manhwa.cover_image_url} 
                contentFit='cover'
                style={[{borderRadius: 22, width, height}]}/>
            <View style={styles.container} >
                <Text numberOfLines={1} style={[AppStyle.textRegular, {fontSize: 20}]}>{manhwa.title}</Text>
                {
                    showChaptersPreview && 
                    manhwa.chapters && 
                    manhwa.chapters.map(
                        (item) => 
                            <ChapterLink 
                                shouldShowChapterDate={shouldShowChapterDate} 
                                key={item.chapter_num} 
                                manhwa={manhwa} 
                                chapter={item} />
                )}                
            </View>
            <ManhwaStatusComponent
                style={{position: 'absolute', left: 10, top: 10,}}
                status={manhwa.status}
                paddingHorizontal={10}
                paddingVertical={8}
                fontSize={12}
                backgroundColor={manhwaStatusColor}
                borderRadius={22}
            />
        </Pressable>
    )
}

export default ManhwaCover

const styles = StyleSheet.create({    
    container: {
        paddingVertical: 10,  
        width: '100%',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4        
    },
    shadow: {
        shadowColor: 'black',
        shadowOffset: { width: 8, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5    
    }
})