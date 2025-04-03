import { 
    StyleSheet, 
    TextInput, 
    Text, 
    View, 
    Pressable, 
    ActivityIndicator,
    Keyboard
 } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AppStyle } from '@/style/AppStyles'
import { useAuthState, useManhwaCommentsState } from '@/helpers/store'
import { ManhwaComment } from '@/helpers/types'
import { fetchManhwaComments, insertComment } from '@/lib/supabase'
import { hp } from '@/helpers/util'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Colors } from '@/constants/Colors'
import Toast from './Toast'
import { Image } from 'expo-image'


interface ManhwaCommentsProps {
    manhwa_id: number
}


const CommentComponent = ({comment}: {comment: ManhwaComment}) => {

    const iconSize = 64

    return (
        <View style={styles.comment} >
            {
                comment.image_url ?
                <Image source={comment.image_url} style={{width: iconSize, height: iconSize, borderRadius: iconSize}} /> :
                <Ionicons name='person-circle-outline' size={iconSize} color={Colors.white}/>
            }
            <View>
                <Text numberOfLines={1} style={[AppStyle.textRegular, {fontSize: 20, color: Colors.orange}]}>{comment.username}</Text>
                <Text style={AppStyle.textRegular}>{comment.comment}</Text>
            </View>
        </View>
    )
}


const CommentTextInput = ({manhwa_id, sendComment}: {manhwa_id: number, sendComment: (text: string) => void}) => {

    const { session, username, image_url } = useAuthState()
    const { addComment } = useManhwaCommentsState()
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState('')

    const inputRef = useRef<TextInput>()

    const clearInput = () => {
        inputRef.current?.clear()
    }


    const onSend = async () => {
        setLoading(true)
        await sendComment(text)
        clearInput()
        setLoading(false)
    }
    
    return (
        <View style={{width: '100%', gap: 10}} >
            <TextInput
                ref={inputRef as any}
                onChangeText={setText}
                placeholderTextColor={'white'}
                placeholder='add a comment'
                multiline={true}
                style={styles.input}
            />
            <View style={{flexDirection: 'row', gap: 10, alignItems: "center", justifyContent: "center", alignSelf: "flex-end"}} >
                <Pressable onPress={clearInput} style={{padding: 7, borderRadius: 4, backgroundColor: Colors.gray}}>
                    <Ionicons name='close' size={32} color={'white'} />
                </Pressable>
                <Pressable onPress={onSend} style={{padding: 10, borderRadius: 4, backgroundColor: Colors.gray}}>
                    {
                        loading ? 
                        <ActivityIndicator size={26} color={'white'} /> :
                        <Ionicons name='send' size={26} color={'white'} />
                    }
                </Pressable>
            </View>
        </View>
    )
}

const ManhwaComments = ({manhwa_id}: ManhwaCommentsProps ) => {

    const { username, image_url, session } = useAuthState()
    const { commentsMap, addComment, addCommentList } = useManhwaCommentsState()
    const [comments, setComments] = useState<ManhwaComment[]>([])

    const init = async () => {
        if (commentsMap.has(manhwa_id)) {
            setComments(commentsMap.get(manhwa_id)!)
        } else {
            await fetchManhwaComments(manhwa_id)
                .then(values => {
                    addCommentList(manhwa_id, values)
                    setComments([...values])
                })
        }
    }

    const sendComment = async (text: string) => {
        Keyboard.dismiss()
        if (!session) {
            Toast.show({title: 'Error', message: 'You are not logged!', type: 'error'})
            return 
        }        
        const comment_id: number | null = await insertComment(manhwa_id, session!.user.id, text)
        if (comment_id != null) {
            const newComment: ManhwaComment = {
                comment: text, 
                comment_id, 
                parent_comment_id: null,
                user_id: session.user.id, 
                image_url: image_url,
                username: username!, 
                created_at: new Date().toDateString(),
                thread: []
            }
            addComment(manhwa_id, newComment)
            setComments(prev => [...[newComment], ...prev])
        }
    }

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )

    return (
        <View style={styles.container}>
            <Text style={AppStyle.textHeader}>Comments</Text>            
            <CommentTextInput manhwa_id={manhwa_id} sendComment={sendComment} />
            {
            comments.map((item: ManhwaComment, index: number) => 
                <CommentComponent 
                    key={index} 
                    comment={item} />
            )
            }
        </View>
    )
}

export default ManhwaComments

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 10
    },
    input: {
        width: '100%', 
        height: hp(20),         
        borderRadius: 4, 
        backgroundColor: Colors.gray,
        fontSize: 16,
        paddingHorizontal: 10, 
        color: 'white',
        textAlignVertical: 'top',
        fontFamily: 'LeagueSpartan_400Regular'
    },
    comment: {
        width: '100%', 
        gap: 10,
        paddingHorizontal: 10, 
        paddingVertical: 10,
        backgroundColor: Colors.gray,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "flex-start"
    }
})