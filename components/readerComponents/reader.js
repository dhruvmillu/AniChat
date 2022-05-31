import {createDrawerNavigator} from '@react-navigation/drawer'
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React,{useState,useEffect,useLayoutEffect} from 'react';
import {AntDesign,Feather} from '@expo/vector-icons'
import { Avatar, ListItem } from 'react-native-elements';
import {DarkTheme} from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient';
import { Spinner,Modal } from 'native-base';
import Account from '../account';
import { auth,db,firebase } from '../../firebase';
import styles from '../styles';

const Drawer = createDrawerNavigator()
const user = db.collection("users")
const MangaList = ({route,navigation}) =>{
    const [data,setData] = useState([])
    const [showSearch,setSS] =useState(false)
    const [search,setSearch] =useState(null)
    const [cur,setCur] =useState(0)
    const [load,setLoad] =useState(true)
    const [total,setTotal] = useState(0)
    const [show,setShow] = useState(false)
    const curUser = auth.currentUser
    const [modalData,setMdata] =useState(null)
    const [page,setPage] = useState(route?.params?.bookmark?true:false)
    const SearchBar = () =>{
        return(
            <View>
                <TextInput placeholder='Search' value={search} placeholderTextColor={"white"} style={{color:"white",fontSize:20,width:250}} onChangeText={val => setSearch(val)}/>
            </View>
        )
    }

    async function manga() {
        
        try {
          let res = await fetch(
            "https://api.mangadex.org/manga?contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&offset=" +
              cur * 10 +
              "&order[relevance]=desc&title=" +
              search +
              "&limit=100"
          );
          let result = await res.json();
          let z = result.data.map((id) => {
            return id.id;
          })
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

          return itemEm
        } catch (e) {
            console.log(e)
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
        } catch (e) {
          console.log(e);
        }
        return title;
      }
      async function loadBookmarks(){
        var arr =[] 
        user.doc(auth.currentUser.email).collection('bookmark').onSnapshot( res => {
          setData([])
          console.log(data,"dwefwef")
          arr=[]
          setLoad(false)
          res.docs.map(doc => { 
            var id =doc.id
            var attributes = {coverName:doc.data().coverName,title:{en:doc.data().title}}
            if(search){
              if(doc.data().title.toLowerCase().includes(search.toLowerCase())){
                arr.push({id,attributes})
              }
            }
            else{
              arr.push({id,attributes})
            }
            setData(arr)
            
            
          })
          setLoad(true)
        })
        console.log()
        
          console.log(arr)
          return arr

      }
    useEffect(() => {
      console.log(page,auth.currentUser.email)
        if(page){
          console.log("bookmark")
          const tdata = async () => {
            
            setData(await loadBookmarks())
            
        }
        tdata()
        }
        else{
          const tdata = async () => {
            setLoad(false)
            setData(await manga())
            setLoad(true)
        }
        tdata()
        }
        
        
    },[search])
    useEffect(()=>{
      console.log(data)
    },[data])
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle:showSearch?() => <SearchBar/>:route.title,
            headerLeft:() => (
                <TouchableOpacity style={{marginLeft:10}} onPress={() => navigation.toggleDrawer()}>
                    <Avatar size={40} source={curUser?.photoURL?{uri:curUser?.photoURL}:require("../../assets/logo.png")} rounded={true}/>
                </TouchableOpacity>
            ),
            headerRight:() => (
                <TouchableOpacity style={{marginRight:10}} onPress={() => {
                  if(!showSearch){
                    setSearch(null)
                  }
                  setSS(!showSearch)}}>
                    <AntDesign name={showSearch?"close":"search1"} size={24} color="white" />
                </TouchableOpacity>
            )
        })
    },[navigation,showSearch])
    const display = () =>{
        if(load){
            if(data?.length>0){
                return <FlatList
                data={data}
                keyExtractor={item => item.id}
                key={2}
                numColumns={2}
                renderItem={({item}) => (
                    <TouchableOpacity style={{margin:5}} 
                    onPress={() => navigation.navigate("MangaInfo",{
                        title:titles(item),
                        coverImage:"https://uploads.mangadex.org//covers/" +
                        item.id +
                        "/" +
                        item.attributes.coverName,
                        id:item.id,
                        bookmark:route.params?.bookmark? route.params.bookmark : false
                    })}>
                        {console.log(item)}
                        <Image source={{uri:"https://uploads.mangadex.org//covers/" +
                        item.id +
                        "/" +
                        item.attributes.coverName}}
                        style={{
                            resizeMode: "contain",
                            justifyContent: "flex-end",
                            height: 245, width: 170
                          }}

                />
                <View
                      style={{
                        height: "30%",
                        width:"100%",
                        position:"absolute",
                        bottom:0,
                        
                      }}
                    >
                      <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        colors={["#000000eA", "#000000eA","#000000bA","#00000000"]}
                        style={{
                          flex: 1,
                          justifyContent: "flex-end",
                          padding: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: "tomato",
                            fontWeight:"700"
                          }}
                        >
                          {titles(item)}
                        </Text>
                      </LinearGradient>
                    </View>
                    </TouchableOpacity>
                )}
                style={{
                    flex:1,
                }}
            />
            }
            else{
                return <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Text style={[styles.FONT_HEADER,{width:"70%"}]}>No manga available</Text>
            </View>
            }
            
        }
        else{
            return <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Spinner color={"tomato"} size={"lg"}/>
            </View>
        }
    }

  return (
    <View style={styles1.conntainer}>
      {display()}
    </View>
  );
}



const Reader = () => {
  return (
    <Drawer.Navigator screenOptions={{
      drawerActiveBackgroundColor:'tomato',
      drawerActiveTintColor:'#000',
      drawerInactiveTintColor:'tomato',
      drawerStyle: {
        backgroundColor: '#222',          
        width: 240,
      },
      swipeEnabled:true,
      drawerType:"slide",
      swipeEdgeWidth:200,
      headerStyle:{
        backgroundColor:"#333333"
      },
      headerTitleStyle:{
          color:"tomato",
          fontSize:30
      }
    }}
    >
      <Drawer.Screen name="Bookmarks" component={MangaList} initialParams={{bookmark:true}}/>
        <Drawer.Screen name='mangaList' component={MangaList} options={{headerShown:true,title:"Global"}} initialParams={{bookmark:false}} />
        
    </Drawer.Navigator>
  );
};

export default Reader;

const styles1 = StyleSheet.create({
    conntainer:{
      flex:1,
      backgroundColor:"#000"
    }
    
  });
