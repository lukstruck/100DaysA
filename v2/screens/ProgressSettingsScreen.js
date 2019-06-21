import React, {Component} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Storage, {ListSettings} from "../components/Storage";
import LoadingCircle from "../components/LoadingCircle";
import {
    SettingsDividerShort,
    SettingsDividerLong,
    SettingsEditText,
    SettingsCategoryHeader,
    SettingsSwitch,
    SettingsButton
} from "react-native-settings-components";
import TimePicker from "react-native-24h-timepicker";
import Icon from "react-native-vector-icons/EvilIcons";
// import PushNotification from "react-native-push-notification";

export default class ProgressSettingsScreen extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('title', ''),
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
        }
    }

    componentDidMount() {
        this.init();
    }

    componentWillUnmount(): void {
        this.setState({loaded: false});
    }

    init() {
        this.title = this.props.navigation.getParam('title');
        return this.loadListSettings().then(() => {
            return this.setState({loaded: true, list: this.title});
        });
    }

    loadListSettings() {
        return Storage.getListSettings(this.title).then(settings => {
            return this.setState({listSettings: settings});
        });
    }

    didLoad() {

        return (
            <Settings list={this.state.list} settings={this.state.listSettings}/>
        );
    }

    check() {

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

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
        }
    }

    componentDidMount() {
        this.init();
    }

    componentWillUnmount(): void {
        this.setState({loaded: false});
    }

    init() {
        let list = this.props.list;
        let settings: ListSettings = this.props.settings;
        settings.reminderTime = settings.reminderHour + ":" + (settings.reminderMinute === 0 ? "00" : settings.reminderMinute);

        this.setState({
            loaded: true,
            list: list,
            settings: settings,
        });
    }

    saveSettings() {
        Storage.saveListSettings(this.state.list, this.state.settings);
    }

    setDays(value) {
        let settings = this.state.settings;
        if (value === "") {
            settings.goal = 100;
            this.setState(settings);
        } else if (!isNaN(value)) {
            settings.goal = parseInt(value);
            this.setState(settings);
        } else {
            alert(value + " is not a number!");
        }
    }

    setRemindUser(value) {
        let settings = this.state.settings;
        settings.remindUser = value;
        this.setState(settings);
        /*if(value){
            let date = new Date();
            date.setHours(this.state.settings.reminderHour, this.state.settings.reminderMinute);
            if(date < new Date()){
                date.setDate(date.getDate() + 1);
            }
            PushNotification.localNotificationSchedule({
                //... You can use all the options from localNotifications
                id: this.state.list,
                message: "Time for your daily " + this.state.list + "!",
                date: date,
                repeatType: 'day',
            });
        } else {
            PushNotification.cancelLocalNotifications({id: this.state.list});
        }*/
    }

    setForceContinuousDays(value) {
        let settings = this.state.settings;
        settings.forceContinuousDays = value;
        this.setState(settings);
    }

    showTimePicker() {
        if (this.state.settings.remindUser)
            this.TimePicker.open()
    }

    onCancel() {
        this.TimePicker.close();
    }

    onConfirm(hour, minute) {
        let settings = this.state.settings;
        settings.reminderHour = hour;
        settings.reminderMinute = minute;
        settings.reminderTime = hour + ":" + (minute === 0 ? "00" : minute);
        this.setState(settings);
        this.TimePicker.close();
    }


    didLoad() {

        this.saveSettings();
        let headerTitle = "Settings " + this.state.list;

        let that = this;

        return (
            <ScrollView style={styles.container}>

                <SettingsCategoryHeader
                    title={headerTitle}
                />
                <SettingsDividerLong android={false}/>
                <SettingsEditText
                    title="Number of days"
                    dialogDescription={"Enter number of days."}
                    valuePlaceholder="100"
                    negativeButtonTitle={"Cancel"}
                    buttonRightTitle={"Save"}
                    onValueChange={val => this.setDays(val)}
                    value={this.state.settings.goal.toString()}
                    positiveButtonTitle={"Save"}
                />
                <SettingsDividerLong android={false}/>
                <SettingsDividerLong android={false}/>
                <SettingsCategoryHeader
                    title={"WIP - not functional yet. You can press and change values though."}
                />
                <SettingsDividerLong android={false}/>
                <SettingsDividerLong android={false}/>
                <SettingsSwitch
                    title={"Remind daily with Push Notifications"}
                    onValueChange={value => {
                        this.setRemindUser(value);
                    }}
                    value={this.state.settings.remindUser}
                    trackColor={{
                        true: colors.switchEnabled,
                        false: colors.switchDisabled,
                    }}
                />
                <SettingsButton onPress={() => this.showTimePicker()} description={this.state.settings.reminderTime}
                                title={"Edit daily reminder Time"} disabled={!this.state.settings.remindUser}
                                rightIcon={() => {
                                    return <Icon style={{paddingRight: 10}} name="clock" size={40}
                                                 color={this.state.settings.remindUser ? colors.switchEnabled : colors.switchDisabled}/>
                                }}
                />
                <TimePicker
                    ref={ref => {
                        that.TimePicker = ref;
                    }}
                    onCancel={() => this.onCancel()}
                    onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
                    selectedHour={this.state.settings.reminderHour.toString()}
                    selectedMinute={this.state.settings.reminderMinute.toString()}
                    minuteInterval={5}
                />
                <SettingsDividerShort/>
                <SettingsSwitch
                    title={"Must be completed in a streak"}
                    onValueChange={value => {
                        this.setForceContinuousDays(value);
                    }}
                    value={this.state.settings.forceContinuousDays}
                    trackColor={{
                        true: colors.switchEnabled,
                        false: colors.switchDisabled,
                    }}
                />

            </ScrollView>
        )
    }

    check() {

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
    container: {
        flex: 1,
        //justifyContent: 'center',
        // alignItems: 'center',
    },
});


const colors = {
    white: "#FFFFFF",
    switchEnabled: "#C70039",
    switchDisabled: "#efeff3",
    blueGem: "#27139A",
};