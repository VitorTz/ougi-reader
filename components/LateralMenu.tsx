import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { AppStyle } from '@/style/AppStyles'
import CloseBtn from './CloseBtn'
import React, { useContext } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Colors } from '@/constants/Colors'
import { fetchRandomManhwa } from '@/lib/supabase'
import { router } from 'expo-router'
import { GlobalContext } from '@/helpers/context'
import { AppConstants } from '@/constants/AppConstants'
import { useReadingState } from '@/helpers/store'


interface LateralMenuProps {
    closeMenu: () => void
}

const iconColor = Colors.white



const LateralMenu = ({closeMenu}: LateralMenuProps) => {

    const { setManhwa } = useReadingState()

    const randomRead = async () => {
        const manhwaList = await fetchRandomManhwa(0, 1, 0)
        setManhwa(manhwaList[0])
        closeMenu()
        router.navigate({pathname: "/pages/ManhwaPage"})
    }

    const accountPage = () => {
        closeMenu()
        router.navigate("/pages/AccountPage")
    }

    const readingHistoryPage = () => {
        closeMenu()
        router.navigate("/pages/ReadingHistoryPage")
    }

    const libraryPage = () => {
        closeMenu()
        router.navigate("/pages/LibrayPage")
    }

    return (
    <View style={styles.container} >
        
        <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "space-between", marginBottom: 30}} >
            <Text style={AppStyle.textHeader}>Menu</Text>
            <CloseBtn onPress={closeMenu} style={{padding: 2}} />
        </View>

        <Pressable 
            onPress={accountPage} 
            style={styles.link} 
            hitSlop={AppConstants.hitSlopLarge} >
            <Text style={AppStyle.textRegular}>Account</Text>
            <Ionicons name='person-outline' size={20} color={iconColor} />
        </Pressable>

        <Pressable 
            onPress={libraryPage} 
            style={styles.link} 
            hitSlop={AppConstants.hitSlopLarge} >
            <Text style={AppStyle.textRegular}>Library</Text>
            <Ionicons name='library-outline' size={20} color={iconColor} />
        </Pressable>        

        <Pressable 
            onPress={randomRead} 
            style={styles.link} 
            hitSlop={AppConstants.hitSlopLarge} >
            <Text style={AppStyle.textRegular}>Random read</Text>
            <Ionicons name='book-outline' size={20} color={iconColor} />
        </Pressable>

        <Pressable 
            onPress={readingHistoryPage}
            style={styles.link} 
            hitSlop={AppConstants.hitSlopLarge} >
            <Text style={AppStyle.textRegular}>Read history</Text>
            <Ionicons name='reader-outline' size={20} color={iconColor} />
        </Pressable>

        <Pressable 
            onPress={() => Linking.openURL("https://github.com/VitorTz/ougi-reader")} 
            style={styles.link} 
            hitSlop={AppConstants.hitSlopLarge} >
            <Text style={AppStyle.textRegular}>Github</Text>
            <Ionicons name='logo-github' size={20} color={iconColor} />
        </Pressable>
    </View>
    )
}

export default LateralMenu

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 40,
        paddingVertical: 40,
        paddingHorizontal: 20
    },
    link: {
        width: '100%',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between"
    }
})