import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import styles from './styles';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Chat from './chatComponents/chat';
import Reader from './readerComponents/reader';
import {AntDesign,Feather} from '@expo/vector-icons'

const Tab = createBottomTabNavigator();


const Home = () => {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {  
            if (route.name === 'Chat') {
                return <AntDesign name='message1' size={20} color={color}/>
            } else{
                return <Feather name='book-open' size={20} color={color}/>
            }
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            style:{
                backgroundColor:"#000"
            }
        })}
    >
        <Tab.Screen name="Chat" component={Chat} options={{headerShown:false}} />
        <Tab.Screen name="Reader" component={Reader} options={{headerShown:false}}  />
    </Tab.Navigator>
  );
};

export default Home;

const style1 = StyleSheet.create({});
