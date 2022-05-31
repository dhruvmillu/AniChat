import { StyleSheet, Text, View,ScrollView,FlatList ,Image} from 'react-native'
import React from 'react'
import styles from '../styles'
import ScalesImage from '../readerComponents/scalesImage'
import { Button } from 'native-base'
import { useNavigation } from '@react-navigation/native'

const Message = ({data,user}) => {
    const navigation = useNavigation()

    const display = () =>{
        switch(data.data?.type){
            case "manga-pg": return <View style={{minHeight:100,maxHeight:400,marginBottom:10}}>
            <ScrollView nestedScrollEnabled>
                <ScalesImage source={data.data.data.img} width={250}/>
            </ScrollView>
            <View style={{padding:10}}>
                
                <Text style={[{color:"#fff",fontSize:20}]}>{data.data.data.chdata.title}</Text>
                <Text style={[{color:"#fff",fontSize:20}]}>Chapter - {data.data.data.chdata.chapter}</Text>
                <Text style={[{color:"#fff",fontSize:20}]}>Page - {data.data.index}</Text>
            </View>
        </View>

            case "manga-ch": return <View style={{ marginBottom: 10,maxHeight:400,justifyContent:'space-between' }}>
            <ScrollView nestedScrollEnabled style={{maxHeight: 300}}>
                <Image source={{uri:data.data.data.link + data.data.data.info.data}} style={{height:300,resizeMode:'contain'}} />
                {console.log(data)}
            </ScrollView>
            <View style={{minHeight:100,maxHeight:150,marginBottom:10}}>
                <View ><Text adjustsFontSizeToFit style={{color: "tomato",
                              fontWeight:"700",
                              fontSize:30,
                              maxHeight:70}}>{data.data.data.info.info.title}</Text></View>
            
            <Button style={{backgroundColor:"#000"}} onPress={() => {navigation.navigate('MangaCh',{id:data.data.data.info.info.id})}}>
                
              <Text adjustsFontSizeToFit style={{color: "tomato",
                              fontWeight:"700",
                              fontSize:30,
                              maxHeight:70}}>
                Chapter - {data.data.data.info.info.chapter}
              </Text>
            </Button>
              
            </View>  
          </View>
          case 'manga': return <View
          style={{ maxHeight: 400, marginBottom: 10,alignItems:"center" }}
        >
            {console.log(data.data)}
            
            <Image source={{uri:data.data.data.coverImage}}
                          style={{
                              resizeMode: "contain",
                              justifyContent: "flex-end",
                              height: 245, width: 170
                            }}
  
                  />
                  <View >
                  <Button style={{backgroundColor:"#000"}} onPress={() => {navigation.navigate('MangaInfo',data.data.data)}}>
                            <Text adjustsFontSizeToFit
                            style={[{
                              color: "tomato",
                              fontWeight:"700",
                              fontSize:30,
                              maxHeight:70
                            }]}
                          >
                            {data.data.data.title}
                          </Text>
                  </Button>
                          
                      </View>
        </View>
            default: return <Text style={data.sender==user.id?styles1.sentMessageText:styles1.recievedMessageText}>{data.data}</Text>
        }
    }


    if(data.sender){
        return (
            <View style={data.sender==user.id?styles1.sentMessage:styles1.recievedMessage}>
                <Text style={data.sender==user.id?{color:"tomato",alignSelf:"flex-end",fontSize:20,fontWeight:"700"}:{color:"tomato",fontSize:20,fontWeight:"700"}}>{data.username}</Text>
              <View style={{backgroundColor:"#222",
              padding:10,
              borderRadius:10}}>
                
              <View style={data.sender==user.id?styles1.sentMessageText:styles1.recievedBox}>{display()}</View>
              </View>
          </View>
        )
    }
    console.log(data.sender,user.id)

  
}

export default Message

const styles1 = StyleSheet.create({
    sentMessage:{
        flex:1,
        alignSelf:"flex-end",
        maxWidth:"75%",
        marginHorizontal:10,
        marginVertical:5
    },
    recievedMessage:{
        flex:1,
        alignSelf:"flex-start",
        maxWidth:"75%",
        marginHorizontal:10,
        marginVertical:5
    },
    sentMessageText:{
        color:"white",
        fontSize:16,
        alignSelf:"flex-end",
    },
    recievedMessageText:{
        color:"white",
        fontSize:16,
    },
    recievedBox:{
    }
})