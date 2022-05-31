import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { auth, db } from "../../firebase";
import { Spinner, IconButton } from "native-base";
import { Avatar } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AntDesign, Ionicons, FontAwesome } from "@expo/vector-icons";
import ScalesImage from "../readerComponents/scalesImage";
import styles from "../styles";

const MangaList = ({ callBack }) => {
  const [data, setData] = useState([]);
  const [showSearch, setSS] = useState(false);
  const search = useRef(null);
  const [cur, setCur] = useState(0);
  const [load, setLoad] = useState(true);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const curUser = auth.currentUser;
  const [modalData, setMdata] = useState(null);

  const tdata = async () => {
    setLoad(false);
    setData(await manga());
    setLoad(true);
  };

  const SearchBar = (props) => {
    return (
      <View style={{ flexDirection: "row", position: "relative" }}>
        <TextInput
          placeholder="Search"
          placeholderTextColor={"white"}
          style={{ color: "white", fontSize: 20, width: 220 }}
          onChangeText={(val) => {
            search.current = val;
          }}
        />
        <IconButton
          icon={<Ionicons name="search-outline" size={24} color="tomato" />}
          onPress={() => tdata()}
          _pressed={{ bg: "transparent" }}
        />
      </View>
    );
  };

  async function manga() {
    try {
      let res = await fetch(
        "https://api.mangadex.org/manga?contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&offset=" +
          cur * 10 +
          "&order[relevance]=desc&title=" +
          search.current +
          "&limit=100"
      );
      let result = await res.json();
      let z = result.data.map((id) => {
        return id.id;
      });
      setTotal(result.total / 10);
      let url = "https://api.mangadex.org/cover?limit=100&";
      for (let k = 0; k < z.length; k++) {
        url += "manga[]=" + z[k] + "&";
      }
      url = url.substring(0, url.length - 1);
      let resC = await fetch(url).then((response) => response.json());
      let itemEm = result.data;
      for (let i = 0; i < itemEm.length; i++) {
        for (let j = 0; j < resC.data.length; j++) {
          if (itemEm[i].id === resC.data[j].relationships[0].id) {
            itemEm[i].attributes["coverName"] =
              resC.data[j].attributes.fileName;
          }
        }
      }

      return itemEm;
    } catch (e) {
      return e;
    }
  }
  function titles(item) {
    let title;
    try {
      if (
        typeof item.attributes.title != "undefined" &&
        typeof item.attributes.title.en != "undefined"
      ) {
        title = item.attributes.title.en;
      } else {
        title = item.attributes.altTitles[0].en;
      }
    } catch (e) {}
    return title;
  }
  async function loadBookmarks() {
    var arr = [];
    user
      .doc(auth.currentUser.email)
      .collection("bookmark")
      .onSnapshot((res) => {
        setData([]);
        arr = [];
        setLoad(false);
        res.docs.map((doc) => {
          var id = doc.id;
          var attributes = {
            coverName: doc.data().coverName,
            title: { en: doc.data().title },
          };
          if (search) {
            if (doc.data().title.toLowerCase().includes(search.toLowerCase())) {
              arr.push({ id, attributes });
            }
          } else {
            arr.push({ id, attributes });
          }
          setData(arr);
        });
        setLoad(true);
      });

    return arr;
  }
  useEffect(() => {}, [data]);

  const display = () => {
    if (load) {
      if (data?.length > 0) {
        return (
          <View style={{ marginTop: 20, minHeight: 200, maxHeight: 580 }}>
            <SearchBar />
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              key={2}
              numColumns={2}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ margin: 5 }}
                  onPress={() =>
                    callBack({
                      title: titles(item),
                      coverImage:
                        "https://uploads.mangadex.org//covers/" +
                        item.id +
                        "/" +
                        item.attributes.coverName,
                      id: item.id,
                    })
                  }
                >
                  <Image
                    source={{
                      uri:
                        "https://uploads.mangadex.org//covers/" +
                        item.id +
                        "/" +
                        item.attributes.coverName,
                    }}
                    style={{
                      resizeMode: "contain",
                      justifyContent: "flex-end",
                      height: 210,
                      width: 150,
                    }}
                  />
                  <View
                    style={{
                      height: "30%",
                      width: "100%",
                      position: "absolute",
                      bottom: 0,
                    }}
                  >
                    <LinearGradient
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      colors={[
                        "#000000eA",
                        "#000000eA",
                        "#000000bA",
                        "#00000000",
                      ]}
                      style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        padding: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: "tomato",
                          fontWeight: "700",
                        }}
                      >
                        {titles(item)}
                      </Text>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              )}
              style={{}}
              contentContainerStyle={{ alignSelf: "center" }}
            />
          </View>
        );
      } else {
        return (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <SearchBar />
            <Text style={[styles.FONT_HEADER, { width: "70%" }]}>
              No manga available
            </Text>
          </View>
        );
      }
    } else {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color={"tomato"} size={"lg"} />
        </View>
      );
    }
  };

  return <View style={{ flex: 1 }}>{display()}</View>;
};

