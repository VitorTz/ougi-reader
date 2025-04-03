import { StyleSheet, Pressable, Text } from 'react-native'
import { ManhwaAuthor } from '@/models/ManhwaAuthor'
import { AppStyle } from '@/style/AppStyles'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import React from 'react'


interface AuthorComponentProps {
    author: ManhwaAuthor
    color?: string
}

const AuthorComponent = ({
    author, 
    color = Colors.accentColor
}: AuthorComponentProps) => {
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
                  backgroundColor: color,
                  alignSelf: 'flex-start'}} >
              <Text style={AppStyle.textRegular}>{`${author.role}: ${author.name}`}</Text>
          </Pressable>
      )
}

export default AuthorComponent

const styles = StyleSheet.create({})