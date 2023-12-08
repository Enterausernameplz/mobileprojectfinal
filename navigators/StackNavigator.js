import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import CreateScreen from "../screens/CreateScreen";
import CommunityScreen from "../screens/CommunityScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import QuizScreen from "../screens/QuizScreen";
import { Entypo, AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import HomeStackNavigator from "./HomeStackNavigator";
import HomeScreen from "../screens/HomeScreen";
import MainScreen from "../screens/MainScreen";
import SettingsScreen from "../screens/SettingsScreen";
import MatchDetailsScreen from "../screens/MatchDetailsScreen";
import CommentScreen from "../screens/CommentScreen";
import TeamsTable from "../screens/TeamsTable";


const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  function BottomTabs() {
    return(
    <Tab.Navigator>
      <Tab.Screen
        name="Main"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: "홈",
          tabBarLabelStyle: { color: "black" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" size={24} color="black" />
            ) : (
              <AntDesign name="home" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          tabBarLabel: "경기일정",
          tabBarLabelStyle: { color: "black" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="md-calendar-sharp" size={24} color="black" />
            ) : (
              <Ionicons name="md-calendar-outline" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          tabBarLabel: "게시",
          tabBarLabelStyle: { color: "black" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <AntDesign name="plussquare" size={24} color="black" />
            ) : (
              <AntDesign name="plussquareo" size={24} color="black" />
            ),
        }}
      />

      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarLabel: "커뮤니티",
          tabBarLabelStyle: { color: "black" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontAwesome name="file" size={24} color="black" />
            ) : (
              <FontAwesome name="file-o" size={24} color="black" />
            ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "더보기",
          tabBarLabelStyle: { color: "black" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="menu" size={30} color="black" />
            ) : (
              <Ionicons name="menu-outline" size={30} color="black" />
            ),
        }}
      />
    </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ headerShown: false }}
          />
         <Stack.Screen
          name="Setting"
          component={SettingsScreen}
          options={{ headerShown: false }}
          />
          <Stack.Screen
          name="MatchDetails"
          component={MatchDetailsScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Comment"
          component={CommentScreen}
          options={{ headerShown: true }}
        />
       <Stack.Screen
          name="Team"
          component={TeamsTable}
          options={{ headerShown: true }}
        />


          
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