const MangaInfo = ({ manga, callBack, shareCallback }) => {
  const user = auth.currentUser;
  const bookmarkDB = db.collection("users/" + user.email + "/bookmark");
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const scrollRef = useRef(null);
  const [bookmark, setBookmarked] = useState(false);
  const [h, setH] = useState(Dimensions.get("window").height);
  const [r, setR] = useState(0.43);
  const [s, setS] = useState(false);
  const [data, setData] = useState(null);
  const [chapter, setCh] = useState(null);
  const [load, setLoad] = useState(true);
  const [coverImage, setImage] = useState(manga?.coverImage);
  const [title, setTitle] = useState(manga?.title);
  const [id, setId] = useState(manga?.id);
  const [chCount, setCount] = useState(0);
  const [info, setInfo] = useState(null);
  const [link, setLink] = useState(null);
  const styles = StyleSheet.create({
    container: {
      height: "100%",
    },
    info1: {
      height: h * 0.3,
      flexDirection: "row",
      paddingVertical: 10,
    },
    ch: {
      margin: 10,
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      flexDirection: "row",
    },
  });

  async function getData() {
    let temp = await fetch("https://api.mangadex.org/manga/" + id);
    let res = await temp.json();
    setData(res.data);
    temp = await fetch(
      "https://api.mangadex.org/manga/" +
        id +
        "/aggregate?translatedLanguage[]=en"
    );
    res = await temp.json();
    setCh(res.volumes);
    setLoad(false);
  }
  async function loadCh(id, t) {
    let temp = await fetch("https://api.mangadex.org/at-home/server/" + id);
    let res = await temp.json();
    setLink(res.baseUrl + "/data/" + res.chapter.hash + "/");
    setInfo({ data: res.chapter.data[0], info: t });
  }

  const bookMark = async () => {
    if (bookmark) {
      const res = await bookmarkDB.doc(id).delete();
    } else {
      const coverName = coverImage.substring(coverImage.lastIndexOf("/") + 1);
      console.log(coverName);
      const res = await bookmarkDB.doc(id).set({
        title,
        coverName,
      });
    }

    setBookmarked(!bookmark);
  };

  useEffect(() => {
    if (info) {
      console.log(link, info);
      shareCallback({ data: { link, info }, type: "manga-ch" });
    }
  }, [info]);
  useEffect(() => {
    const check = async () => {
      var docRef = bookmarkDB.doc(id);
      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            setBookmarked(true);
          } else {
            // doc.data() will be undefined in this case
            setBookmarked(false);
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    };
    check();
    getData();
  }, [id]);
  useEffect(() => {
    let count = 0;
    if (chapter) {
      Object.keys(chapter)
        .reverse()
        .map((el) => {
          Object.keys(chapter[el].chapters)
            .sort((a, b) => Number(b) - Number(a))
            .map((ch) => count++);
        });
    }
    console.log(count);
    setCount(count);
  }, [chapter]);
  if (load) {
    return (
      <View
        style={[
          { minHeight: 200, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Spinner color={"tomato"} size={"lg"} />
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ minHeight: 200, maxHeight: 590 }} ref={scrollRef}>
          <View style={styles.infoContainer}>
            <View style={styles.info1}>
              <View
                style={{
                  flex: 1,
                }}
              >
                <Image
                  source={{
                    uri: coverImage,
                  }}
                  style={{
                    flex: 1,
                    resizeMode: "contain",
                  }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "700",
                    color: "tomato",
                    marginBottom: 15,
                  }}
                  allowFontScaling={true}
                  adjustsFontSizeToFit
                  textBreakStrategy="simple"
                >
                  {title}
                </Text>
                <Text
                  style={{
                    fontSize: 19,
                    fontWeight: "700",
                    color: "white",
                    marginBottom: 10,
                  }}
                  allowFontScaling={true}
                  textBreakStrategy="simple"
                >
                  {data && "Status:" + data.attributes.status}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "300",
                    color: "white",
                  }}
                >
                  {data && "chapters: " + chCount}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <IconButton
                    icon={
                      <FontAwesome
                        name={bookmark ? "heart" : "heart-o"}
                        size={24}
                        color="tomato"
                      />
                    }
                    onPress={() => bookMark()}
                    _pressed={{ bg: "transparent" }}
                  />
                  <IconButton
                    icon={
                      <FontAwesome name="share-alt" size={24} color="tomato" />
                    }
                    onPress={() => {
                      shareCallback({
                        data: { title, coverImage, id },
                        type: "manga",
                      });
                    }}
                    _pressed={{ bg: "transparent" }}
                  />
                </View>
              </View>
            </View>
            <View style={r == 1 ? {} : { height: h * (r - 0.3) }}>
              <Text
                style={{
                  paddingHorizontal: 10,
                  color: "tomato",
                  fontSize: 20,
                  fontWeight: "700",
                  marginBottom: 10,
                }}
              >
                Description
              </Text>
              <View>
                <Text
                  style={{
                    paddingHorizontal: 10,
                    color: "white",
                    marginBottom: 70,
                  }}
                >
                  {data && data.attributes.description.en}
                </Text>
              </View>

              <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                colors={["#000000eA", "#000000dA", "#000000AA", "#00000000"]}
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  height: 70,
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setR(r == 0.43 ? 1 : 0.43);
                  }}
                  style={{ flex: 1, justifyContent: "flex-end", padding: 15 }}
                >
                  <Text
                    style={{
                      color: "tomato",
                    }}
                  >
                    {" "}
                    {r == 0.43 ? "see full description" : "collapse"}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
          <ScrollView style={styles.chapterContainer} nestedScrollEnabled={s}>
            {chapter && (
              <View>
                {Object.keys(chapter)
                  .reverse()
                  .map((el) => (
                    <View key={el}>
                      <View>
                        {Object.keys(chapter[el].chapters)
                          .sort((a, b) => Number(b) - Number(a))
                          .map((ch) => (
                            <TouchableOpacity
                              key={ch}
                              style={styles.ch}
                              onPress={() =>
                                callBack({
                                  id: chapter[el].chapters[ch].id,
                                  title,
                                  mangaid: id,
                                  chapter: chapter[el].chapters[ch].chapter,
                                })
                              }
                            >
                              <Text style={{ color: "white", fontSize: 15 }}>
                                Chapter - {chapter[el].chapters[ch].chapter}
                              </Text>
                              <IconButton
                                icon={
                                  <FontAwesome
                                    name="share-alt"
                                    size={24}
                                    color="tomato"
                                  />
                                }
                                onPress={() => {
                                  loadCh(chapter[el].chapters[ch].id, {
                                    id: chapter[el].chapters[ch].id,
                                    title,
                                    mangaid: id,
                                    chapter: chapter[el].chapters[ch].chapter,
                                  });
                                }}
                                _pressed={{ bg: "transparent" }}
                              />
                            </TouchableOpacity>
                          ))}
                      </View>
                    </View>
                  ))}
              </View>
            )}
          </ScrollView>
        </ScrollView>
      </View>
    );
  }
};

