import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

// A tiny 100x100 base64 transparent noise texture
const NOISE_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkAQMAAABKLAcXAAAABlBMVEUAAAAAAAClZ7nPAAAAAnRSTlMAG/xyvHkAAABfSURBVDjL7c2xCQAgDAVRA1nId9a2XUARVjHBIuLwE+y+EwK3iIikjCRjP2c525mD+s5BfWfTqO9sGvWdTaO+s2nUdzaN+s6mUd/ZNOo7m0Z9Z9Oo72wa9Z1No76z/6gvH2A7kItQp/EAAAAASUVORK5CYII=';

export const NoiseBackground = ({ opacity = 0.08 }) => {
  return (
    <View style={[StyleSheet.absoluteFill, { opacity, pointerEvents: 'none', zIndex: 999 }]}>
      <Image 
        source={{ uri: NOISE_BASE64 }} 
        style={{ flex: 1 }} 
        resizeMode="repeat" 
      />
    </View>
  );
};

