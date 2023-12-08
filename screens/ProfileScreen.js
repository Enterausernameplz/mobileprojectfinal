import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null); // 현재 로그인한 사용자의 ID
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [shares, setShares] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [totalLikesCount, setTotalLikesCount] = useState(0);
  const [famScorePercentage, setFamScorePercentage] = useState(0);

//로그인된 유저 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        setLoggedInUser({
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
        });
      } else {
        setUserId(null);
        setLoggedInUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
//해당하는 정보 가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        await loadShares();
        await fetchPostsCount();
        await fetchTotalLikesCount();
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    calculateFamScore();
  }, [postsCount, shares, totalLikesCount]);

  const calculateFamScore = () => {
    const postWeight = 1;
    const shareWeight = 7;
    const likeWeight = 3;

    const score = postsCount * postWeight + shares * shareWeight + totalLikesCount * likeWeight;
    const percentage = Math.min(score / 100, 1) * 100;
    setFamScorePercentage(percentage);
  };

  const loadShares = async () => {
    try {
      const sharesValue = await AsyncStorage.getItem(`shares_${userId}`);
      if (sharesValue !== null) {
        setShares(parseInt(sharesValue, 10));
      }
      
    } catch (error) {
      console.error('Error loading shares', error);
    }
  };

  const fetchPostsCount = async () => {
    try {
      const q = query(collection(db, "posts"), where("createdBy", "==", userId));
      const querySnapshot = await getDocs(q);
      setPostsCount(querySnapshot.size);
    } catch (error) {
      console.error("Error fetching posts count:", error);
    }
  };

  const fetchTotalLikesCount = async () => {
    try {
      const q = query(collection(db, "posts"), where("createdBy", "==", userId));
      const querySnapshot = await getDocs(q);
      let totalLikes = 0;

      querySnapshot.forEach((doc) => {
        const post = doc.data();
        totalLikes += post.likesCount || 0;
      });

      setTotalLikesCount(totalLikes);
    } catch (error) {
      console.error("Error fetching total likes count:", error);
    }

    const calculateScore = (postsCount, shares, totalLikesCount) => {
  // 각 항목의 가중치
  const postWeight = 1;
  const shareWeight = 7;
  const likeWeight = 3;

  // 각 항목에 가중치를 곱한 후 더하기
  const famScore =
    postsCount * postWeight + shares * shareWeight + totalLikesCount * likeWeight;

  // famScore를 최대값(예: 100)으로 나누어 백분율을 계산
  const famScorePercentage = Math.min(famScore / 100, 1) * 100; // 최대 100%로 제한

  return famScorePercentage; // 백분율 반환
};
  };

  return (
    <SafeAreaView style={{ marginHorizontal: 20, marginTop: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
          <AntDesign name="setting" size={35} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 30 }}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Image
            source={{
              uri: loggedInUser && loggedInUser.photoURL ? loggedInUser.photoURL :"https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 50,
              marginBottom: 5,
            }}
          />
          <Text style={{ fontSize: 16, color: "black", fontWeight: "bold" }}>
            {loggedInUser && loggedInUser.name ? loggedInUser.name : "User"}       
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontSize: 16,
              color: "darkgray",
              fontWeight: "500",
            }}
          >
            {loggedInUser && loggedInUser.email ? loggedInUser.email : "Email"}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 25,
          }}
        >
          <View style={{ alignItems: "center ", justifyContent: "center" }}>
            <Text
              style={{ fontSize: 16, color: "black", justifyContent: "center" }}
            >
              게시물
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                color: "darkgray",
                fontWeight: 700,
              }}
            >
              {postsCount}
            </Text>
          </View>

          <View style={{ alignItems: "center ", justifyContent: "center" }}>
            <Text
              style={{ fontSize: 16, color: "black", justifyContent: "center" }}
            >
             공유
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                color: "darkgray",
                fontWeight: 700,
              }}
            >
              {shares}
            </Text>
          </View>

          <View style={{ alignItems: "center ", justifyContent: "center" }}>
            <Text
              style={{ fontSize: 16, color: "black", justifyContent: "center" }}
            >
              좋아요
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                color: "darkgray",
                fontWeight: 700,
              }}
            >
              {totalLikesCount}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            marginTop: 20,
            backgroundColor: "skyblue",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 10,
            borderRadius: 10,
          }}
          onPress={() => navigation.navigate("Quiz")} 
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
            SGP Quiz
          </Text>
        </TouchableOpacity>
        <View
  style={{
    marginTop: 20,
    alignItems: "center",
  }}
>
  <Text
    style={{
      fontSize: 18,
      color: "black",
      fontWeight: "bold",
      marginBottom: 5,
    }}
  >
    친밀도
  </Text>
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text style={{ fontSize: 16, marginRight: 5 }}>1</Text>
    <View
      style={{
        flex: 1,
        height: 20, // 두께를 조절
        backgroundColor: "lightgray",
        borderRadius: 10, // 둥근 형태로 만들기
      }}
    >
      <View
        style={{
          width: `${famScorePercentage}%`,
          height: 20, // 두께를 조절
          backgroundColor: "white",
         
        }}
      />
    </View>
    <Text style={{ fontSize: 16, marginLeft: 5 }}>99</Text>
  </View>
</View>

      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});

