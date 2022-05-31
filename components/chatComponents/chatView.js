import { StyleSheet, Text, TextInput, View, FlatList } from "react-native";
import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import styles from "../styles";
import { Avatar, ListItem } from "react-native-elements";
import logo from "../../assets/logo.png";
import { ScrollView, IconButton, Modal } from "native-base";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { auth, db, firebase } from "../../firebase";
import Message from "./message";
import ModalReader from "./modalReader";
import { NavigationContainer } from "@react-navigation/native";
const ChatView = ({ navigation, route }) => {
  const ref = useRef(null);
  const user = {
    id: auth.currentUser.email,
    data: {
      profile: auth.currentUser.photoURL,
      username: auth.currentUser.displayName,
    },
  };
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [val, setVal] = useState(null);
  const [load, setLoad] = useState(null);

  const liveLoad = () => {
      var arr=[]
    db.collection("users")
      .doc(user.id)
      .collection("friends")
      .doc(route.params.id)
      .onSnapshot((docs) => {
        const d = docs.data();
        db.collection("users")
          .doc(user.id)
          .collection("friends")
          .doc(route.params.id)
          .collection("chat")
          .doc(d.lastMsg)
          .get()
          .then((doc) => {
              if(doc.exists){
                arr.push( { id: doc.id, data: doc.data() })
                setMessages([...messages, ...arr]);
              }
              
          });
      });
  };
  const loadData = () => {
    db.collection("users")
      .doc(user.id)
      .collection("friends")
      .doc(route.params.id)
      .collection("chat")
      .orderBy("createdAt")
      .get()
      .then((docs) => {
        var arr = [];
        docs.docs.map((doc) => {
          if (doc.id !== route.params.data.lastMsg ) {
            arr.push({ id: doc.id, data: doc.data() });
          }
        });
        setMessages(arr);
        setLoad(true);
      });
  };



  const send = (data=val) => {
    if(data){db.collection("users")
      .doc(user.id)
      .collection("friends")
      .doc(route.params.id)
      .collection("chat")
      .add({
        sender: user.id,
        data: data,
        username: user.data.username,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      })
      .then((doc) => {
        db.collection("users")
          .doc(route.params.id)
          .collection("friends")
          .doc(user.id)
          .collection("chat")
          .doc(doc.id)
          .set({
            sender: user.id,
            data: data,
            username: user.data.username,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
          })
          .then(() => {
            setVal(null);
            setShowModal(false)
          });
        db.collection("users")
          .doc(route.params.id)
          .collection("friends")
          .doc(user.id)
          .update({
            lastMsg: doc.id,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
          });
        db.collection("users")
          .doc(user.id)
          .collection("friends")
          .doc(route.params.id)
          .update({
            lastMsg: doc.id,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
          });
      });}
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row" }}>
          <Avatar
            size={40}
            source={
              route.params?.data?.profile
                ? { uri: route.params?.data?.profile }
                : logo
            }
            rounded={true}
            containerStyle={{ marginRight: 10 }}
          />
          <Text style={styles.FONT_HEADER}>{route.params.data.username}</Text>
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    if (load) {
      liveLoad();
    }
  }, [load]);

  return (
    <View style={{ flex: 1 }}>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} _backdrop={{
      _dark: {
        bg: "coolGray.800"
      },
      bg: "warmGray.50"
    }}>
        <Modal.Content width="350px" backgroundColor={"#000"}>
          <Modal.CloseButton />
          <Modal.Body backgroundColor={"#000"} _scrollview={{scrollEnabled:false}}><ModalReader callBack={data => send(data)} navigation={navigation}/></Modal.Body>
        </Modal.Content>
      </Modal>
      <View style={styles1.viewContainer}>
        <FlatList
          nestedScrollEnabled
          ref={ref}
          data={messages}

          onContentSizeChange={() =>
            ref.current.scrollToEnd({ animated: true })
          }
          renderItem={({item}) =>(
              <Message user={user} data={item.data} key={item.id} />
            )} 
        />
      </View>
      <View style={styles1.inputContainer}>
        <IconButton
          icon={<Ionicons name="add-circle" size={40} color="tomato" />}
          onPress={() => {
            setShowModal(true);
          }}
          _pressed={{ bg: "transparent" }}
        />
        <TextInput
          value={val}
          onChangeText={(val) => setVal(val)}
          style={{
            backgroundColor: "#212121",
            padding: 10,
            flex: 1,
            borderRadius: 10,
            color: "#fff",
            maxHeight: 200,
            textAlignVertical: "center",
          }}
          placeholder="Type here"
          multiline
          placeholderTextColor={"#fff"}
        />
        <IconButton
          icon={<FontAwesome name="send-o" size={24} color="tomato" />}
          onPress={() => {
            send();
          }}
          _pressed={{ bg: "transparent" }}
        />
      </View>
    </View>
  );
};

export default ChatView;

const styles1 = StyleSheet.create({
  viewContainer: {
    flex: 5,
    padding: 5,
  },
  inputContainer: {
    padding: 2,
    flexDirection: "row",
    alignItems: "center",
  },
});
