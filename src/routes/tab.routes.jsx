import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Simulador from '../screens/Simulador';
import { Radar, ShieldCheck } from 'lucide-react-native';
import StackRoutes from './stack.routes';


const BottomTab = createBottomTabNavigator();


export default function TabRoutes() {
    return (
        <BottomTab.Navigator screenOptions={{headerShown:false}}>
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
                component={StackRoutes}
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

