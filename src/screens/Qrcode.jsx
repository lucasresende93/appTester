import { View, Text, StyleSheet, Alert, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { useBluetoothContext } from '../utils/hook/bluetooth'
import { serverRoutes } from '../server/server-routes'



const sync = ['54', '46', '53', '49']


const Qrcode = ({ navigation }) => {
  const date = new Date();
  const [data, setData] = useState('');
  const [qrData, setQrData] = useState([]);
  const [bgColor, setBgColor] = useState('#fff');
  const [deviceInfo, setDeviceInfo] = useState({});

  const [lines, setLines] = useState([]);

  const { sendDataToDevice, connectedDevice, receivedData } = useBluetoothContext()

  const handleQRCodeScanned = ({ data }) => {
    const lines = data.trim().split('\n').map(line => line.trim());
    const dataObject = {
      Modelo: lines[0] || '',
      Hardware: lines[1] || '',
      Lote: lines[2] || '',
      'Serial Number': lines[3] || '',
      Index: lines[3].slice(10, 14) || '',
    };
    setQrData(dataObject);
    setBgColor('#94ba1d');
    setData(data);
  };


  const sendToServer = async (data) => {
    console.log("sendToServer", data);
    try {
      const reply = await serverRoutes.updateTraceDevice(data)

      console.log(reply);
      if (reply.request?.status == 201) {
        Alert.alert("Sucesso", "Peça cadastrada com sucesso.")
      }


    } catch (error) {
      if (reply.request.status == 400) {
        Alert.alert("Error", "Peça ja cadastrada no servidor pagina qr code.")
      }
      else
        Alert.alert("Error", "Ocorreu um erro inesperado.")
    }
  }


  useEffect(() => {

    if (!data)
      return

    const lines = data.trim().split('\n').map(line => line.trim());

    setLines(lines);

    const deviceInfo = {
      modelNumber: lines[0].split(''),
      hardware: lines[1].split(''),
      batch: lines[2].split(''),
      serialNumber: lines[3].substring(0, 10).split(''),
      index: lines[3].substring(10).padStart(4, '0').split(''),
    };

    const { serialNumber, index } = deviceInfo;
    deviceInfo.senhaBTE = [serialNumber[4], serialNumber[5], ...index].join('');


    deviceInfo.uniqueId = [
      serialNumber[4],
      serialNumber[5],
      serialNumber[6],
      serialNumber[7],
      index[2],
      index[3]];

    setDeviceInfo(deviceInfo);

    const convertToHexArray = (charArray) => {
      return charArray.map(char => char.charCodeAt(0).toString(16));
    };



    const hexDeviceInfo = {
      modelNumber: convertToHexArray(deviceInfo.modelNumber),
      hardware: convertToHexArray(deviceInfo.hardware),
      batch: convertToHexArray(deviceInfo.batch),
      serialNumber: convertToHexArray(deviceInfo.serialNumber),
      senhaBTE: convertToHexArray(deviceInfo.senhaBTE.split('')),
      index: convertToHexArray(deviceInfo.index),
      uniqueId: convertToHexArray(deviceInfo.uniqueId),
    };

    console.log("HexDeviceInfo", hexDeviceInfo);


    let arrayToSend = [].concat(
      hexDeviceInfo.modelNumber,
      hexDeviceInfo.batch,
      hexDeviceInfo.serialNumber,
      hexDeviceInfo.index,
      hexDeviceInfo.hardware,
      hexDeviceInfo.senhaBTE,
      hexDeviceInfo.uniqueId

    )

    arrayToSend.unshift('54', '46', '53', '49', '2B');

    let sumTotal = arrayToSend.reduce((sum, hex) => sum + parseInt(hex, 16), 0);

    let messageCrc = (0xff - (sumTotal & 0xff) + 1);


    arrayToSend = [...arrayToSend, messageCrc.toString(16)];
    sendDataToDevice(arrayToSend);
  }, [data])



  const handleReceivedData = (data) => {
    //  console.log("handleReceivedData", data);
    if (data[0] == '85' &&
      data[1] == '88' &&
      data[2] == '83' &&
      data[3] == '83' &&
      data[4] == '4' &&
      Object.keys(deviceInfo).length !== 0) {

      const edited = data.map((index) => {
        return String.fromCharCode(index)
      })
      // console.log("DATA", data);
      // console.log("DEVICE INFO: ", deviceInfo);


      let versionSoftware = edited.join('.').substring(10)

      const deviceInfoString = {
        model: (deviceInfo.modelNumber.join('')),
        hardwareVersion: (deviceInfo.hardware.join('.')),
        batch: (deviceInfo.batch.join('')),
        serialNumber: (deviceInfo.serialNumber.join('')),
        index: (deviceInfo.index.join(''))
      };

      deviceInfoString.softwareVersionInit = versionSoftware;
      deviceInfoString.softwareVersionCurrent = versionSoftware;
      deviceInfoString.manufacturerPasswordBTE = [deviceInfoString.serialNumber[4],
      deviceInfoString.serialNumber[5],
      ...deviceInfoString.index].join('');

      sendToServer(deviceInfoString);
      setData('');
    }
  }



  useEffect(() => {
    // console.log('useEffect chamado', receivedData);
    if (receivedData === null) return;
    handleReceivedData(receivedData)
  }, [receivedData])


  useEffect(() => {
    if (bgColor === '#94ba1d') {
      const timer = setTimeout(() => {
        setBgColor('#fff');
      }, 500); // Adjust the duration of the green flash as needed

      return () => clearTimeout(timer);
    }
  }, [bgColor]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

      <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}> Posicione o Qrcode no centro da tela</Text>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 50 }}>
        <QRCodeScanner
          onRead={handleQRCodeScanned}
          reactivateTimeout={2000}
          reactivate={true}
          showMarker={true}
          bottomContent={
            <Text style={{
              fontSize: 15,
              padding: 10,
              color: '#000',
              backgroundColor: bgColor,
              width: 250,
              height: 130
            }}>
              Dados do QR code:{'\n'}
              {Object.keys(qrData).map(key => (
                <Text key={key} style={{ fontSize: 15, fontWeight: 'bold', color: 'black' }}>
                  {`${key}: ${qrData[key]}`}{'\n'}
                </Text>
              ))}
            </Text>
          }
        />

      </View>
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