import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState,useRef } from "react";
import styles from "./styles";
import { IconButton } from "native-base";
import { ListItem,Avatar } from "react-native-elements";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { TabView, SceneMap } from "react-native-tab-view";
import { auth, db } from "../firebase";
import logo from "../assets/logo.png"

const Request = ({ route, navigation }) => {
    const user = auth.currentUser;
  const search = useRef(null)
  var [ssearch, setSSearch] = useState(null);
  const [index, setIndex] = useState(0);
  const [showSearch, setSS] = useState(false);
  const [pData, setPData] = useState(null);
  const [routes] = useState([
    { key: "first", title: "People" },
    { key: "second", title: "Discussions" },
  ]);



  const People = () => {
    return (
      <View style={{flex:1}}>
        {pData && pData.length>=1?
        
        <FlatList
            style={{flex:1}}
            data={pData}
            keyExtractor={(item) => item.id}
            renderItem={({item})=>
                <TouchableOpacity
            onPress={() =>
              navigation.navigate("ViewAccount", { id:item.id})
            }
          >{console.log(item,"ug")}
            <ListItem containerStyle={{ backgroundColor: "#000" }}>
              <Avatar
                source={item.data.profile?{uri:item.data.profile}: logo}
                rounded={true}
              />
              <ListItem.Content>
                <ListItem.Title style={{ color: "tomato" }}>
                  {item.data.username}
                </ListItem.Title>
                <ListItem.Subtitle style={{ color: "grey" }}>
                  {item.id}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </TouchableOpacity>
            }
        />
        :<View style={styles.TOP_CONTAINER}><Text style={styles.FONT_HEADER}>Search to Find People</Text></View>}
      </View>
    );
  };

  const Discussion = () => {
    return (
      <View style={styles.TOP_CONTAINER}>
        <Text style={styles.FONT_HEADER}>Discussion</Text>
      </View>
    );
  };

  const renderScene = SceneMap({
    first: People,
    second: Discussion,
  });
  const SearchBar = () => {
    return (
      <View style={{flexDirection:'row'}}>
        <TextInput
          placeholder="Search"
          placeholderTextColor={"white"}
          style={{ color: "white", fontSize: 20, width: 220 }}
          onChangeText={(val) => {search.current = val}}
        />
        <IconButton
          icon={<Ionicons name="search-outline" size={24} color="tomato" />}
          onPress={() => loadPData()}
          _pressed={{ bg: "transparent" }}
        />
      </View>
    );
  };

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
          var borderBottomWidth = props.navigationState.index === i ? 1 : 0;
    
          return (
            <TouchableOpacity
                key={i}
              style={[
                styles1.tabItem,
                { borderBottomWidth, borderBottomColor: "tomato" },
              ]}
              onPress={() => setIndex(i)}
            >
              <Animated.Text
                style={[{ opacity, color: "tomato", fontSize: 20 }]}
              >
                {route.title}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: showSearch ? () => <SearchBar /> : route.title,
      headerLeft: () => (
        <IconButton
          icon={<Ionicons name="md-menu-sharp" size={24} color="tomato" />}
          onPress={() => navigation.toggleDrawer()}
          _pressed={{ bg: "transparent" }}
        />
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

  

  useEffect(() => {}, [pData]);

  const loadPData = async () => {
    const res = await db.collection("users").get()
    var arr =[]
    res.docs.forEach(doc => {
        const data = doc.data()
        if(data.username&& data.username!==user.displayName && data.username.toLowerCase().includes(search.current.toLowerCase())){
            arr.push({id:doc.id,data})
        }
    })
    setPData(arr)
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={RenderTabBar}
          onIndexChange={setIndex}
        />
      </View>
    </View>
  );
};

export default Request;

const styles1 = StyleSheet.create({
  inputField: {
    padding: 10,
    color: "#fff",
    fontSize: 17,
    borderBottomWidth: 1,
    borderBottomColor: "tomato",
    width: "90%",
    alignSelf: "center",
    marginBottom: 10,
  },
  tabBar: {
    flexDirection: "row",
  },
  tabItem: {
    alignItems: "center",
    padding: 10,
  },
});
