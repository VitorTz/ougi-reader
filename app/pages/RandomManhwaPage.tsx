import React, { useEffect, useCallback, useState, useRef } from 'react'
import { StyleSheet, View, SafeAreaView, Pressable, Animated, Easing } from 'react-native'
import { fetchRandomManhwa } from '@/lib/supabase'
import ReturnButton from '@/components/ReturnButton'
import ManhwaGrid from '@/components/ManhwaGrid'
import { AppStyle } from '@/style/AppStyles'
import { Manhwa } from '@/models/Manhwa'
import TopBar from '@/components/TopBar'
import { wp } from '@/helpers/util'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Colors } from '@/constants/Colors'
import { FlashList } from '@shopify/flash-list'

const RandomManhwaPage = () => {
  const [manhwas, setManhwas] = useState<Manhwa[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Valor animado para o giro
  const rotation = useRef(new Animated.Value(0)).current

  // Função que atualiza os manhwas
  const update = async () => {
    await fetchRandomManhwa().then(values => setManhwas([...values]))
  }

  // Função que dispara a animação de rotação
  const startRotation = () => {
    if (isAnimating) return // Impede recomeçar enquanto a animação estiver ocorrendo

    setIsAnimating(true)
    rotation.setValue(0) // Reinicia o valor de rotação
    Animated.timing(rotation, {
      toValue: 1, // Vai de 0 a 1 que será interpolado para 0° até 360°
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setIsAnimating(false)
    })
  }

  // Função que executa o update e a animação
  const handlePress = () => {
    startRotation()
    update()
  }

  useEffect(useCallback(() => {
    update()
  }, []), [])

  // Interpolação do valor de rotação para graus
  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })

  return (
    <SafeAreaView style={AppStyle.safeArea}>
      <TopBar title="Random Order">
        <View style={{ flexDirection: 'row', gap: 20, alignItems: "center", justifyContent: "center" }}>
          <Pressable onPress={handlePress} style={{ padding: 6, borderRadius: 32, backgroundColor: Colors.accentColor }}>
            <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
              <Ionicons name='reload-outline' size={20} color={Colors.white} />
            </Animated.View>
          </Pressable>
          <ReturnButton />
        </View>
      </TopBar>
      <ManhwaGrid 
        manhwas={manhwas} 
        gap={10} 
        paddingHorizontal={wp(5)} 
        shouldScrollToTopWhenManhwasChange={true} 
      />
    </SafeAreaView>
  )
}

export default RandomManhwaPage

const styles = StyleSheet.create({})
