import React, {Component} from 'react';
import {
    Button,
    FlatList,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Storage from '../components/Storage';
import LoadingCircle from "../components/LoadingCircle";
import {Pie} from 'react-native-progress';
import { NavigationEvents } from 'react-navigation';

export default class ListScreen extends Component {

    static navigationOptions = {
        title: 'Overview',
    };

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
        };

        this.addListButtonPressed = this.addListButtonPressed.bind(this);
        this.switchTo = this.switchTo.bind(this);
    }

    componentDidMount() {
        this.init();
    }

    init() {
        this.loadLists().then(() => {
            this.setState({
                goal: "",
                bgColor: "white",
                loaded: true
            });
        });
    }

    loadLists() {
        return Storage.getListsWithPercentage().then(lists => {
            console.log("[LISTSCREEN.loadLists] lists " + JSON.stringify(lists));
            return this.setState({lists: lists});
        });
    }

    addListButtonPressed() {
        let inputText = this.state.goal.trim();
        if (inputText !== "") {
            return Storage.addList(inputText).then(() => {
                Keyboard.dismiss();
                this.init();
            });
        } else {
            return this.setState({bgColor: "red"});
        }
    }

    switchTo(list) {
        this.props.navigation.push("Progress", {title: list});
    }

    deleteList(list) {
        return Storage.deleteList(list).then(() => {
            return this.loadLists();
        });
    }

    didLoad() {
        let inputText = this.state.goal;
        let inputBgColor = this.state.bgColor;
        let lists = this.state.lists;


        return (
            <View style={styles.container}>
                <NavigationEvents
                    onWillFocus={() => this.loadLists()}
                />
                <Text style={{alignSelf: 'center', fontSize: 35, fontWeight: 'bold', paddingBottom: 20}}>
                    100 Days A ...
                </Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 5}}>
                    <TextInput
                        value={inputText}
                        style={{
                            backgroundColor: inputBgColor,
                            borderWidth: 0.5,
                            width: "70%"
                        }}
                        placeholder="Type Name of new list"
                        onChangeText={(text) => this.setState({goal: text, bgColor: "white"})}
                        returnKeyType="done"
                    />
                    <Button
                        onPress={this.addListButtonPressed}
                        title="Add List"
                    />
                </View>
                <ScrollView style={{flex: 4}}>
                    <FlatList
                        data={lists.map(item => {
                            return {key: item.name, value: item.percentage};
                        })}
                        renderItem={({item}) =>
                            <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
                                <TouchableOpacity style={{width: "70%"}} onPress={() => this.switchTo(item.key)}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>... {item.key}</Text>
                                        <Pie progress={item.value} size={20}/>
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

    loading() {
        return (
            <LoadingCircle/>
        );
    }

    check() {

    }

    render() {
        if (this.state.loaded) {
            this.check();
            return this.didLoad();
        }
        return this.loading();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        padding: 20,
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
        justifyContent: 'space-between',
        flexDirection: 'row',
        flex: 1,
    },
    buttonText: {
        padding: 5,
        color: '#007aff',
        fontSize: 30,
    }
});
