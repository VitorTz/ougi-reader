import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { AppConstants } from '@/constants/AppConstants'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { GlobalContext } from '@/helpers/context'
import { supabase } from '@/lib/supabase'



const LogoutButton = ( ) => {

    const context = useContext(GlobalContext)
    const [loading, setLoading] = useState(false)

    const onPress = async () => {
        setLoading(true)
        await supabase.auth.signOut()
        context.user = null
        context.session = null
        context.user_bookmarks = new Set()        
        router.replace("/pages/Home")
        setLoading(false)
    }

    return (
        <Pressable onPress={onPress} hitSlop={AppConstants.hitSlop} style={{padding: 6, borderRadius: 32, backgroundColor: Colors.accentColor}} >
            {
                loading ? 
                <ActivityIndicator size={22} color={Colors.white} /> :
                <Ionicons name='log-out-outline' size={22} color={Colors.white}/>
            }
        </Pressable>
    )
}

export default LogoutButton

const styles = StyleSheet.create({})