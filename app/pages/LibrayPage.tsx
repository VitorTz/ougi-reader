import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppStyle } from '@/style/AppStyles'
import TopBar from '@/components/TopBar'
import { Manhwa } from '@/models/Manhwa'
import ReturnButton from '@/components/ReturnButton'
import DropDownPicker from 'react-native-dropdown-picker'
import { useContext } from 'react'
import { GlobalContext } from '@/helpers/context'
import { useState } from 'react'
import { Colors } from '@/constants/Colors'
import { wp } from '@/helpers/util'
import { AppConstants } from '@/constants/AppConstants'
import ManhwaGrid from '@/components/ManhwaGrid'

const LibrayPage = () => {

    const context = useContext(GlobalContext)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string>('Reading')
    const [items, setItems] = useState(AppConstants.READING_STATUS.map((v) => {return {label: v, value: v}}))

    const [manhwa, setManhwas] = useState<Manhwa[]>([])

    const handlePress = async (v: any) => {

    }

    return (

    <SafeAreaView style={AppStyle.safeArea} >
        <TopBar title='Library' >
            <ReturnButton/>
        </TopBar>

        <View style={styles.container} >            
            <Text style={[AppStyle.textHeader, {color: Colors.orange}]}>{value ?  value : 'None'}</Text>
            <DropDownPicker        
                open={open}
                style={{backgroundColor: Colors.orange, width: 200, borderWidth: 0}}
                containerStyle={{width: 200}}
                disabledStyle={{opacity: 0.5}}                             
                items={items}
                setOpen={setOpen}
                theme='DARK'
                listMode={'FLATLIST'}        
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

        <ManhwaGrid
            manhwas={manhwa}
            numColumns={2}
            hasResults={true}
            
            />

    </SafeAreaView>
  )
}

export default LibrayPage

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 10
    }
})