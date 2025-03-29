import { StyleSheet, Pressable, Text, View } from 'react-native'
import { Colors } from '@/constants/Colors'
import { AppStyle } from '@/style/AppStyles'
import { router } from 'expo-router'
import React from 'react'
import { ManhwaAuthor } from '@/models/ManhwaAuthor'


const AuthorComponent = ({author}: {author: ManhwaAuthor}) => {
  const onPress = () => {
          router.navigate({
              pathname: "/pages/ManhwaByAuthor", 
              params: {author_name: author.name, author_id: author.author_id, author_role: author.role}})
      }
  
      return (
          <Pressable 
              onPress={onPress}
              style={{
                  paddingHorizontal: 10, 
                  paddingVertical: 12, 
                  borderRadius: 4, 
                  backgroundColor: Colors.clayDust,
                  alignSelf: 'flex-start'}} >
              <Text style={AppStyle.textRegular}>{`${author.role}: ${author.name}`}</Text>
          </Pressable>
      )
}

export default AuthorComponent

const styles = StyleSheet.create({})