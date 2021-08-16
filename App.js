import React from 'react';
import { YellowBox } from 'react-native'
import Navigation from './app/navigations/Navigation';
import { firebaseApp } from './app/utils/firebase';
import * as firebase from 'firebase';

YellowBox.ignoreWarnings(["Setting a timer"])

export default function App() {

  return (
    <Navigation />
  );
}