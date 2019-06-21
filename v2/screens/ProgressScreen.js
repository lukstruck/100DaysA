import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Image} from 'react-native';
import Storage from '../components/Storage';
import {Circle} from 'react-native-progress';
import LoadingCircle from "../components/LoadingCircle";
import Icon from "react-native-vector-icons/EvilIcons";

class TableProgress extends Component {

    renderCol(val) {
        let col = val == 0 ? '#FA023C' : '#C8FF00';
        let text = val == 0 ? '' : 'X';
        return (
            <View style={{
                flex: 1,
                alignSelf: 'stretch',
                backgroundColor: col,
                justifyContent: 'center',
                borderWidth: 0.5,
                borderColor: '#4B000F',
                borderRadius: 5,
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

        let data = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

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

class BarProgress extends Component {

    state = {progress: 0, goal: 1};

    setProgress() {
        if (this.state.progress !== this.props.progress)
            this.setState({progress: this.props.progress, goal: this.props.goal});
        if (this.state.goal !== this.props.goal)
            this.setState({goal: this.props.goal});

    }

    render() {
        setTimeout(() => this.setProgress(), 1); // is this enough?
        return (
            <View>
                <Circle style={{alignSelf: 'center'}} progress={this.state.progress / this.state.goal}
                        size={200}
                        showsText={true} thickness={5} borderWidth={2}/>
            </View>
        );
    }
}


// janky, clean this
class HeaderSettings extends Component {
    render() {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.push('ProgressSettings', {title: this.props.list})}
                style={{backgroundColor: 'transparent', paddingRight: 15}}>
                <Icon style={{paddingRight: 10}} name="gear" size={30}
                      color={"#000000"}/>
            </TouchableOpacity>
        );
    }
}

export default class ProgressScreen extends Component {

    static navigationOptions = ({navigation}) => {
        let title = navigation.getParam('title', '');
        return {
            title: title,
            headerRight: (<HeaderSettings title={title} navigation={navigation} list={title}/>),
        };
    };

    constructor(props) {
        super(props);

        let today = new Date();

        let options = {year: 'numeric', month: 'numeric', day: 'numeric'};

        this.date = today.toLocaleDateString('en-US', options);

        this.state = {
            loaded: false
        }
    }

    componentDidMount() {
        this.init();
        this.props.navigation.addListener('willFocus', () => this.init());
    }

    init() {
        let title = this.props.navigation.getParam('title');
        return Storage.getListSettings(title).then(listSettings => {
            return this.setState({listName: title, listSettings: listSettings});
        }).then(() => {
            return this.loadData();
        }).then(() => {
            return this.setState({loaded: true});
        });
    }

    loadData() {
        let list = this.state.listName;
        return Storage.getProgressDates(list).then(progress => {
            return this.setState({progress: progress});
        });
    };

    pressAddDay() {
        if (!this.listCheckedToday()) {
            return Storage.addDateToProgress(this.state.listName, this.date).then(() => {
                return this.loadData();
            });
        } else {
            alert("You can't check twice per day! Wait until tomorrow");
        }
    }

    check() {

    }

    listCheckedToday() {
        let progress = this.state.progress;
        return progress[progress.length - 1] === this.date;
    }

    didLoad() {
        let listName = this.state.listName;
        let progress = this.state.progress;
        let goal = this.state.listSettings.goal;


        let buttonDisabled = false;
        let buttonStyles = [styles.buttonText];
        if (this.listCheckedToday()) {
            buttonStyles.push(styles.disabledButton);
            buttonDisabled = true;
        }

        return (
            <View style={styles.main}>
                <View style={{flex: 0, justifyContent: 'center', alignItems: 'center', paddingBottom: 10}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>100 Days A {listName}</Text>
                </View>
                <View style={styles.checkBoxes}>
                    <BarProgress progress={progress.length} goal={goal}/>
                </View>
                <View style={styles.container}>
                    <TouchableOpacity onPress={this.pressAddDay.bind(this)} disabled={buttonDisabled}>
                        <View style={styles.button}>
                            <Text style={buttonStyles}>I had a {listName} today!</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    loading() {
        return (
            <LoadingCircle/>
        );
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
    main: {
        flex: 1,
        padding: 20,
        paddingBottom: 40,
        justifyContent: 'space-between'
    },
    checkBoxes: {
        height: 320,
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
    },
    buttonText: {
        fontSize: 25,
        color: '#007aff',
    },
    disabledButton: {
        color: '#8e8e93',
    },
});
