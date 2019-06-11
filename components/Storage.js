import {AsyncStorage} from 'react-native';

export default class Storage {
    static async store(key, value) {
        console.log("storing " + key + ": " + value);
        return await AsyncStorage.setItem(key, JSON.stringify(value));
    }

    static async load(key) {
        console.log("loading " + key);
        return JSON.parse(await AsyncStorage.getItem(key));
    }

    static async getLists() {
        let ret = await Storage.load("@100DaysA:lists");
        if (!Array.isArray(ret) || ret.length === 0) {
            ret = ["default"];
        }
        console.log("got all lists: " + ret);
        return ret;
    }

    static async addList(name) {
        console.log("adding list " + name);
        let lists = await Storage.getLists();
        lists.push(name);
        return await Storage.store("@100DaysA:lists", lists);
    }

    static async deleteList(name){
        console.log("deleting list " + name);
        let lists = await Storage.getLists();
        lists = lists.filter(item => item !== name);
        await AsyncStorage.removeItem("@100DaysA:list:" + name);
        return await Storage.store("@100DaysA:lists", lists);
    }

    static async setProgress(listName, progress) {
        return await Storage.store("@100DaysA:list:" + listName, progress);
    }

    static async getProgress(listName) {
        return await Storage.load("@100DaysA:list:" + listName);
    }
}