import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React from 'react'
import { AppStyle } from '@/style/AppStyles'
import { Colors } from '@/constants/Colors'


interface ItemProps {
    text: string
    backgroundColor?: string
    style?: StyleProp<ViewStyle>
    onPress?: () => void
}

const Item = ({
  text, 
  backgroundColor = Colors.accentColor, 
  style, 
  onPress
}: ItemProps) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, {backgroundColor}, style]} >
      <Text style={AppStyle.textRegular}>{text}</Text>
    </Pressable>
  )
}

export default Item

const styles = StyleSheet.create({
    container: {        
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 4
    }
})