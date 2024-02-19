import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable, StatusBar, useColorScheme } from 'react-native';

import Colors, { colors } from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { fontFamily } from '../../constants';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  size?: number;
}) {
  return <FontAwesome style={{ marginBottom: -3 }} {...props} />;
}
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)/home',
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,

        marginTop: -11,
      }}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarStyle: {
            height: 50,
            paddingBottom: 5,
          },
          tabBarLabelStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused, size }) => (
              <TabBarIcon
                name="home"
                color={focused ? colors.buttonBlue : colors.gray}
                size={size}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  color: focused ? colors.buttonBlue : colors.gray,
                  fontFamily: fontFamily.Bold,
                  fontSize: 7,
                }}
              >
                Home
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarIcon: ({ focused, size }) => (
              <TabBarIcon
                name="envelope"
                color={focused ? colors.buttonBlue : colors.gray}
                size={size}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  color: focused ? colors.buttonBlue : colors.gray,
                  fontFamily: fontFamily.Bold,
                  fontSize: 7,
                }}
              >
                Messages
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="workspace"
          options={{
            title: 'Organizations',
            tabBarIcon: ({ focused, size }) => (
              <TabBarIcon
                name="briefcase"
                color={focused ? colors.buttonBlue : colors.gray}
                size={size}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  color: focused ? colors.buttonBlue : colors.gray,
                  fontFamily: fontFamily.Bold,
                  fontSize: 7,
                }}
              >
                Organizations
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="call"
          options={{
            title: 'Call logs',
            tabBarIcon: ({ focused, size }) => (
              <TabBarIcon
                name="phone"
                color={focused ? colors.buttonBlue : colors.gray}
                size={size}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  color: focused ? colors.buttonBlue : colors.gray,
                  fontFamily: fontFamily.Bold,
                  fontSize: 7,
                }}
              >
                Call logs
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused, size }) => (
              <TabBarIcon
                name="user"
                color={focused ? colors.buttonBlue : colors.gray}
                size={size}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  color: focused ? colors.buttonBlue : colors.gray,
                  fontFamily: fontFamily.Bold,
                  fontSize: 7,
                }}
              >
                Profile
              </Text>
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
