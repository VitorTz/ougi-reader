import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { AppStyle } from '@/style/AppStyles'
import CloseBtn from './CloseBtn'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Colors } from '@/constants/Colors'


interface LateralMenuProps {
    closeMenu: () => void
}

const iconColor = Colors.white

const LateralMenu = ({closeMenu}: LateralMenuProps) => {
  return (
    <View style={styles.container} >
        <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "space-between", marginBottom: 30}} >
            <Text style={AppStyle.textHeader}>Menu</Text>
            <CloseBtn onPress={closeMenu} style={{padding: 2}} />
        </View>
        <Pressable style={styles.link} >
            <Text style={AppStyle.textRegular}>Account</Text>
            <Ionicons name='person-outline' size={20} color={iconColor} />
        </Pressable>
        <Pressable style={styles.link} >
            <Text style={AppStyle.textRegular}>Bookmarks</Text>
            <Ionicons name='bookmarks-outline' size={20} color={iconColor} />
        </Pressable>
        <Pressable style={styles.link} >
            <Text style={AppStyle.textRegular}>Random read</Text>
            <Ionicons name='book-outline' size={20} color={iconColor} />
        </Pressable>
        <Pressable style={styles.link} >
            <Text style={AppStyle.textRegular}>Read history</Text>
            <Ionicons name='reader-outline' size={20} color={iconColor} />
        </Pressable>
        <Pressable onPress={() => Linking.openURL("https://github.com/VitorTz/ougi-reader")} style={styles.link} >
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
        gap: 30,
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