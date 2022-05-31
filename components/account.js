import { ScrollView, StyleSheet, Text, View,TouchableOpacity,Animated } from "react-native";
import React, { useState, useEffect, useLayoutEffect,useWindowDimensions } from "react";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "native-base";
import { Avatar,ListItem } from "react-native-elements";
import { auth,db } from "../firebase";
import { TabView, SceneMap } from 'react-native-tab-view';
import logo from "../assets/logo.png"
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





const Account = ({ route, navigation }) => {
  const user = auth.currentUser;
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Friends' },
    { key: 'second', title: 'Requests' },
  ]);
  const [fData,setFData] = useState(null)
  const [rData,setRData] = useState(null)
  const Friends = () =>{
    return <View style={{ widht: "100%", flex: 1 }}>
    <ScrollView style={{ width: "100%" }}>
      {fData && fData.map(({ id,data}) => (
        <TouchableOpacity
        key={id}
        onPress={() => {
          console.log(id);
          if (user?.email == id) {
            navigation.navigate("Account");
          } else {
            navigation.navigate("ViewAccount", { id: id });
          }
        }}
      >
        <ListItem containerStyle={{ backgroundColor: "#000" }}>
          <Avatar
            source={data.profile ? { uri: data.profile } : logo}
            rounded={true}
          />
          <ListItem.Content>
            <ListItem.Title style={{ color: "tomato" }}>
              {data.username}
            </ListItem.Title>
            <ListItem.Subtitle style={{ color: "grey" }}>
              {id}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
  }
  
  
  
  const Requests = () =>{
    return <View style={{ widht: "100%", flex: 1 }}>
    <ScrollView style={{ width: "100%" }}>
      {rData && rData.map(({ id,data}) => (
        <TouchableOpacity
        onPress={() => {
          console.log(id);
          if (user?.email == id) {
            navigation.navigate("Account");
          } else {
            navigation.navigate("ViewAccount", { id: id });
          }
        }}
      >
        <ListItem containerStyle={{ backgroundColor: "#000" }}>
          <Avatar
            source={data.profile ? { uri: data.profile } : logo}
            rounded={true}
          />
          <ListItem.Content>
            <ListItem.Title style={{ color: "tomato" }}>
              {data.username}
            </ListItem.Title>
            <ListItem.Subtitle style={{ color: "grey" }}>
              {id}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
  }
  
  const renderScene = SceneMap({
    first: Friends,
    second: Requests,
  });
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon={<Ionicons name="md-menu-sharp" size={24} color="tomato" />}
          onPress={() => navigation.toggleDrawer()}
          _pressed={{ bg: "transparent" }}
        />
      ),
    });
  }, [navigation]);

  const RenderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
  
    return (
      <View style={styles1.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          var opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.3
            ),
          });
          var borderBottomWidth = props.navigationState.index === i ? 1 : 0
          return (
            <TouchableOpacity
              style={[styles1.tabItem,{borderBottomWidth,borderBottomColor:"tomato"}]}
              onPress={() => setIndex(i)}>
              <Animated.Text style={[{ opacity, },styles.FONT_HEADER]}>{route.title}</Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const getData = () => {
    db.collection("users")
      .doc(user.email)
      .collection("friends")
      .onSnapshot(
        docs => {
          var arr=[]
          docs.forEach((doc) => {
            console.log(doc.data())
            if (doc.id !== "user.emai") {
              arr.push({ id: doc.id, data: doc.data() });
            }
          })
          setFData(arr)
        }
      )
  }
  const getRequests = () => {
    db.collection("users")
      .doc(user.email)
      .collection("RequestIn")
      .onSnapshot(
        docs => {
          var arr=[]
          docs.forEach((doc) => {
            console.log(doc.data())
            if (doc.id !== "user.emai") {
              arr.push({ id: doc.id, data: doc.data() });
            }
          })
          setRData(arr)
        }
      )
  }

  useEffect(() =>{
    getData()
    getRequests()
  },[])
  return (
    <View style={styles1.container}>
      <View style={{ alignSelf: "center" }}>
        <Avatar source={user.photoURL ?{ uri: user.photoURL }:logo} size={170} rounded={true} />
      </View>

      <View style={{ alignItems: "center", margin: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            icon={<Ionicons name="pencil" size={20} color="black" />}
            
            _pressed={{ bg: "transparent" }}
          />
          <Text style={styles.FONT_HEADER}>{user.displayName}</Text>
          <IconButton
            icon={<Ionicons name="pencil" size={20} color="grey" />}
            onPress={() => navigation.navigate('AccountEdit')}
            _pressed={{ bg: "transparent" }}
          />
        </View>
        <Text style={{ color: "tomato" }}>{user.email}</Text>
        <Text style={{ color: "tomato" }}>{user.phoneNumber}</Text>
      </View>
      <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={RenderTabBar}
      onIndexChange={setIndex}
    />
    </View>
  );
};

export default Account;

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  tabBar: {
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
});
