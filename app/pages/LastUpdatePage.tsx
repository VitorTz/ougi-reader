import { StyleSheet, Text, SafeAreaView, View } from 'react-native'
import TopBar from '@/components/TopBar'
import ReturnButton from '@/components/ReturnButton'
import { wp } from '@/helpers/util'
import SearchBar from '@/components/SearchBar'
import { AppStyle } from '@/style/AppStyles'
import ManhwaGrid from '@/components/ManhwaGrid'
import React, { useState } from 'react'
import { Manhwa } from '@/models/Manhwa'

const LastUpdatePage = () => {

    const [manhwas, setManhwas] = useState<Manhwa[]>([])

    return (
    <SafeAreaView style={AppStyle.safeArea}>
        <TopBar title="Last Update">
            <ReturnButton/>
        </TopBar>
        <ManhwaGrid manhwas={manhwas} gap={10} paddingHorizontal={wp(5)} />        
    </SafeAreaView>
    )
}

export default LastUpdatePage

const styles = StyleSheet.create({})