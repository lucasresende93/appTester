import { createStackNavigator } from '@react-navigation/stack';
import Qrcode from '../screens/Qrcode';
import Testador from '../screens/Testador';

const Stack = createStackNavigator();


export default function StackRoutes() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Testador2"
                component={Testador}
                options={{ headerShown: false, }}
            />
            <Stack.Screen name="Qrcode" 
            component={Qrcode} />
        </Stack.Navigator>
    )
}