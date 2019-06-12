import {AppLoading} from 'expo';
import React, {Component} from 'react';
import {View, Text, Linking, TouchableOpacity} from 'react-native';

export default class HomeScreen extends Component {

    static navigationOptions = {
        title: 'Home',
    };

    state = {isReady: false};

    async _cacheResourcesAsync() {
    }

    donate() {
        let url = "https://paypal.me/lukstruck";
        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    console.log("Can't handle url: " + url);
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    }

    render() {
        if (!this.state.isReady) {
            return (
                <AppLoading
                    startAsync={this._cacheResourcesAsync}
                    onFinish={() => this.setState({isReady: true})}
                    onError={console.warn}
                />
            );
        }

        this.props.navigation.navigate("List");
        return (
            <View style={styles.main}>
                <Text style={[styles.text, styles.header]}>Thank you for using 100DaysA!</Text>
                <View style={{padding: 5}}>
                    <Text style={styles.text}>If you like the app, you can leave a review on the App Store or donate
                        some money:</Text>
                    <View>
                        <TouchableOpacity onPress={this.donate}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Donate to me via Paypal!</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.text}>This app is completely free. All functionality is free, forever. Donating
                        will only help out the developer ❤️</Text>
                    <Text style={styles.text}>This is all the information, now go</Text>
                </View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("List")}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Start the challenge!</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = {
    main: {
        padding: 25,
        paddingTop: 20,
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
    },
    text: {
        paddingTop: 10,
        fontSize: 20,
    },
    header: {
        alignSelf: 'center',
        fontSize: 40,
        fontWeight: 'bold',
    },
    button: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    buttonText: {
        padding: 5,
        color: '#007aff',
        fontSize: 30,
    },
};