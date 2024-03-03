import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image as RNImage,
} from 'react-native';
import React from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetSingleOrg, useProfile } from '../../lib/queries';
import { useDarkMode } from '../../hooks/useDarkMode';
import { AuthHeader } from '../../components/AuthHeader';
import { Image } from 'expo-image';
import { Button } from 'react-native-paper';
import { colors } from '../../constants/Colors';
import dateFormat from 'dateformat';
import { EvilIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useAuth } from '@clerk/clerk-expo';
import MyLoader from '../../components/MyLoader';
import { WorkspaceDetails } from '../../components/WorkspaceDetails';
import { format, sub } from 'date-fns';
import { ErrorComponent } from '../../components/Ui/ErrorComponent';

type Props = {};
type SubProps = {
  name: any;
  text: any;
  website?: boolean;
};

const images = [
  {
    name: 'Workspace',
    uri: '../../assets/images/workspace.png',
  },
  {
    name: 'Staffs',
    uri: '../../assets/images/staff.png',
  },
  {
    name: 'Messages',
    uri: '../../assets/images/message.png',
  },
  {
    name: 'Posts',
    uri: '../../assets/images/post.png',
  },
  {
    name: 'Sales',
    uri: '../../assets/images/sales.png',
  },
  {
    name: 'Featured WKS',
    uri: '../../assets/images/featured.png',
  },
  {
    name: 'Services point',
    uri: '../../assets/images/service.png',
  },
  {
    name: 'Delete WKS',
    uri: '../../assets/images/delete.png',
  },
];

export const OrganizationItems = ({ name, text, website }: SubProps) => {
  const { darkMode } = useDarkMode();

  if (website) {
    return (
      <Pressable
        onPress={() => Linking.openURL('https://' + text)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
      >
        <EvilIcons
          color={darkMode ? colors.white : colors.textGray}
          name={name}
          size={24}
        />
        <Text
          style={{
            color: colors.buttonBlue,
            fontFamily: 'PoppinsBold',
            fontSize: 10,
          }}
        >
          {text}
        </Text>
      </Pressable>
    );
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <EvilIcons
        color={darkMode ? colors.white : colors.textGray}
        name={name}
        size={24}
      />
      <Text
        style={{
          color: darkMode ? colors.white : colors.textGray,
          fontFamily: 'PoppinsBold',
          fontSize: 10,
        }}
      >
        {text}
      </Text>
    </View>
  );
};
const OrganizationDetails = (props: Props) => {
  const { organizationId } = useLocalSearchParams();
  const { darkMode } = useDarkMode();
  const router = useRouter();
  const { userId } = useAuth();
  const { data, isFetching, isLoading, isPending, error, refetch } =
    useGetSingleOrg(organizationId);
  const {
    data: profile,
    isFetching: profileIsFetching,
    isLoading: profileIsLoading,
  } = useProfile(data?.orgs[0]?.owner_id);
  if (
    isLoading ||
    isFetching ||
    isPending ||
    profileIsFetching ||
    profileIsLoading
  ) {
    return <MyLoader />;
  }

  if (error) {
    return <ErrorComponent refetch={refetch} />;
  }

  const organization = data.orgs[0];
  const formattedOpeningTime = new Date(organization?.opening_time);
  const formattedClosingTime = new Date(organization?.closing_time);
  const newCloseTime = sub(formattedClosingTime, { minutes: 15 });
  const newOpeningTime = sub(formattedOpeningTime, { minutes: 15 });
  return (
    <>
      <AuthHeader
        style={{ marginTop: 10, alignItems: 'center' }}
        path="Organization panel"
      />

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
            <Image
              style={{ width: 70, height: 70, borderRadius: 50 }}
              contentFit="cover"
              source={{ uri: organization?.image_url }}
            />
            <View>
              <Text
                style={{
                  fontFamily: 'PoppinsBold',

                  fontSize: 14,
                  color: darkMode ? colors.white : colors.black,
                }}
              >
                {organization?.organization_name}
              </Text>
              <Text
                style={{
                  fontFamily: 'PoppinsMedium',
                  fontSize: 10,
                  color: darkMode ? colors.white : colors.black,
                }}
              >
                {profile?.profile[0]?.name} | Admin
              </Text>
            </View>
          </View>
          {userId === organization?.owner_id && (
            <Button
              onPress={() =>
                router.push(`/(organization)/edit/${organization?.id})`)
              }
              textColor="white"
              buttonColor={colors.buttonBlue}
              style={{ borderRadius: 5 }}
              labelStyle={{ fontFamily: 'PoppinsMedium', fontSize: 12 }}
            >
              Edit
            </Button>
          )}
        </View>
        <View
          style={{
            marginTop: 10,
            borderTopColor: darkMode ? colors.white : colors.gray,
            borderTopWidth: 1,
            paddingTop: 10,
          }}
        >
          <Text
            style={{
              fontFamily: 'PoppinsLight',
              fontSize: 13,
              color: darkMode ? colors.white : colors.black,
            }}
          >
            {organization?.description}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontFamily: 'PoppinsBold',
                fontSize: 10,

                color: darkMode ? colors.white : colors.black,
                textTransform: 'uppercase',
              }}
            >
              {organization?.work_days}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: '#CCF2D9',
                }}
              >
                <Text
                  style={{
                    color: '#00C041',
                    fontFamily: 'PoppinsBold',
                    fontSize: 10,
                  }}
                >
                  {format(newOpeningTime, 'hh:mm aaa')}
                </Text>
              </View>
              <Text> — </Text>
              <View
                style={{
                  backgroundColor: '#FFD9D9',

                  padding: 5,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    color: '#D61B0C',
                    fontFamily: 'PoppinsBold',
                    fontSize: 10,
                  }}
                >
                  {format(newCloseTime, 'hh:mm aaa')}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            gap: 10,
            marginTop: 15,
          }}
        >
          <OrganizationItems name="envelope" text={organization.email} />
          <OrganizationItems name="location" text={organization.location} />
          <OrganizationItems name="link" text={organization.website} website />
          <Text
            style={{
              fontFamily: 'PoppinsBold',
              fontSize: 12,
              color: darkMode ? colors.white : colors.black,
            }}
          >
            Members 0
          </Text>
        </View>
        <View>
          <View
            style={{
              marginVertical: 20,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: darkMode ? colors.white : colors.gray,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
          }}
        >
          <WorkspaceDetails
            darkMode={darkMode}
            uri={require('../../assets/images/workspace.png')}
            name="Workspaces"
          />

          <WorkspaceDetails
            darkMode={darkMode}
            uri={require('../../assets/images/staff.png')}
            name="Staffs"
          />
          <WorkspaceDetails
            darkMode={darkMode}
            uri={require('../../assets/images/message.png')}
            name="Messages"
          />
          <WorkspaceDetails
            darkMode={darkMode}
            uri={require('../../assets/images/post.png')}
            name="Posts"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <WorkspaceDetails
            darkMode={darkMode}
            uri={require('../../assets/images/sales.png')}
            name="Sales"
          />

          <WorkspaceDetails
            darkMode={darkMode}
            uri={require('../../assets/images/featured.png')}
            name="Featured WKS"
          />
          <WorkspaceDetails
            darkMode={darkMode}
            uri={require('../../assets/images/service.png')}
            name="Service point"
          />
          <WorkspaceDetails
            darkMode={darkMode}
            uri={require('../../assets/images/delete.png')}
            name="Delete WKS"
          />
        </View>
      </ScrollView>
    </>
  );
};

export default OrganizationDetails;

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});
