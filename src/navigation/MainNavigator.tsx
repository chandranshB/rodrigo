import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { Home, Bell, PlusSquare, User, Search, PlayCircle } from 'lucide-react-native';

// Import Screens
import { HomeScreen } from '../screens/HomeScreen';
import { UpdatesScreen } from '../screens/UpdatesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ReelsScreen } from '../screens/ReelsScreen';
import { StoryViewerScreen } from '../screens/StoryViewerScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeIcon = ({ color, size }: { color: string; size: number }) => <Home color={color} size={size} />;
const UpdatesIcon = ({ color, size }: { color: string; size: number }) => <Bell color={color} size={size} />;
const ReelsIcon = ({ color, size }: { color: string; size: number }) => <PlayCircle color={color} size={size} />;
const SearchIcon = ({ color, size }: { color: string; size: number }) => <Search color={color} size={size} />;
const ProfileIcon = ({ color, size }: { color: string; size: number }) => <User color={color} size={size} />;

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
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
