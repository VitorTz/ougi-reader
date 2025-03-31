import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AppStyle } from '@/style/AppStyles'
import { GlobalContext } from '@/helpers/context'
import { Colors } from '@/constants/Colors'
import { router, useFocusEffect } from 'expo-router'
import TopBar from '@/components/TopBar'
import HomeButton from '@/components/HomeButton'
import Ionicons from '@expo/vector-icons/Ionicons'
import LogoutButton from '@/components/LogoutButton'



const AccountPage = () => {

  const context = useContext(GlobalContext)
  const [starting, setStarting] = useState(true)

  const init = async () => {
    if (context.session == null) {
      router.navigate("/pages/SignPage")
    } else {
      setStarting(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      init()
    }, [])    
  )

  return (
    <SafeAreaView style={AppStyle.safeArea} >
      {
        starting ?
        <ActivityIndicator size={48} color={Colors.white} /> :
        <>
          <TopBar title='Account' >
            <View style={{flexDirection: 'row', gap: 20, alignItems: "center", justifyContent: "center"}} >
              <LogoutButton/>
              <HomeButton/>
            </View>
          </TopBar>
          <View style={{width: '100%', marginTop: 20, alignItems: "center", justifyContent: "center"}} >
            <View style={{gap: 10, alignItems: "center"}} >
              <Ionicons size={128} name='person-circle-outline' color={Colors.white} />
              <Text style={[AppStyle.textRegular, {fontSize: 20}]}>{context.user!.username}</Text>
            </View>
          </View>
        </>
      }
    </SafeAreaView>
  )
}

export default AccountPage

const styles = StyleSheet.create({})