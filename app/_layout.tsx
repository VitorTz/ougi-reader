import { View, StatusBar } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { GlobalContext } from '@/helpers/context'
import Toast from '@/components/Toast'


const _layout = () => {
  return (    
    <GlobalContext.Provider value={{
        manhwa: null,
        chapters: null,
        chapter_index: null,
        chapter_images: new Map(),
        chapter_readed: new Set(),
        manhwa_genres: new Map(),
        manhwa_authors: new Map(),
        manhwa_by_author: new Map(),
        manhwa_alt_titles: new Map(),
        manhwa_queries: new Map(),
        genres: new Set(),
        user_bookmarks: new Map(),
        session: null,
        most_view_manhwas: {mawnhas: [], last_update: null},
        last_update_manhwas: {mawnhas: [], last_update: null},
        random_manhwas: {mawnhas: [], last_update: null},
        user: null,
        manhwa_rating: new Map()
    }} >
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
            <Stack.Screen name='pages/BookmarkPage' options={{headerShown: false}} />  
            <Stack.Screen name='pages/ReadingHistoryPage' options={{headerShown: false}} />  
        </Stack>
        <Toast.Component/>
      </View>
    </GlobalContext.Provider>
  )
}

export default _layout