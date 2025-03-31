import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ManhwaHorizontalGrid from './ManhwaHorizontalGrid'
import { Manhwa } from '@/models/Manhwa'

const RandomFooterGrid = ({manhwas}: {manhwas: Manhwa[]}) => {        

    return (
        <View style={styles.container} >
            <ManhwaHorizontalGrid  
                manhwas={manhwas}
                title='Sugestions'/>
        </View>
    )
}

export default RandomFooterGrid

const styles = StyleSheet.create({
    container: {
        width: '100%', 
        height: 400
    }
})