import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'


const Qrcode = () => {


  const [data, setData] = useState('');

  

  const handleQRCodeScanned = ({ data }) => {
    setData(data);
    alert(data);
    console.log(data);
  };

  return (
    <View style={{ flex: 1 }}>

      {data &&
        <>
          <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white' }}>Ultima Leitura</Text>
          <Text style={{ color: 'black', fontSize: 15, fontStyle: 'italic', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white' }}>{data}</Text>
        </>
      }

      <QRCodeScanner
        onRead={handleQRCodeScanned}
        reactivateTimeout={2000}
        reactivate={true}
        showMarker={true}

      />

    </View>
  )
}

export default Qrcode

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});