import { Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { AppConstants } from '@/constants/AppConstants'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { Colors } from '@/constants/Colors'


interface ReturnButtonProps {
    onPress?: () => void
}

const ReturnButton = ({onPress}: ReturnButtonProps) => {

    const p = onPress ? onPress : () => router.back()

    return (
        <Pressable onPress={p} hitSlop={AppConstants.hitSlop} style={{padding: 6, borderRadius: 32, backgroundColor: Colors.accentColor}} >
            <Ionicons name='arrow-back-outline' size={22} color={Colors.white}/>
        </Pressable>
    )
}

export default ReturnButton

const styles = StyleSheet.create({})