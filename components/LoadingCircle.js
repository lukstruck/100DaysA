import React, {Component} from 'react';
import {Circle} from 'react-native-progress';
import {View} from "react-native";


export default class LoadingCircle extends Component {
    render() {
        return (
            <View style={{paddingTop: 150}}>
                <Circle style={{alignSelf: 'center'}}
                        size={100}
                        thickness={5}
                        borderWidth={5}
                        indeterminate={true}/>
            </View>
        );
    }
}