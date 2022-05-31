import { Image, StyleSheet, Text, View,Dimensions,PixelRatio } from 'react-native';
import React, { useEffect,useState } from 'react';
import { Spinner } from 'native-base';

const ScalesImage = ({source,width}) => {
    const w = width? width:Dimensions.get("window").width
    const [h,setH] =useState(200)
    const [load,setLoad] = useState(false)

    const imgLoad = () =>{
        Image.getSize(source,(wi,hi)=>{
          setH((w-20)*hi/wi)
      })
      
    }

    useEffect(() =>{

        imgLoad()
       
        
    },[])
    return (
      <View style={
        {
          minheight:200,
          justifyContent:'center',
          alignItems:'center'
        }
      }>
        {load && <View style={{
          position:'absolute',
          width:w,
          height:h,
          justifyContent:'center',
          alignItems:'center',
          zIndex:1000
        }}>
        <Spinner size={'lg'} color={'tomato'} />
        </View>}
        
        <Image source={{uri:source,height:PixelRatio.getPixelSizeForLayoutSize(h),width:PixelRatio.getPixelSizeForLayoutSize(w)}} style={{width:w,height:h,resizeMode:'contain'}} onLoadStart={() => {
          
          setLoad(true)}} 
          onLoadEnd={()=> {
          setLoad(false)
        }} />
        </View>
      
    );
  
};

export default ScalesImage;

const styles = StyleSheet.create({});
