import { StyleSheet, Text, View } from 'react-native'
import { AppStyle } from '@/style/AppStyles'
import { Colors } from '@/constants/Colors'
import React from 'react'

interface ManhwaStatusComponentProps {
    status: string
    fontSize?: number
    paddingVertical?: number
    paddingHorizontal?: number    
    borderRadius?: number
    borderLeftTopRadius?: number
}

const ManhwaStatusComponent = ({
    status,
    fontSize = 16,
    paddingVertical = 12,
    paddingHorizontal = 10,
    borderRadius = 0
}: ManhwaStatusComponentProps) => {
    return (
        <View style={{
            paddingHorizontal, 
            paddingVertical,
            borderRadius,
            borderTopLeftRadius: 4,            
            borderBottomRightRadius: 4,
            backgroundColor: Colors.clayDust,
            alignSelf: 'flex-start'
            
        }} >
            <Text style={[AppStyle.textRegular, {fontSize}]}>{status}</Text>
        </View>
    )
}

export default ManhwaStatusComponent

const styles = StyleSheet.create({})