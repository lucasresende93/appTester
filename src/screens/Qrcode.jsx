import { View, Text, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import { useBluetoothContext } from '../utils/hook/bluetooth'



const sync = ['54', '46', '53', '49']
// const syncNumber = [84, 70, 83, 73]
// checksum 'FC'





const Qrcode = ({ navigation }) => {

  const [data, setData] = useState('');

  const { sendDataToDevice, connectedDevice } = useBluetoothContext()

  const handleQRCodeScanned = ({ data }) => {
    setData(data);
    alert(data);
    // console.log(data);
  };


  useEffect(() => {

    if (!data)
      return

    const lines = data.trim().split('\n').map(line => line.trim());

    const deviceInfo = {
      modelNumber: lines[0].split(''),
      hardware: lines[1].split(''),
      batch: lines[2].split(''),
      serialNumber: lines[3].substring(0, 10).split(''),
      index: lines[3].substring(10).padStart(4, '0').split(''),
    };


    deviceInfo.senhaBTE =
      deviceInfo.serialNumber[4] +
      deviceInfo.serialNumber[5] +
      deviceInfo.index[0] +
      deviceInfo.index[1] +
      deviceInfo.index[2] +
      deviceInfo.index[3]



    const convertToHexArray = (charArray) => {
      return charArray.map(char => char.charCodeAt(0).toString(16));
    };


    const hexDeviceInfo = {
      modelNumber: convertToHexArray(deviceInfo.modelNumber),
      hardware: convertToHexArray(deviceInfo.hardware),
      batch: convertToHexArray(deviceInfo.batch),
      serialNumber: convertToHexArray(deviceInfo.serialNumber),
      senhaBTE: convertToHexArray(deviceInfo.senhaBTE.split('')), // Converte senhaBTE para hexadecimais
      index: convertToHexArray(deviceInfo.index),
    };


    let arrayToSend = [].concat(
      hexDeviceInfo.modelNumber,
      hexDeviceInfo.batch,
      hexDeviceInfo.serialNumber,
      hexDeviceInfo.index,
      hexDeviceInfo.hardware,
      hexDeviceInfo.senhaBTE,

    )

    const hexToAscii = (hexArray) => {
      return hexArray.map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
    };
    console.log('ArrayToSend', hexToAscii(arrayToSend));
    arrayToSend.unshift('54', '46', '53', '49', '25');

    let sumTotal = arrayToSend.reduce((sum, hex) => sum + parseInt(hex, 16), 0);
    let messageCrc = (0xff - (sumTotal & 0xff) + 1);


    arrayToSend = [...arrayToSend, messageCrc.toString(16)];



    console.log(hexToAscii(arrayToSend))
    sendDataToDevice(arrayToSend);

  }, [data])

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

      <Button
        title="Run Bootloader"
        onPress={() => navigation.navigate('Bootloader')}
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