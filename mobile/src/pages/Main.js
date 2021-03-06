import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
    View,
    SafeAreaView,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';

export default function Main({ navigation }) {
    const _id = navigation.getParam('_id');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function loadUsers() {
            const users = await api.users(_id);
            setUsers(users);
        }

        loadUsers();
    }, [_id])

    async function handleLike() {
        const [user, ...tail] = users;

        await api.like(user._id, _id);
        setUsers(tail);
    }

    async function handleDislike() {
        const [user, ...tail] = users;

        await api.dislike(user._id, _id);
        setUsers(tail);
    }

    async function handleLogout() {
        await AsyncStorage.clear();
        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image style={styles.logo} source={logo} />
            </TouchableOpacity>

            <View style={styles.cardsContainer}>
                {users.length === 0 ? (
                    <Text style={styles.empty}>Acabou :(</Text>
                ) : (
                        users.map((user, index) => (
                            <View key={user._id} styles={[styles.card, { zIndex: users.length - index }]}>
                                <Image style={styles.avatar} source={{ uri: user.avatar }} />
                                <View style={styles.footer}>
                                    <Text style={styles.name}>{user.name}</Text>
                                    <Text numberOfLines={3} style={styles.bio}>{user.bio}</Text>
                                </View>
                            </View>
                        ))
                    )}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleDislike} style={styles.button}>
                    <Image source={dislike}></Image>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleLike} style={styles.button}>
                    <Image source={like}></Image>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    logo: {
        marginTop: 30,
    },

    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },

    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    avatar: {
        flex: 1,
        height: 300,
    },

    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },

    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18,
    },

    buttonContainer: {
        flexDirection: 'row',
        marginBottom: 30,
    },

    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold',
    },
});
