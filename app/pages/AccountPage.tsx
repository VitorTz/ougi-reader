import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import LogoutButton from '@/components/LogoutButton'
import React, { useCallback, useState } from 'react'
import { router, useFocusEffect } from 'expo-router'
import HomeButton from '@/components/HomeButton'
import { useAuthState } from '@/helpers/store'
import { AppStyle } from '@/style/AppStyles'
import { Colors } from '@/constants/Colors'
import TopBar from '@/components/TopBar'



const AccountPage = () => {

  const { username, session } = useAuthState()
  const [starting, setStarting] = useState(true)

  const init = async () => {
    if (session == null) {
      router.navigate("/(auth)/SignInPage")
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
              <Text style={[AppStyle.textRegular, {fontSize: 20}]}>{username ? username : ''}</Text>
            </View>
          </View>
        </>
      }
    </SafeAreaView>
  )
}

export default AccountPage

const styles = StyleSheet.create({})