import React from 'react';
import { LogBox } from 'react-native'
import Navigation from './app/navigations/Navigation';
import { firebaseApp } from './app/utils/firebase';
import * as firebase from 'firebase';

LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

export default function App() {

  return (
    <Navigation />
  );
}