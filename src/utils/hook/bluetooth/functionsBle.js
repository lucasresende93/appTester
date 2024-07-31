import { useEffect, useState } from 'react';
import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules, Platform, PermissionsAndroid, Alert } from 'react-native';


import { Buffer } from 'buffer';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_WRITE_UUID = '0000fff2-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_READ_UUID = '0000fff1-0000-1000-8000-00805f9b34fb';

const specificNames = ['EBYTEBLE', 'SPEEDBIKE', 'EMODULE', 'ENGENHARIA'];

let dispositivosBLE = 0;


const useBluetooth = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [devices, setDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [receivedData, setReceivedData] = useState('');

    useEffect(() => {
        // Inicializa o BleManager
        BleManager.start({ showAlert: false }).then(() => {
            console.log('BleManager initialized');
        });


        const handleDiscoverPeripheral = (peripheral) => {

            if (peripheral.name && specificNames.some(name => peripheral.name.includes(name))) {
                setDevices((prevDevices) => {
                    if (!prevDevices.some((device) => device.id === peripheral.id)) {
                        // console.log('Discovered peripheral:', peripheral);
                        return [...prevDevices, peripheral];
                    }

                    dispositivosBLE++;
                    return prevDevices;
                });

            }
        };

        const handleUpdateValueForCharacteristic = (data) => {
            const { value } = data;


            hexString = value.map(b =>
                b.toString(16).padStart(2, '0')).join(', ');
            setReceivedData(value);


            console.log('Received data:', data, " hex:", hexString);

        };


        let teste1 = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        let teste2 = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

        return () => {
            teste1.remove();
            teste2.remove();
            // bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
            // bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
        };
    }, []);

    useEffect(() => {
        // Solicita permissões para Android
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User accepted");
                        } else {
                            console.log("User refused");
                        }
                    });
                }
            });
        }
    }, []);

    const startScan = () => {
        if (!isScanning) {
            dispositivosBLE = 0;

            setDevices([]);
            BleManager.scan([], 3, true).then(() => {
                console.log('Scanning...');
                setIsScanning(true);
                setTimeout(() => {
                    setIsScanning(false);
                    if (dispositivosBLE === 0) {
                        Alert.alert("Nenhum dispositivo encontrado");
                    }
                }, 3000); // Verificar após 3 segundos
            }).catch(err => {
                console.error(err);
            });
        }
    };

    const stopScan = () => {
        setIsScanning(false);
        BleManager.stopScan().then(() => {
            console.log('Scan is stopped');
        }).catch(err => {
            console.error(err);
        });
    };

    const connectToDevice = (device) => {
        BleManager.connect(device.id)
            .then(() => {

                console.log('Connected to', device.name);
                setConnectedDevice(device);

                // Retrieve services and start notification on the characteristic
                BleManager.retrieveServices(device.id).then((peripheralInfo) => {
                    console.log('Peripheral info:', peripheralInfo);
                    BleManager.startNotification(device.id, SERVICE_UUID, CHARACTERISTIC_READ_UUID)
                        .then(() => {
                            console.log('Started notification on', device.id);
                        })
                        .catch((error) => {
                            console.log('Notification error', error);
                        });
                });
            })
            .catch((error) => {
                console.log('Connection error', error);
            });
    };





    const disconnectFromDevice = () => {
        if (connectedDevice) {
            BleManager.disconnect(connectedDevice.id)
                .then(() => {
                    console.log('Disconnected from', connectedDevice.name);
                    setConnectedDevice(null);
                    setDevices([]);
                    setIsScanning(false);

                })
                .catch((error) => {
                    console.log('Disconnection error', error);
                });
        }
    };

    const handleUpdateValueForCharacteristic = (data) => {
        // Função para lidar com atualizações de valor de característica
        console.log('Received data from characteristic', data);
    };

    const sendDataToDevice = (hexArrayTemp) => {
        if (connectedDevice) {
            // Converter o array hexadecimal em bytes
            const byteArray = hexArrayTemp.map(hex => parseInt(hex, 16));

            // Converter os bytes em um buffer
            const buffer = Buffer.from(byteArray);
            const data = buffer.toJSON().data;

            // Enviar os dados para o dispositivo
            BleManager.write(
                connectedDevice.id,
                SERVICE_UUID,
                CHARACTERISTIC_WRITE_UUID,
                data,
                250)
                .then(() => {
                    let hexString = '';

                    for (let index = 0; index < data.length; index++) {
                        let element = data[index].toString(16);
                        hexString += element.padStart(2, '0') + ' ';
                    }
                    console.log('Data sent successfully', hexString);
                })
                .catch((error) => {
                    console.log('Write error', error);
                });
        }
        else

            console.log('No device connected.')
    };

 

    return {
        disconnectFromDevice,
        handleUpdateValueForCharacteristic,
        startScan,
        stopScan,
        connectToDevice,
        sendDataToDevice,
        devices,
        isScanning,
        connectedDevice,
        receivedData,
    };
};

export default useBluetooth;
