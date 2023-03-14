import React from 'react';
import {StatusBar} from 'react-native';
import {Home} from './src/screens/Home';

function App() {
  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Home />
    </>
  );
}

export default App;
