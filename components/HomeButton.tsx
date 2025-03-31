import { Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { AppConstants } from '@/constants/AppConstants'
import { router } from 'expo-router'


const HomeButton = () => {
  return (
    <Pressable 
      onPress={() => router.replace('/')} 
      hitSlop={AppConstants.hitSlopLarge} 
      style={styles.container} >
        <Ionicons name='home' size={20} color={Colors.white} />
    </Pressable>
  )
}

export default HomeButton

const styles = StyleSheet.create({
  container: {
    padding: 7, 
    borderRadius: 32, 
    backgroundColor: Colors.accentColor
  }
})