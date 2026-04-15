import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { House as Home, Bell, User, MagnifyingGlass as Search, PlayCircle } from 'phosphor-react-native';

// Import Screens
import { HomeScreen } from '../screens/HomeScreen';
import { UpdatesScreen } from '../screens/ExploreScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ReelsScreen } from '../screens/ReelsScreen';
import { StoryViewerScreen } from '../screens/StoryViewerScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeIcon = ({ color, size, focused }: { color: string; size: number, focused: boolean }) => <Home color={color} size={size} weight={focused ? "fill" : "duotone"} />;
const UpdatesIcon = ({ color, size, focused }: { color: string; size: number, focused: boolean }) => <Bell color={color} size={size} weight={focused ? "fill" : "duotone"} />;
const ReelsIcon = ({ color, size, focused }: { color: string; size: number, focused: boolean }) => <PlayCircle color={color} size={size} weight={focused ? "fill" : "duotone"} />;
const SearchIcon = ({ color, size, focused }: { color: string; size: number, focused: boolean }) => <Search color={color} size={size} weight={focused ? "fill" : "duotone"} />;
const ProfileIcon = ({ color, size, focused }: { color: string; size: number, focused: boolean }) => <User color={color} size={size} weight={focused ? "fill" : "duotone"} />;

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.muted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={UpdatesScreen}
        options={{
          tabBarIcon: SearchIcon,
        }}
      />
      <Tab.Screen
        name="Reels"
        component={ReelsScreen}
        options={{
          tabBarIcon: ReelsIcon,
        }}
      />
      <Tab.Screen
        name="Updates"
        component={UpdatesScreen}
        options={{
          tabBarIcon: UpdatesIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen 
          name="StoryViewer" 
          component={StoryViewerScreen} 
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
            gestureEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
