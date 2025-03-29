import { Pressable, StyleSheet, Text, View } from 'react-native'
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
    <Pressable onPress={p} hitSlop={AppConstants.hitSlop} >
        <Ionicons name='arrow-back-outline' size={32} color={Colors.black}/>
    </Pressable>
    )
}

export default ReturnButton

const styles = StyleSheet.create({})