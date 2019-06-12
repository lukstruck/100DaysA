import React, {Component} from 'react';
import {Alert, AppRegistry, Button, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import Storage from '../components/Storage';

class Table extends Component {

    renderCol(val) {
        let col = val == 0 ? 'red' : 'green';
        let text = val == 0 ? '' : 'X';
        return (
            <View style={{
                flex: 1,
                alignSelf: 'stretch',
                backgroundColor: col,
                justifyContent: 'center',
                borderWidth: 0.5
            }}>
                <Text style={{alignSelf: 'center', fontSize: 25, padding: 0}}>
                    {text}
                </Text>
            </View>
        );
    }

    renderRow(vals) {
        return (
            <View style={{flex: 1, alignSelf: 'stretch', flexDirection: 'row'}}>
                {
                    vals.map((val) => { // This will render a row for each data element.
                        return this.renderCol(val);
                    })
                }
            </View>
        );
    }

    render() {

        let data = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

        for (let i = 0; i < this.props.finishedDays; i++) {
            data[Math.floor(i / 10)][i % 10] = 1;
        }
        return (
            <View style={{flex: 1, alignItems: 'center'}}>
                {
                    data.map((vals) => { // This will render a row for each data element.
                        return this.renderRow(vals);
                    })
                }
            </View>
        );
    }
}

export default class ProgressScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true, finishedDays: 0,
        }
    }

    async componentDidMount() {
        await this.init();

        console.log("didMount");
        // you might want to do the I18N setup here
    }

    async init() {
        await this._retrieveData();
        this.setState({
            isLoading: false
        });
    }

    _storeData = async () => {
        try {
            await Storage.setProgress(this.state.list, this.state.finishedDays);
        } catch (error) {
            // Error saving data
        }
    };

    _retrieveData = async () => {
        Storage.getProgress(this.state.list).then((value) => {
            if (value !== null) {
                // We have data!!
                console.log("got " + value + " for " + this.state.list);
                this.setState({finishedDays: value});
            } else {
                console.log("setting up data for " + this.state.list);
                this._pressReset();
            }
        });
    };

    async _pressAddDay() {
        if (this.state == undefined)
            alert("Dafuq");
        if (typeof (this.state.finishedDays) != "number") {
            this.setState({finishedDays: parseInt(this.state.finishedDays)});
        }
        if (this.state.finishedDays === 100)
            this.setState({finishedDays: 0});
        await this.setState(previousState => ({finishedDays: previousState.finishedDays + 1}));
        this._storeData();
    }

    async _pressReset() {
        await this.setState({finishedDays: 0});
        this._storeData();
    }

    render() {
        Storage.getLists().then(async (val) => {
            const {navigation} = this.props;
            const list = navigation.getParam('list', val[0]);
            if (list !== this.state.list && list !== undefined) {
                await this.setState({list: list});
                await this._retrieveData();
            }
        });

        if (this.state.list === undefined) {
            return (<View style={{justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>);
        }

        return (
            <View style={styles.main}>
                <View style={{flex: 0, justifyContent: 'center', alignItems: 'center', paddingBottom: 10}}>
                    <Text style={{fontSize: 30}}>100 Days A {this.state.list}</Text>
                </View>
                <View style={styles.checkBoxes}>
                    <Table finishedDays={this.state.finishedDays}>
                    </Table>
                </View>
                <View style={styles.container}>
                    <TouchableOpacity onPress={this._pressAddDay.bind(this)}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>I had a {this.state.list} today!</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._pressReset.bind(this)}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Reset</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        padding: 20,
        paddingBottom: 40,
        justifyContent: 'space-evenly'
    },
    checkBoxes: {
        flex: 1,
    },
    container: {
        justifyContent: 'flex-end',
    },
    button: {
        paddingTop: 20,
        width: 260,
        margin: 0,
        marginRight: 'auto',
        marginLeft: 'auto',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 25,
    }
});
