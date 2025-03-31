import { 
  ActivityIndicator,
  Animated,   
  Pressable, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  View } from 'react-native'
import React, { useCallback, useState, useRef, useContext } from 'react'
import TopBar from '@/components/TopBar'
import ManhwaLastUpdatedComponent from '@/components/ManhwaLastUpdatedComponent'
import MostViewedManhwasComponent from '@/components/ManhwasMostViewComponent'
import { Colors } from '@/constants/Colors'
import { GlobalContext } from '@/helpers/context'
import { router, useFocusEffect } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { AppConstants } from '@/constants/AppConstants'
import { AppStyle } from '@/style/AppStyles'
import GenresGrid from '@/components/GenresGrid'
import ManhwaRandomComponent from '@/components/ManhwaRandomComponent'
import LateralMenu from '@/components/LateralMenu'
import { wp } from '@/helpers/util'
import {
  useFonts,
  LeagueSpartan_100Thin,
  LeagueSpartan_200ExtraLight,
  LeagueSpartan_300Light,
  LeagueSpartan_400Regular,
  LeagueSpartan_500Medium,
  LeagueSpartan_600SemiBold,
  LeagueSpartan_700Bold,
  LeagueSpartan_800ExtraBold,
  LeagueSpartan_900Black,
} from '@expo-google-fonts/league-spartan';


const index = () => {

  let [fontsLoaded] = useFonts({
    LeagueSpartan_100Thin,
    LeagueSpartan_200ExtraLight,
    LeagueSpartan_300Light,
    LeagueSpartan_400Regular,
    LeagueSpartan_500Medium,
    LeagueSpartan_600SemiBold,
    LeagueSpartan_700Bold,
    LeagueSpartan_800ExtraBold,
    LeagueSpartan_900Black,
  });
  
  const context = useContext(GlobalContext)

  // Menu lateral
  const [menuVisible, setMenuVisible] = useState(false)  
  const menuWidth = wp(60)
  const menuAnim = useRef(new Animated.Value(-menuWidth)).current

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
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false
    }).start()
    setMenuVisible(true)
  }
  
  const closeMenu = () => {
    Animated.timing(menuAnim, {
      toValue: -menuWidth,
      duration: 300,
      useNativeDriver: false
    }).start(() => {
      setMenuVisible(false)
    })
  }  

  const toggleMenu = () => {
    menuVisible ? closeMenu() : openMenu()
  }

  return (
    <SafeAreaView style={AppStyle.safeArea}>
      {
        !fontsLoaded ? 
        <ActivityIndicator size={32} color={'white'} /> :
        <>
          <TopBar title='Manhwa Reader'>
            <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "center", gap: 20}} >
              <Pressable onPress={searchPress} hitSlop={AppConstants.hitSlopLarge} >
                <Ionicons name='search-outline' size={28} color={'white'} />
              </Pressable>
              <Pressable onPress={toggleMenu} hitSlop={AppConstants.hitSlopLarge} >
                <Ionicons name='options-outline' size={28} color={'white'} />
              </Pressable>
            </View>
          </TopBar>
          <ScrollView style={{width: '100%'}} >
            <View style={{flex: 1, gap: 20}}>
              <GenresGrid/>
              <MostViewedManhwasComponent/>
              <ManhwaLastUpdatedComponent/>
              <ManhwaRandomComponent/>
            </View>
          </ScrollView>
          {/* Menu Lateral */}
          {
          menuVisible && (
            <Animated.View style={[styles.sideMenu, { width: menuWidth, transform: [{ translateX: menuAnim }] }]}>
              <LateralMenu closeMenu={closeMenu}/>
            </Animated.View>
          )
          }
        </>
        }
    </SafeAreaView>
  )
}

export default index;

const styles = StyleSheet.create({
  sideMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,        
    backgroundColor: Colors.backgroundColor,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,    
    zIndex: 100
  }
})