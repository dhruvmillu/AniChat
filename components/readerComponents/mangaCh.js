import { View } from 'native-base';
import React, { useState, useEffect } from 'react';
import { Dimensions, FlatList,Image,Text } from 'react-native';
import styles from '../styles';
import ScalesImage from './scalesImage';

const MangaCh = ({route,navigation}) => {
    const [info,setInfo] = useState(null)
    const w = Dimensions.get("window").width
    const [link,setLink] = useState(null)
    const [data,setData] = useState(null)
    const [width,setWidth] = useState(null)
    const [widthL,setLWidth] = useState([])
    const [id,setId] =useState(route.params.id)
    async function load(){
        let temp = await fetch("https://api.mangadex.org/at-home/server/" + id);
        let res = await temp.json();
        console.log(res)
        setLink(res.baseUrl+"/data/"+res.chapter.hash+"/")
        setInfo(res.chapter.data);
    }
    useEffect(()=>{
        load()
        
    },[])
    return(
         <FlatList
            data={info}
            keyExtractor={(item)=>item}
            style={{flex:1}}
            renderItem={ ({item})=><ScalesImage source={link+item}/>}
        />
    )

}

export default MangaCh