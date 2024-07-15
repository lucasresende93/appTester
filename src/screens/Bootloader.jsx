import { View, Text, Button } from 'react-native'
import React from 'react'



const Bootloader = () => {



    const handleCheckforUpdates = () => {
      alert('Checando atualizações...')
    }

  return (
    <View>
      <Button title="Checar Update"
      onPress={handleCheckforUpdates} />
    </View>
  )
}

export default Bootloader