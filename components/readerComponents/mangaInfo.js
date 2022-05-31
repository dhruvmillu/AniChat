import React, { useState, useEffect,useRef,useLayoutEffect } from "react";
import { StyleSheet, View, Image, Text, ScrollView,Dimensions, TouchableOpacity, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Spinner,Fab,Icon, IconButton } from "native-base";
import { Avatar } from "react-native-elements";
import {FontAwesome} from '@expo/vector-icons'
import { db,auth } from "../../firebase";
import { Ionicons } from '@expo/vector-icons';

const MangaInfo = ({
    route,
    navigation
}) => {

    const user = auth.currentUser
    const bookmarkDB = db.collection("users/"+user.email+"/bookmark")
    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom;
      };

    const scrollRef = useRef(null)
    const [bookmark,setBookmarked] = useState(false)
    const [h,setH] = useState(Dimensions.get('window').height)
    const [r,setR] = useState(0.43)
    const [s,setS] = useState(false)
    const [data,setData] =useState(null)
    const [chapter,setCh] = useState(null)
    const [load,setLoad] = useState(true)
    const [coverImage,setImage] = useState(route.params.coverImage)
    const [title,setTitle] = useState(route.params.title)
    const [id,setId] = useState(route.params.id)
    const [chCount,setCount] = useState(0)
    const styles = StyleSheet.create({
        container: {
            height:"100%",
            
        },
        info1:{
            height:h*0.3,
            flexDirection:'row',
            paddingVertical:10,
        },
        ch:{
            margin:10,
            justifyContent:"center",
            padding:10,
            
        }
      });

      async function getData() {
        let temp = await fetch("https://api.mangadex.org/manga/" + id);
        let res = await temp.json();
        setData(res.data)
        temp = await fetch("https://api.mangadex.org/manga/" + id+"/aggregate?translatedLanguage[]=en")
        res = await temp.json()
        setCh(res.volumes)
        setLoad(false)
        
      }  
    
    
    const bookMark = async () =>{


        if(bookmark){
            const res = await bookmarkDB.doc(id).delete()

        }
        else{
            const coverName = coverImage.substring(coverImage.lastIndexOf("/")+1)
            console.log(coverName)
            const res = await bookmarkDB.doc(id).set({
                title,
                coverName
            })
        }
        
        setBookmarked(!bookmark)
    }
//
    useEffect(() => {
        const check = async () =>{
            var docRef = bookmarkDB.doc(id);
            docRef.get().then((doc) => {
                if (doc.exists) {
                    setBookmarked(true)
                } else {
                    // doc.data() will be undefined in this case
                    setBookmarked(false)
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }
        check()
        getData()
        navigation.setOptions({
            headerTitle:title
        })
     },[id])
     useEffect(() => {
         
        
        let count =0
        if(chapter){Object.keys(chapter).reverse().map((el) => 
                {Object.keys(chapter[el].chapters)
                  .sort((a, b) => Number(b) - Number(a))
                  .map((ch) => count++)}
          )}
          console.log(count)
          setCount(count)
     },[chapter])
     if(load){
        return(
            <View style={[styles.container,{justifyContent:"center",alignItems:"center"}]}>
                <Spinner color={'tomato'} size={"lg"}/>
            </View>
        )
     }
     else{
  return (
      <View style={{flex:1}}>

      
      <ScrollView style={{height:'100%'}} ref={scrollRef} >
            <View style={styles.infoContainer}>
                <View style={styles.info1}>
                    <View style={{
                        flex:1,
                    }}>
                        <Image 
                            source={{
                                uri:coverImage
                            }}
                            style={{
                                flex:1,
                                resizeMode:"contain"
                            }}
                        />

                    </View>
                    <View 
                        style={{
                            flex:1,
                            justifyContent:"center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize:30,
                                fontWeight:"700",
                                color:"tomato",
                                marginBottom:20
                            }}
                            allowFontScaling={true}
                            textBreakStrategy="simple"
                        >
                            {data && "Status:\n"+data.attributes.status}
                        </Text>
                        <Text
                            style={{
                                fontSize:15,
                                fontWeight:"300",
                                color:"white"
                            }}
                        >
                            {data && "chapters: "+chCount}
                        </Text>
                        <IconButton icon={<FontAwesome name={bookmark?"heart":"heart-o"} size={24} color="tomato" />}  onPress={() => bookMark()}  _pressed={{bg:"transparent"}} />
                    </View>
                </View>
                <View style={r==1?{}:{height:h*(r-0.3)}}>
                    <Text style={{
                        paddingHorizontal:10,
                        color:"tomato",
                        fontSize:20,
                        fontWeight:"700",
                        marginBottom:10
                    }}>
                        Description
                    </Text>
                    <View>
                    <Text style={{
                        paddingHorizontal:10,
                        color:"white",
                        marginBottom:70
                    }}>
                        {data && data.attributes.description.en}
                    </Text>
                    </View>
                    
                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        colors={["#000000eA", "#000000dA","#000000AA","#00000000"]}
                        style={{
                          flex:1,
                          justifyContent:"flex-end",
                          alignItems:"center",
                          height:70,
                          position:"absolute",
                          bottom:0,
                          width:"100%"
                        }}
                      >
                        <TouchableOpacity
                            onPress={() =>{
                               setR(r==0.43?1:0.43)
                            }}
                            style={{flex:1,justifyContent:"flex-end",padding:15}}
                        >
                            <Text
                                style={{
                                    color:"tomato",
                                }}
                            > {r==0.43?"see full description":"collapse"}</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>
            <ScrollView style={styles.chapterContainer} nestedScrollEnabled={s}>
                {chapter &&
                    <View>
                    {Object.keys(chapter).reverse().map((el) => (
                      <View key={el}>
                        <View>
                          {Object.keys(chapter[el].chapters)
                            .sort((a, b) => Number(b) - Number(a))
                            .map((ch) => (
                              <TouchableOpacity key={ch} style={styles.ch} onPress={() => navigation.navigate("MangaCh",{
                                  id:chapter[el].chapters[ch].id
                              })}>
                                <Text style={{color:'white',fontSize:15}}>
                                  Chapter - {chapter[el].chapters[ch].chapter}
                                </Text>
                              </TouchableOpacity>
                            ))}
                        </View>
                      </View>
                    ))}
                  </View>
                }
                
            </ScrollView>
            
      </ScrollView>
      
      </View>
  );}
};

export default MangaInfo;


