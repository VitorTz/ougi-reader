import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Manhwa } from '@/models/Manhwa'
import { AppStyle } from '@/style/AppStyles'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Colors } from '@/constants/Colors'
import DropDownPicker from 'react-native-dropdown-picker'
import { wp } from '@/helpers/util'
import { GlobalContext } from '@/helpers/context'
import { fetchManhwaReadingStatus, upsertManhwaRating, upsertManhwaReadingStatus } from '@/lib/supabase'
import { AppConstants } from '@/constants/AppConstants'

interface AddToLibraryProps {
    manhwa: Manhwa
}


const AddToLibrary = ({manhwa}: {manhwa: Manhwa}) => {

    const context = useContext(GlobalContext)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string>()
    const [items, setItems] = useState(AppConstants.READING_STATUS.map((v) => {return {label: v, value: v}}))
    
    const handlePress = async (v: any) => {
        if (v != context.manhwa_reading_status.get(v)) {
            console.log("add")
            await upsertManhwaReadingStatus(manhwa.manhwa_id, v)
            context.manhwa_reading_status.set(manhwa.manhwa_id, v)
        }
    }

    const init = async () => {
        if (context.manhwa_reading_status.has(manhwa.manhwa_id)) {
            setValue(context.manhwa_reading_status.get(manhwa.manhwa_id)!)
        } else {
            await fetchManhwaReadingStatus(manhwa.manhwa_id)
                .then(v => {
                    const s = v ? v : 'None'
                    setValue(s)
                    context.manhwa_reading_status.set(manhwa.manhwa_id, s)
                })
        }
    }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )

    return (
    <View style={styles.container} >
        <Text numberOfLines={1} style={AppStyle.textHeader} >Reading Status: {value ?  value : 'None'}</Text>
        <DropDownPicker        
            open={open}
            style={{backgroundColor: Colors.orange, width: 200, borderWidth: 0}}
            containerStyle={{width: 200}}
            disabledStyle={{opacity: 0.5}}                             
            items={items}
            setOpen={setOpen}
            theme='DARK'
            listMode={'SCROLLVIEW'}        
            value={value}
            setValue={setValue}
            setItems={setItems}
            mode='SIMPLE'
            badgeProps={{activeOpacity: 0.5}}            
            placeholder={'Reading Status'}
            textStyle={AppStyle.textRegular}
            min={0}
            onChangeValue={(value: any) => handlePress(value)}
            dropDownContainerStyle={{backgroundColor: Colors.gray}}/>
    </View>
  )
}

export default AddToLibrary

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 10
    },
    addToLibraryButton: {
        width: '50%',
        height: 52,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center"        
    }
})