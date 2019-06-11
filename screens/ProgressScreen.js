import React, { Component } from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, Text, TouchableOpacity, AsyncStorage } from 'react-native';

class Table extends Component {

    renderCol(val){
        let col = val == 0? 'red' : 'green';
        let text = val == 0? '': 'x';
        return (
            <View style={{ flex: 1, alignSelf: 'stretch', backgroundColor: col, justifyContent: 'center', borderWidth: 0.5 }}>
    <Text style={{alignSelf: 'center', fontSize: 30 }}>
        {text}
    </Text>
        </View>
    );
    }

    renderRow(vals) {
        return (
            <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
        {
            vals.map((val) => { // This will render a row for each data element.
                return this.renderCol(val);
            })
        }
    </View>
    );
    }

    render() {

        let data = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]];

        for (let i = 0; i < this.props.finishedDays; i++){
            data[Math.floor(i / 10)][i % 10] = 1;
        }
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
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
    state = {finishedDays: 0}

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        }
    }

    async componentDidMount() {
        await this.init()

        // you might want to do the I18N setup here
    }

    async init() {
        const value = await this._retrieveData();
        this.setState({
            isLoading: false
        })
    }

    _storeData = async () => {
        try {
            await AsyncStorage.setItem('finishedDays', JSON.stringify(this.state.finishedDays));
        } catch (error) {
            // Error saving data
        }
    };

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('finishedDays');
            if (value !== null) {
                // We have data!!
                this.setState({finishedDays: JSON.parse(value)})
            }
        } catch (error) {
            // Error retrieving data
        }
    };

    async _pressAddDay() {
        if(this.state == undefined)
            alert("Dafuq");
        if(this.state.finishedDays == 100)
            this.setState({finishedDays: 0});
        if(typeof(this.state.finishedDays) != "number")
            this.setState({finishedDays: parseInt(this.state.finishedDays)});
        await this.setState(previousState => ({finishedDays: previousState.finishedDays + 1}));
        this._storeData();
    }

    async _pressReset() {
        await this.setState({finishedDays: 0});
        this._storeData();
    }

    render() {

        return (
            <View style={styles.main}>
            <View style={styles.checkBoxes}>
            <Table finishedDays={this.state.finishedDays} >
            </Table>
            </View>
            <View style={styles.container}>
            <TouchableOpacity onPress={this._pressAddDay.bind(this)}>
            <View style={styles.button}>
            <Text style={styles.buttonText}>Check another day!</Text>
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
        justifyContent: 'stretch'
    },
    checkBoxes: {
        flex: 1,
    },
    container: {
        paddingTop: 20,
        justifyContent: 'flex-end',
    },
    button: {
        marginBottom: 30,
        width: 260,
        marginRight: 'auto',
        marginLeft: 'auto',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 25,
    }
});
