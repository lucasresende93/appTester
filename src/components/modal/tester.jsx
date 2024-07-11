import { View, Text } from 'react-native'
import React from 'react'

const Tester = ({ text, color }) => {
    return (
        <View style={{
            backgroundColor: `${color}`,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            borderRadius: 10,
            marginBottom: 5,
            marginHorizontal: 15,
        }}>
            <Text style={{ fontSize: 20, color: 'black' }}>
                {text}
            </Text>
        </View>
    )
}

export default Tester