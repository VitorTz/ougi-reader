import { StyleSheet, SafeAreaView, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
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

    useEffect(
        useCallback(() => {
            setManhwas([...Array.from(context.user_bookmarks.values())])
        }, []),
        []
    )

    return (
        <SafeAreaView style={AppStyle.safeArea}>
            <TopBar title="Bookmarks">
                <ReturnButton/>
            </TopBar>            
            <ManhwaGrid manhwas={manhwas} numColumns={2}/>
        </SafeAreaView>
  )
}

export default BookmarkPage

const styles = StyleSheet.create({})