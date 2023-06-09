import { StyleSheet, Text, TouchableOpacity, View, TextInput, Button, Animated, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Avatar from '../../components/Avatar'
import ImagePicker, { launchImageLibrary, Asset, ImagePickerResponse, launchCamera } from 'react-native-image-picker';
import SvgImage from '../../components/Icons/Image';
import SvgPlus from '../../components/Icons/Plus';
import SvgCamera from '../../components/Icons/Camera';
import SvgClose from '../../components/Icons/Close';
import UserAuth from '../../features/hooks/UserAuth';
import { useSelector, useDispatch } from 'react-redux';
import { StoreType, AppDispatch } from '../../redux';

import { postPostThunk } from '../../redux/slice/PostSlice';
import 'react-native-url-polyfill/auto';
import { Configuration, OpenAIApi } from "openai";
import AnimatedLottieView from 'lottie-react-native';


const ShareScreen = ({ navigation }: any) => {
    const configuration = new Configuration({
        apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);
    const generateImage = async () => {
        setLoading(true)
        setImageUri('')

        const response = await openai.createImage({
            prompt: content,
            n: 1,
            size: "512x512",
        }).then(res => {
            setImageUri(res.data.data[0].url)
            console.log(res.data.data[0])
            console.log('timeoyt');

            setTimeout(() => {
                setLoading(false)

            }, 2500)
        }

        )
    };
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch<AppDispatch>();
    const state = useSelector((state: StoreType) => state.postSlice)
    const [status, userId, loadings] = UserAuth()
    const user = useSelector((state: StoreType) => state.userSlice.user)
    const [image, setImage] = useState<any>(null);
    const [content, setStatus] = useState<string>('')
    const [animation] = useState(new Animated.Value(0));
    const [open, isOpen] = useState<boolean>(false)
    const [imageUri, setImageUri] = useState<any>('');

    const [isAi, setAi] = useState(false)
    const [prompt, setPromt] = useState<string>('')
    const publishPost = () => {

        if (isAi) {
            const form = new FormData();
            form.append('photourl', imageUri)
            form.append("userId", userId)

            dispatch(postPostThunk(form))
            navigation.navigate("Home")
            setImageUri('')
            setStatus('')

        } else {
            const form = new FormData();
            if (image) {
                form.append("photos", {
                    name: image.fileName, // Whatever your filename is
                    uri: image.uri, //  file:///data/user/0/com.cookingrn/cache/rn_image_picker_lib_temp_5f6898ee-a8d4-48c9-b265-142efb11ec3f.jpg
                    type: image.type, // video/mp4 for videos..or image/png etc...
                });
            }

            form.append("content", content)
            form.append("userId", userId)

            dispatch(postPostThunk(form))

            navigation.navigate("Home")
        }

    }
    //#region image
    const takeImage = () => launchCamera({
        mediaType: 'mixed',
        saveToPhotos: true
    }, (res: ImagePickerResponse) => {

    })

    const setStatusHandler = (value: string) => {
        setStatus(value)

        if (value[0] === '/') {
            setAi(true)
        }
        else {
            setAi(false)
        }
    }



    const pickImage = () => {
        launchImageLibrary({
            mediaType: 'photo',
        }, (res: ImagePickerResponse) => {
            if (res.assets && res.assets.length > 0) {
                const asset: Asset = res.assets[0];
                setImage(asset)
                setImageUri(asset.uri);
            }
        })
    };

    const startAnimation = () => {

        Animated.timing(animation, {
            toValue: open ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
        isOpen(!open)
    };
    //#endregion image
    return (
        <SafeAreaView>
            {
                state.loading == 'pending' ? <ActivityIndicator /> :
                    <View>

                        <View style={styles.header}>
                            <TouchableOpacity>
                                <Text style={styles.discard}>Discard</Text>
                            </TouchableOpacity>
                            <Text style={styles.title}>CREATE</Text>
                            <TouchableOpacity style={styles.publishbtn} onPress={publishPost}>
                                <Text style={styles.publishtitle}>Publish</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.form} >
                            <Avatar source={user.profilePicture} name={user.username} />
                            {
                                isAi ?
                                    <View style={styles.ai}>
                                        <Image source={require('../../assets/images/chip.png')} style={{ width: 32, height: 32 }} />
                                        <TextInput multiline={true} numberOfLines={4}
                                            placeholder="Ask AI for image"
                                            placeholderTextColor={'red'}
                                            value={content}
                                            autoFocus
                                            onChangeText={setStatusHandler}
                                            style={{ color: "white", fontSize: 16, width: '77%' }}
                                        />
                                    </View> :
                                    <TextInput multiline={true} numberOfLines={4}
                                        placeholder="What's on your mind? Or use '/' for AI"
                                        placeholderTextColor={'#727477'}
                                        value={content}
                                        autoFocus
                                        onChangeText={setStatusHandler}
                                        style={{ color: "white", fontSize: 16, width: '90%' }}
                                    />
                            }
                        </View>
                        <View style={styles.mediastyle}>
                            <TouchableOpacity onPress={startAnimation} style={styles.openmedia}>
                                {
                                    !open ?
                                        <SvgPlus width={16} height={16} stroke={'#fff'} /> : <SvgClose width={16} height={16} stroke={'#fff'} />
                                }

                            </TouchableOpacity>
                            {
                                isAi ?
                                    <Button title='ask AI' onPress={generateImage} /> : null
                            }
                            <Animated.View style={[{ display: open ? "flex" : 'none', opacity: animation, flexDirection: "row", }, ...[styles.media]]}>
                                <TouchableOpacity onPress={pickImage}>
                                    <SvgImage width={20} height={20} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={takeImage}>
                                    <SvgCamera width={20} height={20} />
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                        <View style={styles.imagewrap}>
                            {
                                loading ?
                                    <AnimatedLottieView
                                        autoPlay
                                        loop
                                        style={{ width: '100%' }}
                                        source={require('../../assets/animation/ailoading.json')}
                                    /> : null
                            }
                            {imageUri && <Image source={{ uri: imageUri }} style={styles.pickedimage} />}

                        </View>
                    </View>

            }

        </SafeAreaView >
    )
}

export default ShareScreen

const styles = StyleSheet.create({
    ai: {
        flexDirection: "row",
        gap: 8,
        width: '100%'
    },
    title: {
        color: "#ECEBED",
        fontWeight: "700",

    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 24
    },
    discard: {
        fontWeight: "700",
        color: '#2E8AF6'
    },
    publishbtn: {
        backgroundColor: "#F62E8E",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 24
    },
    publishtitle: {
        color: "#FFFFFF",
        fontWeight: "700"
    },
    form: {
        marginHorizontal: 24,
        marginTop: 36,
        flexDirection: "row",
        gap: 12
    },
    mediastyle: {
        flexDirection: "row",
        marginHorizontal: 24,
        gap: 12,
        alignItems: "center",
        marginTop: 24
    },
    openmedia: {
        color: "white",
        borderWidth: 1,
        borderColor: "#323436",
        borderRadius: 26,
        padding: 8,
        justifyContent: "center",
        alignItems: "center"
    },
    media: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        gap: 16,
        backgroundColor: "#323436",
        borderRadius: 32
    },
    pickedimage: {
        resizeMode: "contain",
        marginTop: 20,
        width: "100%",
        height: 400
    },
    imagewrap: {
        alignItems: "center"
    }
})
