import React, {Component} from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import Storage from '../components/Storage';

export default class FlatListBasics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: "",
            listNames: [],
        };

        this.deleteList = this.deleteList.bind(this);
        this._onPressButton = this._onPressButton.bind(this);
        this.switchTo = this.switchTo.bind(this);

        const {navigate} = this.props.navigation;
        this.navigate = navigate;
    }

    async componentDidMount() {
        this.setState({
            goal: "",
            bgColor: "white",
        });
        Storage.getLists().then((err, result) => {
            this.setState({
                listNames: result
            })
        });
    }

    async _onPressButton() {
        if (this.state.goal !== "") {
            await Storage.addList(this.state.goal);
            Storage.getLists().then((err, result) => this.setState({listNames: result, goal: ""}));
        } else
            this.setState({bgColor: "red"})
    }

    async deleteList(list) {
        await Storage.deleteList(list);
        Storage.getLists().then((err, result) => this.setState({listNames: result}));
    }

    async switchTo(list) {
        this.props.navigation.push("Progress", {list: list});
    }

    render() {
        if (this.state === undefined || this.state.listNames === undefined) {
            setTimeout(() => {
                console.log("something's undefined.");
                Storage.getLists().then((result) => {
                    console.log("result");
                    console.log(result);
                    this.setState({listNames: result})
                });
            }, 100);
            return (
                <View style={{justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 5}}>
                    <TextInput
                        value={this.state.goal}
                        style={{
                            backgroundColor: this.state.bgColor,
                            borderWidth: 0.5,
                            width: "70%"
                        }}
                        placeholder="Type Name of new list"
                        onChangeText={(text) => this.setState({goal: text, bgColor: "white"})}
                        returnKeyType="done"
                    />
                    <Button
                        onPress={this._onPressButton}
                        title="Add List"
                    />
                </View>
                <ScrollView style={{flex: 4}}>
                    <FlatList
                        data={this.state.listNames.map(item => {
                            return {key: item}
                        })}
                        renderItem={({item}) =>
                            <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
                                <TouchableOpacity onPress={() => this.switchTo(item.key)}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>{item.key}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{justifyContent: 'center', flexDirection: 'column',}}
                                                  onPress={() => this.deleteList(item.key)}>
                                    <View style={styles.button}>
                                        <Text style={[styles.buttonText, styles.delete]}>delete</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        flexDirection: "column",
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        color: "black",
    },
    delete: {
        color: "red",
        fontSize: 20,

    },
    button: {
        alignItems: 'center',
    },
    buttonText: {
        padding: 5,
        color: 'black',
        fontSize: 30,
    }
});
