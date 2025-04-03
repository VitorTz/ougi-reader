import { ActivityIndicator, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { AppConstants } from '@/constants/AppConstants'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { supabase } from '@/lib/supabase'
import { useAuthState, useReadingHistoryState, useReadingStatusState } from '@/helpers/store'



const LogoutButton = ( ) => {

    const { logout } = useAuthState()    
    const { setReadingHistory } = useReadingHistoryState()
    const { setReadingStatus } = useReadingStatusState()
    const [loading, setLoading] = useState(false)

    const onPress = async () => {
        setLoading(true)
        await supabase.auth.signOut()
        logout()        
        setReadingHistory(new Set())
        setReadingStatus(new Map())
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