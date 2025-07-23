/**
 * @format
 */

// index.js
import 'react-native-gesture-handler';
import { LogBox } from 'react-native';


import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

LogBox.ignoreAllLogs(); 

AppRegistry.registerComponent(appName, () => App);
