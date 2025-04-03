import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { useReadingHistoryState, useReadingStatusState, useAuthState } from '@/helpers/store';
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
import { AppStyle } from '@/style/AppStyles';
import { hp, wp } from '@/helpers/util';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { GlobalContext } from '@/helpers/context';
import { fetchUser, fetchUserManhwaReadingStatus, getSession, fetchUserReadingHistory } from '@/lib/supabase';



const index = () => {
  
  const { setReadingStatus } = useReadingStatusState()
  const { setReadingHistory  } = useReadingHistoryState()
  const { login } = useAuthState()  

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

  const init = async () => {
    const session = await getSession()
    const user = await fetchUser()
    login(user?.username, user?.image_url, session)
    
    await fetchUserReadingHistory()
        .then(value => setReadingHistory(value))

    await fetchUserManhwaReadingStatus()
        .then(value => setReadingStatus(value))
        
    router.replace("/pages/Home")
  }

  useEffect(
    () => {
      if (fontsLoaded) {
        init()
      }
    },
    [fontsLoaded]
  )

  return (
    <SafeAreaView style={AppStyle.safeArea} >
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <ActivityIndicator size={48} color={Colors.white}/>
      </View>
    </SafeAreaView>
  )
}

export default index

const styles = StyleSheet.create({})