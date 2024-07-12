import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Bluetooth, BluetoothOff, Navigation, Play } from 'lucide-react-native'
import Tester from '../components/modal/tester'

import useBluetooth from '../utils/hook/bluetooth'

const cmdTestador = ['54', '46', '53', '73', '01', '01', '9E']
const cmdSimulador = ['54', '46', '53', '54', '01', '01', 'BD']
const cmdStartTest = ['54', '46', '53', '53', '01', '01', 'BE']

const Testador = ({ navigation }) => {

  const { startScan, sendDataToDevice, isScanning, receivedData, devices, connectToDevice, disconnectFromDevice, connectedDevice } = useBluetooth()

  const [injecao, setInjecao] = useState(false)
  const [ignicao, setIgnicao] = useState(false)
  const [RPM, setRPM] = useState(false)
  const [TPS, setTPS] = useState(false)
  const [temperatura, setTemperatura] = useState(false)
  const [periferico, setPeriferico] = useState(false)
  const [marcha, setMarcha] = useState(false)


  useEffect(() => {
    if (connectedDevice)
      sendDataToDevice(cmdTestador)
  }, [connectedDevice])


  useEffect(() => {
    if (receivedData) {
      handleReceivedData(receivedData)
    }
  }, [receivedData])

  const handleReceivedData = (data) => {

    data[5] === 1 ? setInjecao(true) : setInjecao(false)
    data[6] === 1 ? setIgnicao(true) : setIgnicao(false)
    data[7] === 1 ? setRPM(true) : setRPM(false)
    data[8] === 1 ? setTPS(true) : setTPS(false)
    data[9] === 1 ? setTemperatura(true) : setTemperatura(false)
    data[10] === 1 ? setPeriferico(true) : setPeriferico(false)

  }

  const handleInitTest = () => {
    sendDataToDevice(cmdStartTest);
    setInjecao(false);
    setIgnicao(false);
    setRPM(false);
    setTPS(false);
    setTemperatura(false);
    setPeriferico(false);
  }

  return (
    <View>

      <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black', textAlign: 'center' }}> Jiga de Teste <>SpeedBike</></Text>


      <View style={styles.containnerButton}>
        <View style={[{ backgroundColor: (isScanning || connectedDevice) ? 'gray' : 'blue' }, styles.buttonLayout]}>
          <TouchableOpacity
            onPress={startScan}
            disabled={isScanning}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {isScanning ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Bluetooth width={24} height={24} color="green" />
              )}
            </View>
            <Text style={{ color: 'white' }}>Escanear</Text>
          </TouchableOpacity>
        </View>

        <View style={[{ backgroundColor: connectedDevice ? 'blue' : 'gray' }, styles.buttonLayout]}>
          <TouchableOpacity
            onPress={disconnectFromDevice}
            disabled={!connectedDevice}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <BluetoothOff width={24} height={24} color="red" />
            </View>
            <Text style={{ color: 'white' }}>Desconectar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {connectedDevice &&
        <View style={{ marginTop: 5 }}>
          <Tester text="Injeção" color={injecao ? 'green' : "#e6df19"} />
          <Tester text="Ignição" color={ignicao ? 'green' : "#e6df19"} />
          <Tester text="RPM" color={RPM ? 'green' : "#e6df19"} />
          <Tester text="TPS" color={TPS ? 'green' : "#e6df19"} />
          <Tester text="Temperatura" color={temperatura ? 'green' : "#e6df19"} />
          <Tester text="Periférico" color={periferico ? 'green' : "#e6df19"} />
          {/* 
          <Text style={{ color: 'black', alignItems: 'center', justifyContent: 'center', padding: 10, fontSize: 15 }}>
            Conectado em <Text style={{ color: "green", fontStyle: "italic", fontWeight: 'bold', fontSize: 20 }}>{connectedDevice}</Text>
          </Text> */}
        </View>
      }

      {!connectedDevice && <FlatList
        data={devices}
        keyExtractor={(item) => item.id} // Use the device ID as the key
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => connectToDevice(item)}>
            <View style={styles.itemContainer}>
              <Text style={{ fontWeight: 'bold', fontStyle: 'italic', color: 'black' }}>
                {item.name}
              </Text>
              <Text>{item.id}</Text>
            </View>
          </TouchableOpacity>
        )}
      />}

      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10
        }}
        onPress={() => sendDataToDevice(cmdSimulador)}>
        <Play width={24} height={24} color="black" />
        <Text style={{ color: 'black' }}>Inicia Simulador </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10
        }}
        onPress={handleInitTest}>
        <Play width={24} height={24} color="black" />
        <Text style={{ color: 'black' }}>Inicia Testador </Text>
      </TouchableOpacity>

      <Text style={{ color: 'black', alignItems: 'center', justifyContent: 'center', padding: 10, textAlign: 'center' }}>
        {receivedData}
      </Text>

      <Button
        title="Qr Code" onPress={() => navigation.navigate('Qrcode')} />




    </View>
  )
}

export default Testador

const styles = StyleSheet.create({
  itemContainer: {
    padding: 12,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#3986b7',
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  containnerButton:
  {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 10
  },
  buttonLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10, width: 100,
    borderRadius: 25
  }
})
