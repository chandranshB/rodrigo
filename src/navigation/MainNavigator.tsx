import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { House as Home, Bell, User, MagnifyingGlass as Search, PlayCircle } from 'phosphor-react-native';
import { CustomTabBar } from './CustomTabBar';

// Import Screens
import { HomeScreen } from '../screens/HomeScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { UpdatesScreen } from '../screens/UpdatesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ReelsScreen } from '../screens/ReelsScreen';
import { StoryViewerScreen } from '../screens/StoryViewerScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeIcon = ({ color, size, focused }: { color: string; size: number, focused: boolean }) => <Home color={color} size={size} weight={focused ? "fill" : "regular"} />;
const UpdatesIcon = ({ color, size, focused }: { color: string; size: number, focused: boolean }) => <Bell color={color} size={size} weight={focused ? "fill" : "regular"} />;
const ReelsIcon = ({ color, size, focused }: { color: string; size: number, focused: boolean }) => <PlayCircle color={color} size={size} weight={focused ? "fill" : "regular"} />;
const SearchIcon = ({ color, size, focused }: { color: string; size: number, focused: boolean }) => <Search color={color} size={size} weight={focused ? "bold" : "regular"} />;
const ProfileIcon = ({ color, size, focused }: { color: string; size: number, focused: boolean }) => <User color={color} size={size} weight={focused ? "fill" : "regular"} />;

const renderTabBar = (props: any) => <CustomTabBar {...props} />;

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
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
