import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import { Avatar, Button, ScrollView,VStack,Alert,Box, Spinner } from 'native-base';
import styles from './styles';
import DatePicker from 'react-native-modern-datepicker'
import { Modal,useToast,Badge } from 'native-base';
import moment from 'moment'
import { auth,db,app,firebase,storage } from '../firebase';
import validator from 'validator'
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';

const users = db.collection("users") 
const SignUp = ({route,navigation}) => {

    //states
    const toast = useToast({isClosable:true})
    const [upload,setUpload] = useState(true)
    const [uploaded,setUploaded] =useState(false)
    const [show,setShow] = useState(false)
    const [date,setDate] = useState(null)
    const [username,setUsername] =useState(null)
    const [name,setName] = useState(null)
    const [email,setEmail] = useState(null)
    const [img,setImg] = useState(null)
    const [pass,setPass] =useState(null)
    const [repass,setRePass] =useState(null)
    const [pos,setPos] =useState(route?.params?.pos?route.params.pos:0)
    const [phone,setPhone] =useState(null)
    const [phoneCon,setPhCon] = useState(null)
    const [otp,setOTP] = useState(null)
    const [phoneV,setV] = useState(false)
    const scrollRef = useRef(null)
    const recaptchaVerifier = useRef(null);


    //functions
    useEffect(() => {
        console.log(pos)
        scrollRef.current.scrollTo({
            x: (Dimensions.get("window").width*0.85)*(pos), 
            y: 0, 
            animated: true 
        })
        
    },[pos])

    const next = () => {
        switch(pos){
            case 3:
                if(uploaded){
                    return "next"
                }
                else return "skip"
            case 4:
                if(phoneV){
                    return "submit"
                }
                else{
                    return "skip and submit"
                }
            default: return "Next"
        }
    }

    const submit = () =>{
        switch (pos) {
            case 0:
                console.log(date,email,name)
                if(!date || !email || !name){
                    toast.show({
                        title:"Fields Empty",
                        description:"All Fields are mandatory on the current page",
                        status:"warning",
                        placement:"top",
                        width:"90%",
                        
                    })
                
                }
                else if(!validator.isEmail(email)){
                    toast.show({
                        title:"Invalid Email",
                        description:"Enter a valid Email",
                        status:"warning",
                        placement:"top",
                        width:"90%",
                    })
                }
                else{
                    
                    setPos(pos+1)
                }
                break;
            case 2:
                if(!username) {
                    toast.show({
                        title:"Fields Empty",
                        description:"All Fields are mandatory on the current page",
                        status:"warning",
                        placement:"top",
                        width:"90%",
                    })
                }
                else{
                    db.collection("users").where("username","==",username)
                        .get()
                        .then(docs =>{
                            let count = 0
                            docs.forEach((doc) => {
                                count++
                                console.log(doc.id, " => ", doc.data())
                            })
                            if(count!==0){
                                toast.show({
                                    title:"Username not valid",
                                    description:"username is aready taken. Please entry a unique username",
                                    status:"warning",
                                    placement:"top",
                                    width:"90%",
                                })
                            }
                            else{
                                const user = auth.currentUser;
                                user.updateProfile({
                                    displayName:username
                                }).then(() =>{
                                    console.log(user)
                                    const res = users.doc(auth.currentUser.email).update({
                                        username: username
                                    })
                                    setPos(pos+1)
                                }).catch(err => {
                                    console.log(err)
                                })
                                
                                
                            }
                        })
                        .catch(err => console.log(err))
                }
                
                break;
            case 1:
                if(!pass || !repass){
                    toast.show({
                        title:"Fields Empty",
                        description:"All Fields are mandatory on the current page",
                        status:"warning",
                        placement:"top",
                        width:"90%",
                    })
                }
                else{
                    var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*_-])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,32}$/
                    if(!regularExpression.test(pass)){
                        toast.show({
                            title:"Invaild Password",
                            description:"Password must follow following rules:~\n"+
                            "1. Must 8 to 32 charaters long\n"+
                            "2. Must constain one number~\n3. Must have one capital letter\n4. Must have one samll letter~\n"+
                            "5. Must have atleast one of the symbols:-~\n !@#$%^&*_-",
                            status:"warning",
                            placement:"top",
                            width:"90%",
                        })
                    }
                    else if(pass!==repass){
                        toast.show({
                            title:"Invaild Re-type Password",
                            description:"Both password fields should match",
                            status:"warning",
                            placement:"top",
                            width:"90%",
                        })
                    }
                    else{
                        const signIn = async () =>{
                            auth.createUserWithEmailAndPassword(email,pass)
                            .then(user => {
                                toast.show({
                                    title:"Account Created",
                                    description:"Your Account is successfully created\nJust a few more steps to complete registration",
                                    status:"success",
                                    placement:"top",
                                    width:"100%",
                                    isClosable:true,
                                    render: () => <Alert w="100%" status="success">
                                    <VStack space={1}  w="100%" alignItems="center">
                                      <Alert.Icon size="md" />
                                      <Text style={{fontSize:25}}>
                                        Account Created
                                      </Text>
                          
                                      <Box style={{alignItems:"center"}} _text={{
                                      textAlign: "center"
                                    }} _dark={{
                                      _text: {
                                        color: "coolGray.600"
                                      }
                                    }}>
                                       {" Your account is Created\nFew More Steps to complete Sign-UP"}
                                      </Box>
                                    </VStack>
                                  </Alert>})
                                const res = users.doc(auth.currentUser.email).set({
                                    dob: firebase.firestore.Timestamp.fromDate(new Date(date.UTC)),
                                    profile:null,
                                    name:name
                                })
                                setPos(pos+1)
                            })
                            .catch(err => {
                                console.log(err.message)
                                if(err.message=="The email address is already in use by another account."){
                                    toast.show({
                                        title:"Account Created",
                                        description:"Your Account is successfully created\nJust a few more steps to complete registration",
                                        status:"success",
                                        duration:3000,
                                        placement:"top",
                                        width:"100%",
                                        isClosable:true,
                                        render: () => <Alert w="100%" status="error">
                                        <VStack space={1}  w="100%" alignItems="center">
                                          <Alert.Icon size="md" />
                                          <Text style={{fontSize:25}}>
                                            Account Already Created
                                          </Text>
                              
                                          <Box style={{alignItems:"center"}} _text={{textAlign:"center"}}  _dark={{
                                          _text: {
                                            color: "coolGray.600"
                                          }
                                        }}>
                                           {" This account is already in use\nUse another Email-ID or Go to Login "}
                                          </Box>
                                          <Button colorScheme='error' onPress={() => navigation.replace('Login')}>Go to Login</Button>
                                        </VStack>
                                      </Alert>})
                                }
                            })
                        }
                        signIn()
                    }
                }
                break;
            case 3:
                    if(img){
                        if(uploaded){
                            setPos(pos+1)
                        }
                        else{
                            toast.show({
                                title:"Profile Picture not uploaded",
                                description:"Press upload button after changing profile picture",
                                status:"warning",
                                placement:"top",
                                width:"90%",
                            })
                        }
                    }
                    else{
                        setPos(pos+1)
                    }
                    
                break;
            case 4:
                navigation.navigate("Home")
                break;
        }
    }

    //render
  return (
    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <FirebaseRecaptchaVerifierModal
                        ref={recaptchaVerifier}
                        firebaseConfig={app.options}
                        // attemptInvisibleVerification
                    />
        <View style={style1.container}>
            <ScrollView ref={scrollRef} horizontal scrollEnabled={false}>
                <View style={style1.inputSection}>
                    <Text style={styles.FONT_HEADER}>Start with some basic info</Text>
                    <TextInput placeholder='name' placeholderTextColor={"#fff"} style={style1.inputField} autoComplete='name' value={name} onChangeText={setName}/>
                    <TextInput placeholder='email' placeholderTextColor={"#fff"} style={style1.inputField} keyboardType="email-address" autoComplete='email' value={email} onChangeText={setEmail}/>
                    <TouchableOpacity onPress={() => setShow(!show)} style={style1.inputField}>
                        <Text style={{color:"#fff",fontSize:17,}}>{!date?"Select Date of  Birth":date.str}</Text>
                    </TouchableOpacity>
                    
                    <Modal isOpen={show} onClose={() => setShow(false)} >
                        <Modal.Content width="320px" backgroundColor={"#181818"}>
                            <Modal.CloseButton _icon={{color:"tomato",size:5}} />
                        <Modal.Body backgroundColor={"#181818"}>
                            <DatePicker
                            options={{
                                backgroundColor: '#181818',
                                textHeaderColor: 'tomato',
                                textDefaultColor: '#ff5d12',
                                selectedTextColor: '#fff',
                                mainColor: '#F4722B',
                                textSecondaryColor: '#ff5d12',
                                borderColor: 'rgba(122, 146, 165, 0.1)',
                            }}
                            current={moment(new Date()).format("YYYY-MM-DD")}
                            selected={date?date.str:moment(new Date()).format("YYYY-MM-DD")}
                            onDateChange={date => setDate({str:date,UTC:moment(date+" +0530","YYYY/MM/DD Z")})}
                            mode="calendar"
                            minuteInterval={30}
                            style={{ borderRadius: 10,width:"100%",marginTop:25 }}
                            />
                        </Modal.Body>
                        </Modal.Content>
                    </Modal>
                </View>                
                <View style={style1.inputSection}>
                    <Text style={[styles.FONT_HEADER,{fontSize:30,marginBottom:10}]}>Set Your Password</Text>
                    <TextInput placeholder='Password' placeholderTextColor={"#fff"} value={pass} onChangeText={setPass} secureTextEntry style={style1.inputField} keyboardType="ascii-capable"  />
                    <TextInput placeholder='Re-type Password' placeholderTextColor={"#fff"} value={repass} onChangeText={setRePass} secureTextEntry style={style1.inputField}/>
                </View>
                <View style={[style1.inputSection]}>
                    <Text style={[styles.FONT_HEADER,{fontSize:35,marginBottom:10}]}>Set Your Username</Text>
                    <TextInput placeholder='Username' value={username} placeholderTextColor={"#fff"} style={style1.inputField} onChangeText={setUsername}/>
                </View>
                <View style={style1.inputSection}>
                    <Text style={[styles.FONT_HEADER,{fontSize:35,marginBottom:10}]}>{"Set Your\nProfile picture "}<Text style={{fontSize:20}}>(optional)</Text></Text>
                    {upload?
                        <View>
                        <TouchableOpacity style={{alignSelf:"center",margin:10,flexDirection:'row',justifyContent:"center"}}
                        onPress={async () => {
                            let result = await ImagePicker.launchImageLibraryAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.All,
                                allowsEditing: true,
                                quality: 1,
                              });
                          
                              console.log(result);
                              
                              if (!result.cancelled) {
                                  if(img?.uri==result.uri){

                                  }
                                  else{
                                    setImg(result);
                                    setUploaded(false)
                                  }
                                
                              }
                              
                        }} >
                            <Avatar source={img?{uri:img.uri}:require("../assets/logo.png")} size={"2xl"} borderWidth={2} borderColor={"tomato"} />
                            {uploaded && <Badge // bg="red.400"
                                colorScheme="success" rounded="full" zIndex={1} variant="solid" style={{
                                    position:"absolute",
                                    top:0,
                                    right:0,
                                    height:40,
                                    width:40,
                                    justifyContent:'center'
                                }} alignSelf="flex-end" _text={{
                                    fontSize: 32
                                }}>
                                    <AntDesign name="check" size={24} color="black" />
                            </Badge>}
                        </TouchableOpacity>
                        <Button style={{backgroundColor:"#FF7057",width:"40%",alignSelf:"center"}} _text={{fontWeight:"700",color:"#000"}}
                            disabled={uploaded} 
                            onPress={() =>{
                                const uploadImg = async() =>{
                                    setUpload(false)
                                    const user = auth.currentUser;
                                    const ref = storage.ref()
                                    console.log(username+(img.uri).substring((img.uri).lastIndexOf(".")))
                                      const profileRef = ref.child("profilePic").child(username+(img.uri).substring((img.uri).lastIndexOf(".")))
                                      const blob = await new Promise((resolve,reject) =>{
                                        const xhr = new XMLHttpRequest();
                                        xhr.onload = function () {
                                            resolve(xhr.response)
                                        }
                                        xhr.onerror = function () {
                                            reject(new TypeError("Network request failed"))
                                        }
                                        xhr.responseType ="blob"
                                        xhr.open("GET",img.uri, true)
                                        xhr.send(null)
                                      })
                                      profileRef.put(blob,{contentType:"image/png"})
                                        .then(res => res.ref.getDownloadURL())
                                        .then(url => user.updateProfile({
                                            photoURL:url
                                        }).then(() =>{
                                            const res = users.doc(auth.currentUser.email).update({
                                                profile:url
                                            })
                                            console.log(user)
                                            setUpload(true)
                                            setUploaded(true)
                                            
                                        }).catch(err => {
                                            console.log(err)
                                        }))
                                        .catch(err => console.log(err))
                                      
                                    }
                                    if(img?.uri){
                                        uploadImg()
                                    }
                                    
                            }}
                        >
                                {uploaded?"Uploaded":"Upload"}
                        </Button>
                        </View>

                        :
                        <View>
                            <Spinner size={'lg'} color={'tomato'} />
                        </View>
                    }
                    
                </View>
                <View style={style1.inputSection}>
                    
                    <Text style={[styles.FONT_HEADER,{fontSize:35,marginBottom:10}]}>{"Set Your \nPhone Number "}<Text style={{fontSize:20}}>(optional)</Text></Text>
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:"center"}}>
                        <TextInput placeholder='Phone' placeholderTextColor={"#fff"} keyboardType='phone-pad' style={[style1.inputField,{width:"70%"}]} autoComplete='tel' value={phone} onChangeText={setPhone}/>
                        <Button style={{backgroundColor:"#FF7057",height:"70%"}} _text={{fontWeight:"700",color:"#000"}} 
                        onPress={async () => {
                            if(!phone){
                                toast.show({
                                    title:"Phone Number cannot be Empty",
                                    description:"Phone number cannot be Empty for verification",
                                    status:"warning",
                                    placement:"top",
                                    width:"90%",
                                })
                            }
                            else if(!validator.isMobilePhone(phone) || phone.length != 10){
                                toast.show({
                                    title:"Invalid Phone number",
                                    description:"Please Enter valid phone Number",
                                    status:"warning",
                                    placement:"top",
                                    width:"90%",
                                })
                            }
                            else{
                                const phoneProvider = new firebase.auth.PhoneAuthProvider();
                                const vid = await phoneProvider.verifyPhoneNumber(
                                    "+91"+phone,
                                    recaptchaVerifier.current
                                  )
                                setPhCon(vid)
                                console.log(vid)
                            }
                        }} >
                            Verify
                        </Button>
                    </View>
                    
                    {phoneCon && <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:"center"}}>
                        <TextInput placeholder='OTP' placeholderTextColor={"#fff"} keyboardType='phone-pad' style={[style1.inputField,{width:"70%"}]} autoComplete='tel' value={otp} onChangeText={setOTP} maxLength={6}/>
                        <Button style={{backgroundColor:"#FF7057",height:"70%"}} _text={{fontWeight:"700",color:"#000"}} 
                        onPress={async () => {
                            try{const phoneProvider = new firebase.auth.PhoneAuthProvider.credential(
                                phoneCon,
                                otp
                              );
                            console.log(phoneProvider)
                            const user = auth.currentUser
                            user.linkWithCredential(phoneProvider)
                            .then((usercred) => {
                              var user = usercred.user;
                              console.log("Account linking success", user);
                            }).catch((error) => {
                              console.log("Account linking error", error);
                            })
                            toast.show({
                                title:"Phone number verified",
                                status:"success",
                                placement:"top",
                                width:"90%",
                            })
                            }
                            catch(ex){
                                console.log(ex)
                                toast.show({
                                    title:"Error",
                                    description:ex,
                                    status:"error",
                                    placement:"top",
                                    width:"90%",
                                })
                            }
                            }} >
                            Submit
                        </Button>
                    </View>}
                </View>
            </ScrollView>
            <View style={{
                flexDirection:'row',
                justifyContent:"space-between",
                width:"100%",
                padding:10
            }}>
                <Button style={{backgroundColor:"#FF7057"}} _text={{fontWeight:"700",color:"#000"}}
                    onPress={() => {
                        if(route?.params?.pos){
                            if(pos>2){
                                if(scrollRef.current){
                                    setPos(pos-1)
                                }
                            }
                        }
                        else if(pos>0){
                            if(scrollRef.current){
                                setPos(pos-1)
                            }
                        }
                        else{
                            navigation.replace('Login')
                        }
                    }} >
                        {pos>0?"Back":"Go to Login"}</Button>
                <Button style={{backgroundColor:"#FF7057"}} _text={{fontWeight:"700",color:"#000"}} onPress={() => submit()}>{next()}</Button>
            </View>
        </View>
    </View>
  );
};

export default SignUp;

const style1 = StyleSheet.create({
    container:{
        width:"85%",
        backgroundColor:"#151515",
        borderRadius:10
    },
    inputSection:{
        width:Dimensions.get("window").width*0.85,
        padding:10,
        justifyContent:"center"
    },
    inputField:{
        padding:10,
        color:"#fff",
        fontSize:17,
        borderBottomWidth:1,
        borderBottomColor:"#fff",
        width:"90%",
        alignSelf:"center",
        marginBottom:10
    }
})