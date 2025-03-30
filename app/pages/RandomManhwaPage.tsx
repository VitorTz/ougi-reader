import { StyleSheet, SafeAreaView } from 'react-native'
import { fetchRandomManhwa } from '@/lib/supabase'
import { useEffect, useCallback, useState } from 'react'
import ReturnButton from '@/components/ReturnButton'
import ManhwaGrid from '@/components/ManhwaGrid'
import { AppStyle } from '@/style/AppStyles'
import { Manhwa } from '@/models/Manhwa'
import TopBar from '@/components/TopBar'
import { wp } from '@/helpers/util'
import React from 'react'


const RandomManhwaPage = () => {
  const [manhwas, setManhwas] = useState<Manhwa[]>([])

  const init = async () => {
      await fetchRandomManhwa()
          .then(values => setManhwas([...values]))
  }

  useEffect(useCallback(() => {
      init()
  }, []), [])

  return (
      <SafeAreaView style={AppStyle.safeArea}>
          <TopBar title="Most View">
              <ReturnButton/>
          </TopBar>
          <ManhwaGrid manhwas={manhwas} gap={10} paddingHorizontal={wp(5)} />        
      </SafeAreaView>
  )
}

export default RandomManhwaPage

const styles = StyleSheet.create({})