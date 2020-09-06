import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './app/navigations/Navigation';
import { firebaseApp } from './app/utils/firebase';
import * as firebase from 'firebase';

export default function App() {

  return (
    <Navigation />
  );
}