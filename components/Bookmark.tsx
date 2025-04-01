import { Pressable, ActivityIndicator } from "react-native"
import { useCallback, useContext, useEffect, useState } from "react"
import { fetchBookmarkStatus, getSession } from "@/lib/supabase"
import Ionicons from "@expo/vector-icons/Ionicons"
import { GlobalContext } from "@/helpers/context"
import { Manhwa } from "@/models/Manhwa"
import { Colors } from "@/constants/Colors"
import Toast from "./Toast"
import { useFocusEffect } from "expo-router"


interface BookmarkProps {
    manhwa: Manhwa
    size?: number
}

const Bookmark = ({manhwa, size = 20}: BookmarkProps) => {

    const context = useContext(GlobalContext)
    const [status, setStatus] = useState(context.user_bookmarks.has(manhwa.manhwa_id))
    const [loading, setLoading] = useState(false)    
    const iconName = status == true ? 'bookmark' : 'bookmark-outline'
        
    useFocusEffect(
        useCallback(() => {
            setStatus(context.user_bookmarks.has(manhwa.manhwa_id))
        }, [context.user_bookmarks, manhwa.manhwa_id])
    )


    const addOrRemoveFromContext = (status: boolean) => {
        status ?
            context.user_bookmarks.set(manhwa.manhwa_id, manhwa) :
            context.user_bookmarks.delete(manhwa.manhwa_id)
    }
    
    const toggleBookmark = async () => {        
        const session = await getSession()
        if (!session) {
            Toast.show({title: "Error", message: "You are not logged", type: "error"})
            return
        }
        setLoading(true)
        await fetchBookmarkStatus(manhwa.manhwa_id)
            .then(value => {
                if (value != null) {
                        setStatus(value)
                        addOrRemoveFromContext(value!)
                    }
                }
            )
        setLoading(false)
    }

    return (
        <Pressable 
            onPress={toggleBookmark}
            style={{                
                padding: 8,
                backgroundColor: Colors.accentColor,
                borderRadius: 32
            }} >
            {
                loading ?
                <ActivityIndicator size={size} color={Colors.white} /> :
                <Ionicons name={iconName} size={size} color={Colors.white}/>
            }
        </Pressable>
    )
}

export default Bookmark;