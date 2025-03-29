import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect } from 'react'
import { wp } from '@/helpers/util'
import TopBar from '@/components/TopBar'
import ManhwaLastUpdatedComponent from '@/components/ManhwaLastUpdatedComponent'
import ManhawasMostViewComponent from '@/components/ManhwasMostViewComponent'
import { Colors } from '@/constants/Colors'
import { GlobalContext } from '@/helpers/context'
import { useFocusEffect } from 'expo-router'


const index = () => {
  
  const context = useContext(GlobalContext)

  useFocusEffect(
    useCallback(() => {      
      context.manhwa = null
      context.chapters = null,
      context.chapter_index = null
    }, [])
  )

  return (
    <SafeAreaView style={{width: '100%', flex: 1, padding: wp(5), backgroundColor: Colors.backgroundColor}}>
      <TopBar title='Home'/>        
      <ScrollView style={{width: '100%'}} >
        <View style={{flex: 1, gap: 20}}>
          <ManhwaLastUpdatedComponent/>
          <ManhawasMostViewComponent/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}



export default index

const styles = StyleSheet.create({})