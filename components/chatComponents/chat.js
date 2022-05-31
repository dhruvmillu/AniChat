import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Avatar, ListItem } from "react-native-elements";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import Account from "../account";
import { DarkTheme, useNavigation } from "@react-navigation/native";
import { auth, db } from "../../firebase";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "native-base";
import { useToast,Alert,VStack,Box } from "native-base";
import Request from "../request";
import logo from "../../assets/logo.png"


const modelData = [
  {
    username: "user1",
    profile: "../assets/logo.png",
  },
  {
    username: "user2",
    profile: "../assets/logo.png",
  },
  {
    username: "user3",
    profile: "../assets/logo.png",
  },
  {
    username: "user4",
    profile: "../assets/logo.png",
  },
  {
    username: "user5",
    profile: "../assets/logo.png",
  },
  {
    username: "user6",
    profile: "../assets/logo.png",
  },
  {
    username: "user7",
    profile: "../assets/logo.png",
  },
  {
    username: "user8",
    profile: "../assets/logo.png",
  },
  {
    username: "user9",
    profile: "../assets/logo.png",
  },
  {
    username: "user10",
    profile: "../assets/logo.png",
  },
  {
    username: "user11",
    profile: "../assets/logo.png",
  },
  {
    username: "user12",
    profile: "../assets/logo.png",
  },
  {
    username: "user13",
    profile: "../assets/logo.png",
  },
  {
    username: "user14",
    profile: "../assets/logo.png",
  },
  {
    username: "user15",
    profile: "../assets/logo.png",
  },
  {
    username: "user16",
    profile: "../assets/logo.png",
  },
];

const Drawer = createDrawerNavigator();

const Display = ({ route,navigation }) => {
  const user = auth.currentUser
  const [data, setData] = useState(null);
  const [sData, setSData] = useState(null);
  const [showSearch, setSS] = useState(false);
  const [search, setSearch] = useState(null);

  const SearchBar = () => {
    return (
      <View>
        <TextInput
          placeholder="Search"
          placeholderTextColor={"white"}
          style={{ color: "white", fontSize: 20,width:250 }}
          onChangeText={(val) => setSearch(val)}
        />
      </View>
    );
  };

  const getData = async () => {
      db.collection("users").doc(user.email).collection("friends").onSnapshot(docs =>{
        var arr =[]
         docs.forEach(element => {
           arr.push({id:element.id,data:element.data()})
         });
         setData(arr)
      })
  };

  useEffect(() => {

  },[search])

  useEffect(() => {
    getData()
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: showSearch ? () => <SearchBar /> : route.title,
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => navigation.toggleDrawer()}
        >
          <Avatar
            size={40}
            source={
              user?.photoURL
                ? { uri: user?.photoURL }
                : logo
            }
            rounded={true}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => setSS(!showSearch)}
        >
          <AntDesign
            name={showSearch ? "close" : "search1"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, showSearch]);
  if (data) {
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ChatView", { data:{username: item.data.username,profile: item.data.profile,lastMsg: item.data.lastMsg},id:item.id})
            }
          >
            <ListItem containerStyle={{ backgroundColor: "#000" }}>
              <Avatar
                source={item.data.profile?{uri:item.data.profile}:logo}
                rounded={true}
              />
              <ListItem.Content>
                <ListItem.Title style={{ color: "tomato" }}>
                  {item.data.username}
                </ListItem.Title>
                <ListItem.Subtitle style={{ color: "grey" }}>
                  sample subtitle
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </TouchableOpacity>
        )}
        style={{
          flex: 1,
        }}
      />
    );
  } else {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Chat</Text>
      </View>
    );
  }
};
function CustomDrawerContent(props) {
    const navigation = useNavigation()
    const toast = useToast()
    const signOut = () =>{
        auth.signOut().then(() => {
            
              navigation.replace('Login')
          }).catch((error) => {
            toast.show({
                title:error.id,
                description:error.message,
                status:"warning",
                placement:"top",
                width:"90%",
            })
          })
    }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label={() => <Text style={{ color: "tomato" }}>Sign Out</Text>}
        icon={() => <Ionicons name="exit-outline" size={24} color="tomato" />}
        onPress={() => signOut()}
      />
    </DrawerContentScrollView>
  );
}
const Chat = ({ navigation }) => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ route }) => ({
        drawerActiveBackgroundColor: "tomato",
        drawerActiveTintColor: "#000",
        drawerInactiveTintColor: "tomato",
        drawerStyle: {
          backgroundColor: "#222",
          width: 240,
        },
        swipeEnabled: true,
        drawerType: "slide",
        swipeEdgeWidth: 200,
        headerStyle:{
            backgroundColor:"#202020",
            
          },
        headerTitleStyle:{
            color:"tomato",
            fontSize:30
        }
      })}
    >
      <Drawer.Screen
        name="main-chat"
        component={Display}
        options={{
          headerShown: true,
          title: "Chat",
          drawerIcon: ({ focused }) => (
            <Ionicons
              name={"chatbubbles-outline"}
              size={24}
              color={focused ? "black" : "tomato"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Account"
        component={Account}
        options={{
          drawerIcon: ({ focused }) => (
            <Ionicons
              name={"person-circle-outline"}
              size={24}
              color={focused ? "black" : "tomato"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="request"
        component={Request}
        options={{
          headerShown: true,
          title: "Search",
          drawerIcon: ({ focused }) => (
            <Ionicons
              name={"search-outline"}
              size={24}
              color={focused ? "black" : "tomato"}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default Chat;

const styles = StyleSheet.create({
  conntainer: {
    flex: 1,
    backgroundColor: "#000",
  },
});
