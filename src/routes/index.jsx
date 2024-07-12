import { NavigationContainer } from "@react-navigation/native";
import TabRoutes from "./tab.routes";
import { createStackNavigator } from "@react-navigation/stack";
import Qrcode from "../screens/Qrcode";

const Stack = createStackNavigator();

function Stacks(){
    return (
        <Stack.Navigator>
            <Stack.Screen name="Qrcode" component={Qrcode} />
        </Stack.Navigator>
    )
}

export default function Routes() {
    return (
        <NavigationContainer>
            <TabRoutes />
        </NavigationContainer>
    )
}