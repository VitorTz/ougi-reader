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
import { Comment } from '@/helpers/types'
import { fetchManhwaComments, insertComment } from '@/lib/supabase'
import { hp } from '@/helpers/util'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Colors } from '@/constants/Colors'
import Toast from './Toast'


interface ManhwaCommentsProps {
    manhwa_id: number
}


const CommentComponent = ({comment}: {comment: Comment}) => {
    return (
        <View style={{width: '100%'}} >
            <Text style={AppStyle.textRegular}>{comment.comment}</Text>
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
    const [comments, setComments] = useState<Comment[]>([])

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
            const newComment = {
                comment: text, 
                comment_id, 
                user_id: session.user.id, 
                image_url: image_url,
                username: username!, 
                created_at: new Date().toDateString()
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
            comments.map((item: Comment, index: number) => 
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
        borderWidth: 1, 
        borderRadius: 4, 
        fontSize: 16,
        paddingHorizontal: 10, 
        color: 'white',
        borderColor: 'white', 
        textAlignVertical: 'top',
        fontFamily: 'LeagueSpartan_400Regular'
    }
})