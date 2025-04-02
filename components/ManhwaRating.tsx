import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { fetchManhwaRating, fetchManhwaRatingExcludingUser, fetchUserManhwaRating, upsertManhwaRating } from '@/lib/supabase'
import { Rating } from '@kolking/react-native-rating';
import { GlobalContext } from '@/helpers/context';
import { Manhwa } from '@/models/Manhwa';
import Toast from './Toast';
import { Colors } from '@/constants/Colors';
import { AppStyle } from '@/style/AppStyles';


interface ManhwaRankingProps {
    manhwa: Manhwa
}

type RatingState = {
    rating: number
    totalRatings: number
    userRating: number | null
}

const ManhwaRating = ({manhwa}: ManhwaRankingProps) => {

    const context = useContext(GlobalContext)    
    const [rating, setRating] = useState<RatingState>({rating: 0, totalRatings: 0, userRating: null})    
    const [loading, setLoading] = useState(false)
    const manhwa_id = manhwa.manhwa_id

    const handleChange = useCallback(
        async (value: number) => {
            
            if (context.session == null) {
                Toast.show({title: 'Error', message:'You are not logged!', type: 'error'})
                return
            }

            setLoading(true)
            setRating(prev => {
                let newTotal = prev.totalRatings
                let newRating = prev.rating
                if (prev.userRating == null) {
                    newTotal += 1
                    newRating = ((prev.totalRatings * prev.rating) + value) / newTotal
                } else {
                    const sum = prev.totalRatings * prev.rating
                    const sumDiff = sum - prev.userRating
                    const newSum = sumDiff + value
                    newRating = newSum / prev.totalRatings
                }
                const newRatingState = {
                    totalRatings: newTotal,
                    userRating: value,
                    rating: newRating
                }
                context.manhwa_rating.set(manhwa_id, newRatingState)
                return newRatingState
            })
            await upsertManhwaRating(manhwa_id, value)
            setLoading(false)

        },
        [rating],
    );

    const init = async () => {  
        if (context.manhwa_rating.has(manhwa_id)) {
            setRating(context.manhwa_rating.get(manhwa_id)!)
            return
        }

        const manhwaRating = await fetchManhwaRating(manhwa_id)
        const userRating = await fetchUserManhwaRating(manhwa_id)
        const rtn: RatingState = {...manhwaRating, userRating}
        setRating(rtn)
        context.manhwa_rating.set(manhwa_id, rtn)
    }    

    useEffect(
        useCallback(() => {
            init()
        }, []),
        []
    )

    return (
        <View style={{width: '100%', alignItems: "flex-start"}} >
            {
                loading ? 
                <ActivityIndicator size={26} color={Colors.white} /> :
                <View style={{gap: 10}} >
                    <View style={{flexDirection: 'row', gap: 20, alignItems: "center", justifyContent: "center"}} >
                        <Rating touchColor={manhwa.color} size={26} rating={rating.rating} onChange={handleChange} />
                        <Text style={AppStyle.textRegular} >{rating.rating}/{rating.totalRatings} ratings</Text>
                    </View>
                    {rating.userRating && <Text style={AppStyle.textRegular}>Your rating: {rating.userRating}</Text>}
                </View>
            }
        </View> 
    )
}

export default ManhwaRating

const styles = StyleSheet.create({})