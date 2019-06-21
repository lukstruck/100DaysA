import React, {Component} from 'react';
import {StyleSheet, View, TextInput, Text, TouchableOpacity} from "react-native";

const style = StyleSheet.create({
    defaultContainerStyle: {
        padding: 0,
        minHeight: 50,
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    defaultTitleStyle: {
        paddingLeft: 16,
        paddingRight: 8,
        fontSize: 16,
    },
});

export default class SettingsTextInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            focusTextInput: false,
        }
    }

    componentDidMount(): void {
        this.setState({loaded: true, text: this.props.text, title: this.props.title});
    }

    render() {
        if (this.state.loaded) {
            return (
                <View style={[style.defaultContainerStyle]}>
                    <Text
                        numberOfLines={1}
                        style={[style.defaultTitleStyle]}
                    >
                        {this.state.title}
                    </Text>
                    <TextInput
                        value={this.state.text}
                        style={{
                            textAlign: "right",
                            paddingRight: 15,
                            color: '#666666',
                            flexGrow: 3,
                            height: 50,
                        }}
                        placeholder="100"
                        onChangeText={val => this.setState({text: val})}
                        onEndEditing={() => this.props.onEndEditing(this.state.text)}
                        returnKeyType="done"
                        keyboardType="number-pad"
                    />
                </View>
            );
        } else
            return null;
    }
}