import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, storage, db } from "../firebase";

const SettingsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [newName, setNewName] = useState("");
  const [newPhotoURL, setNewPhotoURL] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = auth.currentUser;
      setUser(currentUser);
      setNewName(currentUser.displayName || "");
    };

    fetchData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      if (newName !== "") {
        // 사용자 이름 업데이트
        await auth.currentUser.updateProfile({
          displayName: newName,
        });

        // Firebase Firestore에서 사용자 이름 업데이트
        const userRef = db.collection("users").doc(user.uid);
        await userRef.update({
          name: newName,
        });
      }

      if (newPhotoURL) {
        // 사용자 프로필 사진 업데이트
        const response = await fetch(newPhotoURL);
        const blob = await response.blob();
        const photoRef = storage.ref().child(`users/${user.uid}/profile.jpg`);
        await photoRef.put(blob);

        const photoURL = await photoRef.getDownloadURL();

        // Firebase Firestore에서 사용자 프로필 사진 업데이트
        const userRef = db.collection("users").doc(user.uid);
        await userRef.update({
          photoURL,
        });
      }

      // 프로필 편집 완료 후 프로필 화면으로 이동
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "로그아웃",
      "로그아웃 하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "로그아웃",
          onPress: async () => {
            try {
              await auth.signOut();
              navigation.navigate("Login"); // 로그인 화면으로 이동
            } catch (error) {
              console.error("Error signing out: ", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text
            style={{
              fontSize: 16,
              color: "gray",
            }}
          >
            취소
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>프로필 변경</Text>
        <TouchableOpacity onPress={handleSaveProfile}>
          <Text style={{ fontSize: 16, color: "skyblue" }}>저장</Text>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <TouchableOpacity>
          <Image
            source={{
              uri:
                newPhotoURL ||
                user?.photoURL ||
                "https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={{ color: "skyblue", marginTop: 10 }}>
            Change Profile Photo
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, color: "gray", marginBottom: 5 }}>
          Name
        </Text>
        <TextInput
          style={{
            fontSize: 18,
            borderBottomWidth: 1,
            borderBottomColor: "gray",
          }}
          value={newName}
          onChangeText={(text) => setNewName(text)}
        />
      </View>
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginTop: 20,
          backgroundColor: "skyblue",
          padding: 10,
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cancelText: {
    fontSize: 16,
    color: "gray",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  saveText: {
    fontSize: 16,
    color: "skyblue",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changePhotoText: {
    color: "skyblue",
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "gray",
    marginBottom: 5,
  },
  inputField: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
});

export default SettingsScreen;
