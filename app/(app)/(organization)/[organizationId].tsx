import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePersonalOrgs } from '../../../lib/queries';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { colors } from '../../../constants/Colors';
import { EvilIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { ErrorComponent } from '../../../components/Ui/ErrorComponent';

import { useCreate } from '../../../hooks/useCreate';
import { LoadingComponent } from '../../../components/Ui/LoadingComponent';
import { useData } from '@/hooks/useData';
import { CreateWorkspaceModal } from '@/components/Dialogs/CreateWorkspace';
import { SelectRow } from '@/components/Dialogs/SelectRow';
import { DeleteWksSpaceModal } from '@/components/Dialogs/DeleteWks';
import { AuthHeader } from '@/components/AuthHeader';
import { Image } from 'expo-image';
import { WorkspaceDetails } from '@/components/WorkspaceDetails';
import { Button } from 'react-native-paper';
import { format } from 'date-fns';

type Props = {};
type SubProps = {
  name: any;
  text: any;
  website?: boolean;
};

// const images = [
//   {
//     name: 'Workspace',
//     uri: '../../assets/images/workspace.png',
//   },
//   {
//     name: 'Staffs',
//     uri: '../../assets/images/staff.png',
//   },
//   {
//     name: 'Messages',
//     uri: '../../assets/images/message.png',
//   },
//   {
//     name: 'Posts',
//     uri: '../../assets/images/post.png',
//   },
//   {
//     name: 'Sales',
//     uri: '../../assets/images/sales.png',
//   },
//   {
//     name: 'Featured WKS',
//     uri: '../../assets/images/featured.png',
//   },
//   {
//     name: 'Services point',
//     uri: '../../assets/images/service.png',
//   },
//   {
//     name: 'Delete WKS',
//     uri: '../../assets/images/delete.png',
//   },
// ];

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
  const { id } = useData();
  const { organizationId } = useLocalSearchParams<{ organizationId: string }>();
  const { onOpen } = useCreate();
  const { darkMode } = useDarkMode();
  const router = useRouter();

  const { data, isPending, error, refetch, isPaused } = usePersonalOrgs(id);

  if (isPending) {
    return <LoadingComponent />;
  }

  const handleRefetch = () => {
    refetch();
  };

  if (error || isPaused) {
    return <ErrorComponent refetch={handleRefetch} />;
  }
  if (isPending) {
    return <LoadingComponent />;
  }

  const org = data;
  console.log('🚀 ~ OrganizationDetails ~ org:', org);

  return (
    <>
      {/* <CreateWorkspaceModal wks={workspaceData} /> */}
      <SelectRow />
      <DeleteWksSpaceModal />
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <AuthHeader
          style={{ marginTop: 10, alignItems: 'center' }}
          path="Manage Organizations"
        />

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View
              style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}
            >
              <Image
                style={{ width: 70, height: 70, borderRadius: 50 }}
                contentFit="cover"
                source={{ uri: org?.avatar }}
              />
              <View>
                <Text
                  style={{
                    fontFamily: 'PoppinsBold',

                    fontSize: 14,
                    color: darkMode ? colors.white : colors.black,
                  }}
                >
                  {org?.organizationName}
                </Text>
                <Text
                  style={{
                    fontFamily: 'PoppinsMedium',
                    fontSize: 10,
                    color: darkMode ? colors.white : colors.black,
                  }}
                >
                  {org?.ownerId?.name} | Admin
                </Text>
              </View>
            </View>
            {id === org?.ownerId._id && (
              <Button
                onPress={() =>
                  router.push(`/(app)/(organization)/edit/${organizationId}`)
                }
                textColor="white"
                buttonColor={colors.buttonBlue}
                style={{ borderRadius: 5 }}
                labelStyle={{ fontFamily: 'PoppinsMedium', fontSize: 12 }}
              >
                Edit workspace
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
              {org?.description}
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
                {org?.startDay} - {org?.endDay}
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
                    {org?.startTime}
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
                    {org?.endTime}
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
            <OrganizationItems name="envelope" text={org?.email} />
            <OrganizationItems name="location" text={org?.location} />
            <OrganizationItems name="link" text={org?.websiteUrl} website />
            <Text
              style={{
                fontFamily: 'PoppinsBold',
                fontSize: 12,
                color: darkMode ? colors.white : colors.black,
              }}
            >
              Members {org?.followers?.length}
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
              onPress={onOpen}
              darkMode={darkMode}
              uri={require('../../../assets/images/workspace.png')}
              name="Workspaces"
            />

            <WorkspaceDetails
              onPress={() => router.push(`/staffs/${org?._id}`)}
              darkMode={darkMode}
              uri={require('../../../assets/images/staff.png')}
              name="Staffs"
            />
            <WorkspaceDetails
              onPress={() => {}}
              darkMode={darkMode}
              uri={require('../../../assets/images/message.png')}
              name="Messages"
            />
            <WorkspaceDetails
              onPress={() => {}}
              darkMode={darkMode}
              uri={require('../../../assets/images/post.png')}
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
              onPress={() => {}}
              darkMode={darkMode}
              uri={require('../../../assets/images/sales.png')}
              name="Sales"
            />

            <WorkspaceDetails
              onPress={() => {}}
              darkMode={darkMode}
              uri={require('../../../assets/images/featured.png')}
              name="Featured WKS"
            />
            <WorkspaceDetails
              onPress={() => {}}
              darkMode={darkMode}
              uri={require('../../../assets/images/service.png')}
              name="Service point"
            />
            <WorkspaceDetails
              onPress={() => {}}
              darkMode={darkMode}
              uri={require('../../../assets/images/delete.png')}
              name="Delete WKS"
            />
          </View>
        </ScrollView>
      </View>
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
