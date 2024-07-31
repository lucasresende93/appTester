import { View, Text } from 'react-native'
import React, { useEffect } from 'react'

const Simulador = () => {

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'whitesmoke' }}>
      <Text style={{
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 10
      }}> Tela Simulador</Text>
      <Text style={{
        color: 'black',
        fontSize: 15,
        padding: 10,
        borderRadius: 10
      }}> Em produção ⚠️ </Text>
    </View>
  )
}

export default Simulador