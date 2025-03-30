import { Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { AppConstants } from '@/constants/AppConstants'
import { router } from 'expo-router'


const HomeButton = () => {
  return (
    <Pressable onPress={() => router.replace('/')} hitSlop={AppConstants.hitSlopLarge} style={{padding: 6, borderRadius: 32, backgroundColor: Colors.black}} >
        <Ionicons name='home' size={22} color={'white'} />
    </Pressable>
  )
}

export default HomeButton

const styles = StyleSheet.create({})