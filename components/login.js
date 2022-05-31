import { StyleSheet, Text, View } from 'react-native';
import React, {useState} from 'react';
import { TextInput } from 'react-native';
import { Avatar,Button,useToast } from 'native-base';
import { auth } from '../firebase';
import { useEffect } from 'react';



const Login = ({route,navigation}) => {

  //states and variables
  const toast = useToast()
  const [email,setEmail] = useState(null)
  const [password,setPassword] = useState(null)
  const [authState, setAuthState] = useState({
    isSignedIn: false,
    pending: true,
    user: null,
  })
  //functions
  const login = () => {
    if(!email){
      toast.show({
        title:"Invaild Email",
        description:"Email cannot be empty",
        status:"error",
        placement:"top",
        width:"90%",
      })
    }
    else if(!password){
      toast.show({
        title:"Invaild Password",
        description:"Password cannot be empty",
        status:"error",
        placement:"top",
        width:"90%",
      })
    }
    else{
      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          console.log(user.displayName)
          if(!user.displayName){
              toast.show({
                title:"Uername Not set",
                description:"Since Your username is not set we will redirect you to signUp page to set username",
                status:"error",
                placement:"top",
                width:"90%",
              })
            navigation.replace('SignUp',{
              pos:2
            })
          }
          else{
            navigation.replace('Home')
          }
          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          if(errorCode ==="auth/invalid-email"){
            toast.show({
              title:"Invaild Email",
              description:"Email not vaild",
              status:"error",
              placement:"top",
              width:"90%",
            })
          }
          else if(errorCode ==="auth/wrong-password"){
            toast.show({
              title:"Incorrect Password",
              description:"Password in incorrect",
              status:"error",
              placement:"top",
              width:"90%",
            })
          }
          else if(errorCode ==="auth/user-not-found"){
            toast.show({
              title:"Account does not exists",
              description:"Please check email-ID or go to SignUp",
              status:"error",
              placement:"top",
              width:"90%",
            })
          }
          else
          console.log(errorCode,errorMessage)
        })
    }
    
  }

  useEffect(()=>{
    auth.onAuthStateChanged(user =>{
      
      if(user){
        if(!user.displayName){
          console.log(route.name,"huuhuu")
          toast.show({
            title:"Username Not set",
            description:"Since Your username is not set we will redirect you to signUp page to set username",
            status:"error",
            placement:"top",
            width:"90%",
          })
        navigation.replace('SignUp',{
          pos:2
        })
      }
      else{
        navigation.replace('Home')
      }
      // ...
      }
    })
  },[])
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <View style={styles.container}>
        <Avatar source={require("../assets/logo.png")} borderWidth={2} borderColor={"#ff3814"} size={"2xl"} marginBottom={5}>AC</Avatar>
        <TextInput 
          value={email} 
          onChangeText={setEmail} 
          style={styles.inputTextStyle} 
          placeholder="Email" 
          placeholderTextColor={"tomato"} 
          textAlign='center'
        />
        <TextInput 
          value={password} 
          onChangeText={setPassword} 
          style={styles.inputTextStyle} 
          placeholder="Password" 
          placeholderTextColor={"tomato"} 
          textAlign='center' 
          secureTextEntry 
        />
        <View style={{width:'100%',padding:10,flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
          <Button style={styles.buttonContainer}  _text={{textAlign:'center',color:"black",fontWeight:"700"}} onPress={() => navigation.replace('SignUp')}>Sign Up</Button>
          <Button style={styles.buttonContainer}  _text={{textAlign:'center',color:"black",fontWeight:"700"}} onPress={()=>login()}>Login</Button>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container:{
      backgroundColor:"#191919",
      width:"80%",
      justifyContent:'center',
      alignItems:'center',
      padding:20,
      borderRadius:10
  },
  inputTextStyle:{
      width:"100%",
      margin:0,
      color:'#ff3814',
      fontSize:15,
      borderBottomColor:'#ff3814',
      borderBottomWidth:1,
      padding:10,
      fontWeight:'700'
  },
  buttonContainer:{
      backgroundColor:'#ff3814',
      width:"40%"
  }
});
