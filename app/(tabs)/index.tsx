import { Image, StyleSheet, Platform, ActivityIndicator } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type Mail = {
  emails: {
    from: string,
    unsubscribeLink: string
  }[],
  companyName: string,
  companyLogo: string,
  unsubscribeLink: string,
  emailId: string
}

export default function HomeScreen() {

  const [mails, setMails] = useState<Mail[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const getData = async () => {
    try {
      console.log("API URL: ", process.env.EXPO_PUBLIC_API_URL)
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/emails/newsletters`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("@token")}`
        }
      })
      console.log("Response: ", response.data)
      return response.data
    } catch (err) {
      console.log("Error Fetching Emails: ", err)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const data = await getData()
      setMails(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/email-logo.png")}
          style={styles.reactLogo}
        />
      }
    >

      {/* {loading ? <ActivityIndicator size={"large"} color="#C94747" /> : mails.map(
        ({ companyName, emailId, companyLogo, emails, unsubscribeLink }, index) => (
          <ListItem
            key={index}
            title={companyName}
            email={emailId}
            companyLogo={companyLogo}
            numberOfEmails={emails.length}
            unsubscribeLink={unsubscribeLink}
          />
        )
      )} */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
