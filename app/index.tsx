import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect } from 'react'
import { wp } from '@/helpers/util'
import TopBar from '@/components/TopBar'
import ManhwaLastUpdatedComponent from '@/components/ManhwaLastUpdatedComponent'
import ManhawasMostViewComponent from '@/components/ManhwasMostViewComponent'
import { Colors } from '@/constants/Colors'
import { GlobalContext } from '@/helpers/context'
import { router, useFocusEffect } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { AppConstants } from '@/constants/AppConstants'
import { AppStyle } from '@/style/AppStyles'
import GenresGrid from '@/components/GenresGrid'
import ManhwaRandomComponent from '@/components/ManhwaRandomComponent'


const index = () => {
  
  const context = useContext(GlobalContext)

  useFocusEffect(
    useCallback(() => {      
      context.manhwa = null
      context.chapters = null,
      context.chapter_index = null
    }, [])
  )

  const searchPress = () => {
    router.navigate("/pages/ManhwaSearch")
  }

  const openMenu = () => {

  }

  return (
    <SafeAreaView style={AppStyle.safeArea}>
      <TopBar title='Ougi Reader'>
        <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "center", gap: 20}} >
          <Pressable onPress={searchPress} hitSlop={AppConstants.hitSlopLarge} >
            <Ionicons name='search-outline' size={28} color={Colors.black} />
          </Pressable>
          <Pressable onPress={openMenu} hitSlop={AppConstants.hitSlopLarge} >
            <Ionicons name='options-outline' size={28} color={Colors.black} />
          </Pressable>
        </View>
      </TopBar>
      <ScrollView style={{width: '100%'}} >
        <View style={{flex: 1, gap: 20}}>
          <GenresGrid/>
          <ManhwaLastUpdatedComponent/>
          <ManhawasMostViewComponent/>
          <ManhwaRandomComponent/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}



export default index

const styles = StyleSheet.create({})