import { StyleSheet, SafeAreaView, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import TopBar from '@/components/TopBar'
import ReturnButton from '@/components/ReturnButton'
import ManhwaGrid from '@/components/ManhwaGrid'
import { AppStyle } from '@/style/AppStyles'
import { GlobalContext } from '@/helpers/context'
import { wp } from '@/helpers/util'
import { Manhwa } from '@/models/Manhwa'

const BookmarkPage = () => {

    const context = useContext(GlobalContext)
    const [manhwas, setManhwas] = useState<Manhwa[]>([])

    return (
        <SafeAreaView style={AppStyle.safeArea}>
            <TopBar title="Most View ⚡">
                <ReturnButton/>
            </TopBar>            
            <ManhwaGrid 
                manhwas={manhwas} 
                gap={10}                
                paddingHorizontal={wp(5)}
                loading={false}
                hasResults={true}
                />    
        </SafeAreaView>
  )
}

export default BookmarkPage

const styles = StyleSheet.create({})