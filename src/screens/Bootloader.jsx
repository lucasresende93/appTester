import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { serverRoutes } from '../server/server-routes'
import { Trophy } from 'lucide-react-native'


const Bootloader = () => {

    const [data, setData] = useState([]);


    async function handleCheckforUpdates() {
        try {
            const resposta = await serverRoutes.checkForUpdates();

            // A resposta já é um objeto JSON, não precisa de JSON.parse
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
            // console.log(splitIntoPairs(resposta.developmentScript[1]));
        } catch (error) {
            console.error('Error updating device:', error);
        }
    }

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <TouchableOpacity onPress={() => handleUpdateDevDevice(item)}>
                <Text style={styles.title}>Software Version: {item.softwareVersion}</Text>
                <Text>Hardware Version: {item.hardwareVersion}</Text>
                <Text>Update Notes: {item.updateNotes}</Text>
                <Text>Created At: {item.createdAt}</Text>
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
        marginVertical: 8,
        backgroundColor: 'green',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Bootloader