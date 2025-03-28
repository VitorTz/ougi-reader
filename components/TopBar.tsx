import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppStyle } from '@/style/AppStyles'


interface TopBarProps {
    title: string
    children?: React.JSX.Element
}

const TopBar = ({title, children}: TopBarProps) => {
  return (
    <View style={{width: '100%', flexDirection: 'row', marginVertical: 20, alignItems: "center", justifyContent: "space-between"}} >
        <Text style={[AppStyle.textHeader, {alignSelf: "flex-start"}]}>{title}</Text>
        {children}
    </View>
  )
}

export default TopBar

const styles = StyleSheet.create({})