import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { House as Home, Bell, User, MagnifyingGlass as Search, PlayCircle } from 'phosphor-react-native';

// Import Screens
import { HomeScreen } from '../screens/HomeScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { UpdatesScreen } from '../screens/UpdatesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ReelsScreen } from '../screens/ReelsScreen';
import { StoryViewerScreen } from '../screens/StoryViewerScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeIcon = ({ color, size, focused }: { color: string; size: number, focused: boolean }) => <Home color={focused ? theme.colors.primary : color} size={size} weight={focused ? "fill" : "duotone"} />;
const UpdatesIcon = ({ color, size, focused }: { color: string; size: number, focused: boolean }) => <Bell color={focused ? theme.colors.primary : color} size={size} weight={focused ? "fill" : "duotone"} />;
const ReelsIcon = ({ color, size, focused }: { color: string; size: number, focused: boolean }) => <PlayCircle color={focused ? theme.colors.primary : color} size={size} weight={focused ? "fill" : "duotone"} />;
const SearchIcon = ({ color, size, focused }: { color: string; size: number, focused: boolean }) => <Search color={focused ? theme.colors.primary : color} size={size} weight={focused ? "fill" : "duotone"} />;
const ProfileIcon = ({ color, size, focused }: { color: string; size: number, focused: boolean }) => <User color={focused ? theme.colors.primary : color} size={size} weight={focused ? "fill" : "duotone"} />;

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'rgba(22, 24, 36, 0.85)',
          height: 64,
          position: 'absolute',
          bottom: insets.bottom > 0 ? insets.bottom : 20,
          left: 20,
          right: 20,
          borderRadius: 32,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.08)',
          elevation: 0,
          paddingTop: 0,
          paddingBottom: 0,
        },
        safeAreaInsets: { bottom: 0 },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
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
        component={ExploreScreen}
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