const MangaCh = ({ chdata, callBack, shareCallback }) => {
  const [info, setInfo] = useState(null);
  const [link, setLink] = useState(null);
  const [data, setData] = useState(null);
  const [id, setId] = useState(chdata.id);
  async function load() {
    let temp = await fetch("https://api.mangadex.org/at-home/server/" + id);
    let res = await temp.json();
    setLink(res.baseUrl + "/data/" + res.chapter.hash + "/");
    setInfo(res.chapter.data);
  }
  useEffect(() => {
    load();
    console.log(chdata);
  }, []);
  return (
    <View style={{ height: 700 }}>
      <FlatList
        data={info}
        keyExtractor={(item) => item}
        style={{ flex: 1 }}
        nestedScrollEnabled
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              shareCallback({
                data: { chdata, img: link + item },
                index: index + 1,
                type: "manga-pg",
              })
            }
          >
            <ScalesImage source={link + item} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const ModalReader = ({ callBack }) => {
  const [manga, setManga] = useState(null);
  const [chData, setChData] = useState(null);
  const [pgData, setPgData] = useState(null);
  const [share, setShare] = useState(null);
  const navigation = useNavigation();

  const display = () => {
    switch (share.type) {
      case "manga-pg":
        return (
          <View
            style={{ maxHeight: 300, flexDirection: "row", marginBottom: 10 }}
          >
            <ScrollView nestedScrollEnabled style={{width:150}}>
              <ScalesImage source={share.data.img} width={150} />
            </ScrollView>
            <View style={{width:170}}>
              <Text allowFontScaling adjustsFontSizeToFit style={styles.FONT_HEADER}>{share.data.chdata.title}</Text>
              <Text allowFontScaling adjustsFontSizeToFit  style={[styles.FONT_HEADER]}>
                Chapter - {share.data.chdata.chapter}
              </Text>
              <Text allowFontScaling adjustsFontSizeToFit  style={[styles.FONT_HEADER]}>Page - {share.index}</Text>
            </View>
          </View>
        );
        
        
      case "manga-ch":
        return (
          <View
            style={{ maxHeight: 300, flexDirection: "row", marginBottom: 10 }}
          >
                  <ScalesImage source={share.data.link + share.data.info.data} width={150} />
              
            <View style={{width:200}}>
              <Text style={styles.FONT_HEADER}>{share.data.info.info.title}</Text>
              <Text style={[styles.FONT_HEADER]}>
                Chapter - {share.data.info.info.chapter}
              </Text>
            </View> 
          </View>
        );
        case 'manga': return <View
        style={{ maxHeight: 300, marginBottom: 10,alignItems:"center" }}
      >
          {console.log(share)}
          
          <Image source={{uri:share.data.coverImage}}
                        style={{
                            resizeMode: "contain",
                            justifyContent: "flex-end",
                            height: 245, width: 170
                          }}

                />
                <View >
                        <Text
                          style={[{
                            color: "tomato",
                            fontWeight:"700",
                            fontSize:30
                          }]}
                        >
                          {share.data.title}
                        </Text>
                    </View>
      </View>
    }
  };

  useEffect(() => {
    if (share) {
      console.log(share);
    }
  }, [share]);
  if (share) {
    return (
      <View style={{ flex: 1, marginTop: 50 }}>
        <View>{display()}</View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <IconButton
            icon={<FontAwesome name="close" size={24} color="tomato" />}
            onPress={() => {
              setShare(null)
            }}
            _pressed={{ bg: "transparent" }}
          />
          <IconButton
            icon={<FontAwesome name="send-o" size={24} color="tomato" />}
            onPress={() => {
              callBack(share);
            }}
            _pressed={{ bg: "transparent" }}
          />
        </View>
      </View>
    );
  } else {
    if (!manga) {
      return (
        <View style={{ flex: 1 }}>
          <MangaList callBack={(data) => setManga(data)} />
        </View>
      );
    } else if (!chData) {
      return (
        <View style={{ flex: 1 }}>
          <IconButton
            icon={<Ionicons name="arrow-back" size={24} color="tomato" />}
            onPress={() => {
              setManga(null);
            }}
            _pressed={{ bg: "transparent" }}
          />
          <MangaInfo
            manga={manga}
            callBack={(data) => setChData(data)}
            shareCallback={(data) => setShare(data)}
          />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <IconButton
            icon={<Ionicons name="arrow-back" size={24} color="tomato" />}
            onPress={() => {
              setChData(null);
            }}
            _pressed={{ bg: "transparent" }}
          />
          <MangaCh
            chdata={chData}
            callBack={(data) => setChData(data)}
            shareCallback={(data) => setShare(data)}
          />
        </View>
      );
    }
  }
};

export default ModalReader;

const styles1 = StyleSheet.create({});
