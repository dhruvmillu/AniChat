import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "./components/signUp";
import Login from "./components/login";
import Home from "./components/home";
import MangaCh from "./components/readerComponents/mangaCh";
import MangaInfo from "./components/readerComponents/mangaInfo";
import AccountEdit from "./components/accountEdit";
import ViewAccount from "./components/viewAccount";
import ChatView from "./components/chatComponents/chatView";
import { auth } from "./firebase";

const Stack = createNativeStackNavigator();
export default function App() {
  console.log(auth.currentUser)
  return (
    <NativeBaseProvider>
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator>
           <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          

          
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MangaInfo"
            component={MangaInfo}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="AccountEdit"
            component={AccountEdit}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="MangaCh"
            component={MangaCh}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ViewAccount"
            component={ViewAccount}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="ChatView"
            component={ChatView}
            options={{ headerShown: true }}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
