import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { fetchManhwaRating, fetchUserManhwaRating, upsertManhwaRating } from '@/lib/supabase'
import { Rating, RatingProps } from '@kolking/react-native-rating';
import { Manhwa } from '@/models/Manhwa';
import Toast from './Toast';
import { Colors } from '@/constants/Colors';
import { AppStyle } from '@/style/AppStyles';
import { RatingRegister } from '@/helpers/types';
import { useAuthState, useRatingState } from '@/helpers/store';


interface ManhwaRankingProps {
    manhwa: Manhwa
}


const ManhwaRating = ({manhwa}: ManhwaRankingProps) => {

    const { session } = useAuthState()
    const { ratingMap, addRating } = useRatingState()
    const [rating, setRating] = useState<RatingRegister>({rating: 0, totalRatings: 0, userRating: null})    
    const [loading, setLoading] = useState(false)
    const manhwa_id = manhwa.manhwa_id

    const handleChange = useCallback(
        async (value: number) => {
            
            if (session == null) {
                Toast.show({title: 'Error', message:'You are not logged!', type: 'error'})
                return
            }
            setLoading(true)

            const rat: RatingRegister = ratingMap.get(manhwa_id)!

            let newTotal = rat.totalRatings
            let newRating = rat.rating
            if (rat.userRating == null) {
                newTotal += 1
                newRating = ((rat.totalRatings * rat.rating) + value) / newTotal
            } else {
                const sum = rat.totalRatings * rat.rating
                const sumDiff = sum - rat.userRating
                const newSum = sumDiff + value
                newRating = newSum / rat.totalRatings
            }
            const newRatingState = {
                totalRatings: newTotal,
                userRating: value,
                rating: newRating
            }
            addRating(manhwa_id, newRatingState)
            setRating(newRatingState)

            await upsertManhwaRating(manhwa_id, value)
            setLoading(false)

        },
        [rating],
    );

    const init = async () => {
        if (ratingMap.has(manhwa_id)) {
            setRating(ratingMap.get(manhwa_id)!)
            setLoading(false)
            return
        }

        const mRating = await fetchManhwaRating(manhwa_id)
        const userRating = await fetchUserManhwaRating(manhwa_id)
        const rtn: RatingRegister = {...mRating, userRating}
        setRating(rtn)
        addRating(manhwa_id, rtn)
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