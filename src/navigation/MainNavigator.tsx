import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { Home, Bell, PlusSquare, User, Search } from 'lucide-react-native';

// Import Screens (to be created)
import { HomeScreen } from '../screens/HomeScreen';
import { UpdatesScreen } from '../screens/UpdatesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeIcon = ({ color, size }: { color: string; size: number }) => <Home color={color} size={size} />;
const UpdatesIcon = ({ color, size }: { color: string; size: number }) => <Bell color={color} size={size} />;
const CreateIcon = ({ color, size }: { color: string; size: number }) => <PlusSquare color={color} size={size} />;
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
          tabBarIcon: UpdatesIcon,
        }}
      />
      <Tab.Screen
        name="Create"
        component={HomeScreen} // Placeholder
        options={{
          tabBarIcon: CreateIcon,
        }}
      />
      <Tab.Screen
        name="Search"
        component={HomeScreen} // Placeholder
        options={{
          tabBarIcon: SearchIcon,
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
        {/* Modals like StoryViewer would go here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
