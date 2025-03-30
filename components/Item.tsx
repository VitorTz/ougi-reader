import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React from 'react'
import { AppStyle } from '@/style/AppStyles'
import { Colors } from '@/constants/Colors'


interface ItemProps {
    text: string
    backgroundColor?: string
    style?: StyleProp<ViewStyle>
}

const Item = ({text, backgroundColor = Colors.accentColor, style}: ItemProps) => {
  return (
    <View style={[styles.container, {backgroundColor}, style]} >
      <Text style={AppStyle.textRegular}>{text}</Text>
    </View>
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