import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useWindowDimensions,
} from "react";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { Button, IconButton } from "native-base";
import { Avatar, ListItem } from "react-native-elements";
import { auth, db } from "../firebase";
import logo from "../assets/logo.png";

const ViewAccount = ({ route, navigation }) => {
  const user = auth.currentUser;
  const [data, setData] = useState(null);
  const [fData, setFData] = useState(null);
  const [type, setType] = useState("empty");
  const [reload, setReload] = useState(false);

  const unSendRequest = async () => {
    db.collection("users")
      .doc(user.email)
      .collection("RequestOut")
      .doc(route.params.id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        setReload(true)
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
    db.collection("users")
      .doc(route.params.id)
      .collection("RequestIn")
      .doc(user.email)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        setType(null)
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
    setReload(true);
  };
  
  const reject = () => {
    db.collection("users")
      .doc(user.email)
      .collection("RequestIn")
      .doc(route.params.id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        setReload(true)
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
    db.collection("users")
      .doc(route.params.id)
      .collection("RequestOut")
      .doc(user.email)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        setType(null)
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };
  const accept = () => {
    reject()
  db.collection("users")
    .doc(route.params.id)
    .collection("friends")
    .doc(user.email)
    .set({
      username:user.displayName,
      profile:user.photoURL,
      type:"friend"
    })      
    .then(() => {
      console.log("Document successfully updated!");
      setType("friends")
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
    db.collection("users")
    .doc(user.email)
    .collection("friends")
    .doc(route.params.id)
    .set({
      username:data?.data?.username,
      profile:data?.data.profile,
      type:"friend"
    })      
    .then(() => {
      console.log("Document successfully updated!");
      setType("friends")
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
};
  const sendRequest = () => {
    console.log({
      username:data.data.username,
      profile:data.data.profile
    },{
      username:user.displayName,
      profile:user.photoURL
    })
    db.collection("users")
      .doc(user.email)
      .collection("RequestOut")
      .doc(route.params.id)
      .set({
        username:data.data.username,
        profile:data.data.profile
      })
      .then(() => {
        console.log("Document successfully updated!");
        setReload(true)
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
    db.collection("users")
      .doc(route.params.id)
      .collection("RequestIn")
      .doc(user.email)
      .set({
        username:user.displayName,
        profile:user.photoURL
      })      
      .then(() => {
        console.log("Document successfully updated!");
        setType("Request")
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };
  const unFriend = () => {
    db.collection("users")
      .doc(user.email)
      .collection("friends")
      .doc(route.params.id)
      .delete()
      .then(() => {
        console.log("Document successfully updated!");
        setReload(true)
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
    db.collection("users")
      .doc(route.params.id)
      .collection("friends")
      .doc(user.email)
      .delete()    
      .then(() => {
        console.log("Document successfully updated!");
        setType("friends")
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  const getData = async () => {
    var state = null
    db.collection("users").doc(route.params.id).get()
      .then( doc => {
        setData({ id: doc.id, data: doc.data() })
        db.collection("users")
          .doc(route.params.id)
          .collection("friends")
          .get()
          .then(
            docs => {
              var arr=[]
              docs.forEach((doc) => {
                   state = (doc.id === user.email ? "friend" : state);
                   if (doc.id !== "user.emai") {
                     arr.push({ id: doc.id, data: doc.data() });
                   }
                 })
                setFData(arr)
                db.collection("users")
                  .doc(user.email)
                  .collection("RequestIn")
                  .doc(route.params.id)
                  .get()
                  .then(
                    doc => {
                      state = (doc.data()? "Request-In" : state);
                      db.collection("users")
                        .doc(user.email)
                        .collection("RequestOut")
                        .doc(route.params.id)
                        .get()
                        .then(
                          doc => {
                            state = (doc.data()? "Request" : state);
                            setType(state)
                          }
                        )
                    }
                  )
                  .catch(
                    err => console.log(err)
                  )
            }
          )
      }
    // db
    // stateRes = await db
    //   .collection("users")
    //   .doc(user.email)
    //   .collection("RequestOut")
    //   .doc(route.params.id)
    //   .get();
    //   console.log(stateRes.data() ? true : false,"request")
    // setType(stateRes.data() ? "Request" : type);
    // ;
    )
    
  };

  useEffect(() => {
    console.log(type)
    getData();
  }, [type]);

  return (
    <View style={styles1.container}>
      <View style={{ alignSelf: "center" }}>
        <Avatar
          source={data?.data.profile ? { uri: data?.data.profile } : logo}
          size={170}
          rounded={true}
        />
      </View>

      <View style={{ alignItems: "center", margin: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.FONT_HEADER}>{data?.data?.username}</Text>
        </View>
        <Text style={{ color: "tomato" }}>{data?.id}</Text>
        <View style={{ padding: 10 }}>
          {console.log(type,"ftype")}
          {type == null && (
            <Button
              style={[styles1.buttonStyle, { width: 120 }]}
              _text={{ color: "black" }}
              onPress={() => sendRequest()}
            >
              Send Request
            </Button>
          )}
          {type == "friend" && (
            <Button
              style={styles1.buttonStyle}
              _text={{ color: "black" }}
              onPress={() => unFriend()}
            >
              Unfriend
            </Button>
          )}
          {type == "Request" && (
            <Button
              style={[styles1.buttonStyle, { width: 150 }]}
              _text={{ color: "black" }}
              onPress={() => unSendRequest()}
            >
              Un-Send Request
            </Button>
          )}
          {type == "Request-In" && (
            <View style={{ flexDirection: "row" }}>
              <Button
                style={styles1.buttonStyle}
                _text={{ color: "black" }}
                onPress={() => accept()}
              >
                Accept
              </Button>
              <Button
                style={styles1.buttonStyle}
                _text={{ color: "black" }}
                onPress={() => reject()}
              >
                Reject
              </Button>
            </View>
          )}
        </View>
      </View>
      <View style={{ widht: "100%", flex: 1 }}>
        <Text style={styles.FONT_HEADER}>Friends</Text>
        <ScrollView style={{ width: "100%" }}>
          {fData &&
            fData.map(({ id, data }) => (
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
    </View>
  );
};

export default ViewAccount;

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  tabBar: {
    flexDirection: "row",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  buttonStyle: {
    backgroundColor: "tomato",
    marginHorizontal: 10,
    width: 90,
  },
});
