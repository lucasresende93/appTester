import { NavigationContainer } from "@react-navigation/native";
import TabRoutes from "./tab.routes";
import { createStackNavigator } from "@react-navigation/stack";
import { BluetoothProvider } from "../utils/hook/bluetooth";

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <BluetoothProvider>
            <NavigationContainer>
                <TabRoutes />
            </NavigationContainer>
        </BluetoothProvider>
    )
}