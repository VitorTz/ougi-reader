import { View, StatusBar } from 'react-native'
import { Colors } from '@/constants/Colors'
import Toast from '@/components/Toast'
import { Stack } from 'expo-router'
import React from 'react'


const _layout = () => {
  return (    

      <View style={{flex: 1, backgroundColor: Colors.backgroundColor}} >
        <StatusBar hidden={true} backgroundColor={Colors.backgroundColor} />
        <Stack>
            <Stack.Screen name='index' options={{headerShown: false}} />
            <Stack.Screen name='pages/ManhwaPage' options={{headerShown: false}} />
            <Stack.Screen name='pages/ChapterPage' options={{headerShown: false}} />
            <Stack.Screen name='pages/ManhwaByGenre' options={{headerShown: false}} />
            <Stack.Screen name='pages/ManhwaByAuthor' options={{headerShown: false}} />
            <Stack.Screen name='pages/ManhwaSearch' options={{headerShown: false}} />
            <Stack.Screen name='pages/LatestReleasesPage' options={{headerShown: false}} />
            <Stack.Screen name='pages/MostViewPage' options={{headerShown: false}} />
            <Stack.Screen name='pages/RandomManhwaPage' options={{headerShown: false}} />
            <Stack.Screen name='pages/AccountPage' options={{headerShown: false}} />
            <Stack.Screen name='pages/Home' options={{headerShown: false}} />
            <Stack.Screen name='(auth)/SignInPage' options={{headerShown: false}} />  
            <Stack.Screen name='(auth)/SignUpPage' options={{headerShown: false}} />
            <Stack.Screen name='pages/ReadingHistoryPage' options={{headerShown: false}} />  
            <Stack.Screen name='pages/LibrayPage' options={{headerShown: false}} />  
        </Stack>
        <Toast.Component/>
      </View>
  )
}

export default _layout