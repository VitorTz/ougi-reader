import { View, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyles'
import { AppConstants } from '@/constants/AppConstants'



interface ReadingStatusPickerProps {
    onChangeValue: (v: any) => any
    placeholder?: string
    width?: number | string
    defaultStatus?: string,
    listMode?: 'SCROLLVIEW' | 'FLATLIST' | 'MODAL' | 'DEFAULT'
}


const ReadingStatusPicker = ({
    onChangeValue,
    placeholder = 'Reading Status',
    width = 200,
    defaultStatus = 'Reading',
    listMode = 'SCROLLVIEW'
}: ReadingStatusPickerProps) => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string>(defaultStatus)
    const [items, setItems] = useState(AppConstants.READING_STATUS.map((v) => {return {label: v, value: v}}))

    useEffect(
        () => {
            setValue(defaultStatus)
        },
        [defaultStatus]
    )

    return (
        <View style={styles.container} >
            <DropDownPicker        
                open={open}
                style={{backgroundColor: Colors.orange, width: width as any, borderWidth: 0}}
                containerStyle={{width: width as any}}
                disabledStyle={{opacity: 0.5}}                             
                items={items}
                setOpen={setOpen}
                theme='DARK'
                listMode={listMode}        
                value={value}
                setValue={setValue}
                setItems={setItems}
                mode='SIMPLE'
                badgeProps={{activeOpacity: 0.5}}            
                placeholder={placeholder}
                textStyle={AppStyle.textRegular}
                min={0}
                onChangeValue={onChangeValue}
                dropDownContainerStyle={{backgroundColor: Colors.gray}}/>
        </View>
    )

}

export default ReadingStatusPicker;


const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 10
    }  
})