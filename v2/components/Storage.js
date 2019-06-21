import {AsyncStorage} from 'react-native';
import Version from '../components/Version';

function justReturn(params) {
    return params;
}

export class ListSettings {
    goal: number;
    remindUser: boolean;
    reminderHour: number;
    reminderMinute: number;
    forceContinuousDays: boolean;
}

const defaultSettings: ListSettings = {
    goal: 100,
    remindUser: false,
    reminderHour: 17,
    reminderMinute: 0,
    forceContinuousDays: false
};

export default class Storage {
    static store(key, value) {
        console.log("[STORAGE.store] storing " + key + ": " + JSON.stringify(value));
        return AsyncStorage.setItem(Version.getVersion() + key, JSON.stringify(value), justReturn);
    }

    static load(key) {
        return AsyncStorage.getItem(Version.getVersion() + key, justReturn).then(loaded => {
            console.log("[STORAGE.load] loaded " + key + ": " + loaded);
            return JSON.parse(loaded);
        });
    }

    static delete(key){
        return AsyncStorage.removeItem(Version.getVersion() + key, justReturn).then(result => {
            console.log("[STORAGE.delete] deleted " + key + " -> " + result);
        });
    }

    static getLists() {
        return Storage.load("@100DaysA:lists").then(ret => {
            if (!Array.isArray(ret)) {
                ret = [];
            }
            return ret;
        });
    }

    static getListsWithPercentage() {
        return this.getLists().then(lists => {
            return Promise.all(lists.map(list => {
                let settings;
                return this.getListSettings(list).
                then(s => {
                    settings = s;
                    return this.getProgressDates(list)
                }).
                then(progressDates => {
                    return {
                        name: list,
                        percentage: progressDates.length / settings.goal,
                        goal: settings.goal,
                    };
                });
            }));
        });
    }

    static addList(listName) {
        console.log("[STORAGE.addList] adding list " + listName);
        return Storage.getLists().then(lists => {
            lists.push(listName);
            return Storage.store("@100DaysA:lists", lists);
        }).then(() => {
            return Storage.saveListSettings(listName, defaultSettings);
        }).then(() => {
            return Storage.addDateToProgress(listName, 0);
        });
    }

    static saveListSettings(listName, settings: ListSettings) {
        return Storage.store("@100DaysA:listSettings:" + listName, settings);
    }

    static getListSettings(listName): ListSettings {
        return Storage.load("@100DaysA:listSettings:" + listName);
    }

    static deleteList(name) {
        console.log("[STORAGE.deleteList] deleting list " + name);
        return Storage.getLists().then(lists => {
            lists = lists.filter(item => item !== name);
            Storage.delete("@100DaysA:listSettings:" + name);
            Storage.delete("@100DaysA:listProgress:" + name);
            return Storage.store("@100DaysA:lists", lists);
        });
    }

    static addDateToProgress(listName, date) {
        console.log("[STORAGE.addDateToProgress] adding " + date + " to " + listName);
        return this.getProgressDates(listName).then(dateList => {
            if (Array.isArray(dateList) && date !== 0) {
                dateList.push(date);
                return Storage.store("@100DaysA:listProgress:" + listName, dateList);
            } else
                return Storage.store("@100DaysA:listProgress:" + listName, []);
        });
    }

    static getProgressDates(listName) {
        return Storage.load("@100DaysA:listProgress:" + listName);
    }

    static getLastUsedVersion() {
        return AsyncStorage.getItem("version", justReturn);
    }

    static setCurrentUsedVersion(version) {
        AsyncStorage.setItem("version", version, justReturn);
    }

}