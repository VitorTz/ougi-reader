import { 
  Animated,
  Pressable, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  View } from 'react-native'
import React, {     
    useState, 
    useRef,     
} from 'react'
import ManhwaLastReleasesComponent from '@/components/ManhwaLastUpdatedComponent'
import MostViewedManhwasComponent from '@/components/ManhwasMostViewComponent'
import ManhwaRandomComponent from '@/components/ManhwaRandomComponent'
import { AppConstants } from '@/constants/AppConstants'
import Ionicons from '@expo/vector-icons/Ionicons'
import LateralMenu from '@/components/LateralMenu'
import GenresGrid from '@/components/GenresGrid'
import { AppStyle } from '@/style/AppStyles'
import { Colors } from '@/constants/Colors'
import TopBar from '@/components/TopBar'
import { router } from 'expo-router'
import { wp } from '@/helpers/util'


const Home = () => {
  
  const [menuVisible, setMenuVisible] = useState(false)  
  const menuWidth = wp(60)
  const menuAnim = useRef(new Animated.Value(-menuWidth)).current  

  const searchPress = () => {
    router.navigate("/pages/ManhwaSearch")
  }
  
  const openMenu = () => {
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 500,      
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
        <TopBar title='Ougi Reader'>
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
            <ManhwaLastReleasesComponent/>
            <MostViewedManhwasComponent/>
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
    </SafeAreaView>
  )
}

export default Home;

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