import { ListItem } from "@/components/ListItem";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet } from "react-native";

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

export default function home() {
  
  const [mails, setMails] = useState<Mail[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const getData = async () => {

    try {
      const token = await AsyncStorage.getItem("@token")
      if (!token) {
        console.error("No token found in AsyncStorage");
        return [];
      }
      // console.log("Token: ", token);
      
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://192.168.43.207:8000";
      // console.log("API URL: ", apiUrl);
      
      const response = await axios.get(`${apiUrl}/emails/newsletters`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // console.log("Response: ", response.data)
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Error Fetching Emails: ", err.response?.data || err.message);
      } else {
        console.error("Error Fetching Emails: ", err);
      }
      return [];
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

      {loading ? <ActivityIndicator size={"large"} color="#C94747" /> : mails.map(
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
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
