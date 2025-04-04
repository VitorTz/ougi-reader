import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { AppConstants } from '@/constants/AppConstants'
import Ionicons from '@expo/vector-icons/Ionicons'
import { fetchRandomManhwa } from '@/lib/supabase'
import { useAuthState, useReadingState } from '@/helpers/store'
import { AppStyle } from '@/style/AppStyles'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import CloseBtn from './CloseBtn'
import React from 'react'
import LogoutButton from './LogoutButton'


interface LateralMenuProps {
    closeMenu: () => void
}

const iconColor = Colors.white
const iconSize = 26


const LateralMenu = ({closeMenu}: LateralMenuProps) => {

    const { session } = useAuthState()
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

    const loginPage = () => {
        closeMenu()
        router.navigate("/(auth)/SignInPage")
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

        {
            session ? 
            <Pressable 
                onPress={accountPage} 
                style={styles.link} 
                hitSlop={AppConstants.hitSlopLarge} >
                <Text style={AppStyle.textRegular}>Account</Text>
                <Ionicons name='person-outline' size={iconSize} color={iconColor} />
            </Pressable>
                :
            <Pressable 
                onPress={loginPage} 
                style={styles.link} 
                hitSlop={AppConstants.hitSlopLarge} >
                <Text style={AppStyle.textRegular}>Login</Text>
                <Ionicons name='log-in' size={iconSize} color={iconColor} />
            </Pressable>

        }

        <Pressable 
            onPress={libraryPage} 
            style={styles.link} 
            hitSlop={AppConstants.hitSlopLarge} >
            <Text style={AppStyle.textRegular}>Library</Text>
            <Ionicons name='library-outline' size={iconSize} color={iconColor} />
        </Pressable>        

        <Pressable 
            onPress={randomRead} 
            style={styles.link} 
            hitSlop={AppConstants.hitSlopLarge} >
            <Text style={AppStyle.textRegular}>Random Manhwa</Text>
            <Ionicons name='dice-outline' size={iconSize} color={iconColor} />
        </Pressable>

        <Pressable 
            onPress={readingHistoryPage}
            style={styles.link} 
            hitSlop={AppConstants.hitSlopLarge} >
            <Text style={AppStyle.textRegular}>Read history</Text>
            <Ionicons name='reader-outline' size={iconSize} color={iconColor} />
        </Pressable>

        <Pressable 
            onPress={() => Linking.openURL("https://github.com/VitorTz/ougi-reader")} 
            style={styles.link} 
            hitSlop={AppConstants.hitSlopLarge} >
            <Text style={AppStyle.textRegular}>Github</Text>
            <Ionicons name='logo-github' size={iconSize} color={iconColor} />
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