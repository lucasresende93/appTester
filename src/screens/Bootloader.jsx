import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { serverRoutes } from '../server/server-routes'
import { useBluetoothContext } from '../utils/hook/bluetooth';


const Bootloader = () => {

    const [data, setData] = useState([]);

    const { sendDataToDevice, connectedDevice } = useBluetoothContext()


    async function handleCheckforUpdates() {
        try {
            const resposta = await serverRoutes.checkForUpdates();

            const parsedData = resposta.developmentVersionsList;
            setData(parsedData);
            console.log(parsedData);
        } catch (error) {
            console.error('Error checking for updates:', error);
        }
    }

    const splitIntoPairs = (str) => {
        let result = [];
        for (let i = 0; i < str.length; i += 2) {
            result.push(str.substr(i, 2));
        }
        return result;
    }

    async function handleUpdateDevDevice(item) {
        try {
            const resposta = await serverRoutes.updateDevDevice(item.id);
            for (let index = 0; index < resposta.developmentScript.length; index++) {                
                console.log(splitIntoPairs(resposta.developmentScript[index]));
            }
        } catch (error) {
            console.error('Error updating device:', error);
        }
    }

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <TouchableOpacity onPress={() => handleUpdateDevDevice(item)}>
                <Text style={styles.title}>Software Version: {item.softwareVersion}</Text>
                <Text style={styles.text}>Hardware Version: {item.hardwareVersion}</Text>
                <Text style={[styles.text, { backgroundColor: '#ffff9e', padding: 4, alignSelf: 'flex-start', borderRadius: 6 }]}>Update Notes: {item.updateNotes}</Text>
                <Text style={styles.text}>Created At: {item.createdAt}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View>
            <Button title="Checar Update"
                onPress={handleCheckforUpdates} />
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                onPress={() => console.log('clicou', item)}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    item: {
        padding: 10,
        paddingHorizontal: 20,
        marginVertical: 8,
        marginHorizontal: 8,
        backgroundColor: '#94ba1d',
        borderRadius: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    text: {
        fontSize: 12,
        color: 'black',

    },
});

export default Bootloader