import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Simulador from '../screens/Simulador';
import Testador from '../screens/Testador';
import { Radar, ShieldCheck } from 'lucide-react-native';


const BottomTab = createBottomTabNavigator();


export default function TabRoutes() {
    return (
        <BottomTab.Navigator>
            <BottomTab.Screen name="Simulador"
                component={Simulador}
                options={{
                    tabBarLabel: 'Simulador',
                    tabBarIcon: ({ color, size }) => (
                        <Radar name="bell" color={color} size={size} />
                    ),
                }}
            />
            <BottomTab.Screen name="Testador"
                component={Testador}
                options={{
                    tabBarLabel: 'Testador',
                    tabBarIcon: ({ color, size }) => (
                        <ShieldCheck name="bell" color={color} size={size} />
                    ),
                }}
            />
        </BottomTab.Navigator>
    )
}   