import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Button,
  TextInput,
  Modal,
} from "react-native";
import {
  collection,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import Icon from "react-native-vector-icons/FontAwesome";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const CommunityScreen = ({ route }) => {
  const { loggedInUser } = route.params || {};
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const postCollectionRef = collection(db, "posts");
    const q = query(postCollectionRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const postsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsArray);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error", error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // 게시물 삭제 함수
  const handleRemovePost = async (postId, postUserId) => {
    // 현재 로그인한 사용자가 게시물의 작성자인지 확인
    if (auth.currentUser.uid !== postUserId) {
      console.error("You can only delete your own posts.");
      return;
    }
  
    try {
      const postRef = doc(db, "posts", postId);
      await deleteDoc(postRef);
      // 게시물 삭제 후, 상태 업데이트를 위해 setPosts를 호출
      setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("게시물 삭제 오류", error);
    }
  };
  
//좋아요
  const handleToggleLike = async (postId, userId) => {
    const postRef = doc(db, "posts", postId);
  
    try {
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const post = postDoc.data();
        const likedByUsers = post.likedByUsers || [];
        const isLiked = likedByUsers.includes(userId);
        let updatedLikedByUsers;
  
        if (isLiked) {
          // 좋아요 취소
          updatedLikedByUsers = likedByUsers.filter((id) => id !== userId);
        } else {
          // 좋아요 추가
          updatedLikedByUsers = [...likedByUsers, userId];
        }
  
        const likesCount = post.likesCount != null ? post.likesCount : 0;
        const likesIncrement = isLiked ? -1 : 1;
        const newLikesCount = Math.max(likesCount + likesIncrement, 0); // 좋아요 개수가 0 이하가 되지 않도록 함
  
        await updateDoc(postRef, {
          likedByUsers: updatedLikedByUsers,
          likesCount: newLikesCount,
        });
  
        // 상태 업데이트
        setPosts((currentPosts) =>
          currentPosts.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                likedByUsers: updatedLikedByUsers,
                likesCount: newLikesCount,
              };
            }
            return p;
          })
        );
      }
    } catch (error) {
      console.error("Error toggling like: ", error);
    }
  };
  

  // 댓글창 열기
  const handleCommentIconClick = (postId) => {
    navigation.navigate('Comment',{postId})
  };

  console.log("posts:", posts, Array.isArray(posts));

  // 게시물 로딩 시
  if (loading) {
    return (
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          SPG Community
        </Text>
        <View
          style={{
            flexDirection: "center",
            alignItems: "center",
            marginTop: 250,
          }}
        >
          <Text>Loading...</Text>
        </View>
      </ScrollView>
    );
  }

  // 에러 시
  if (error) {
    return (
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          SPG Community
        </Text>
        <View
          style={{
            flexDirection: "center",
            alignItems: "center",
            marginTop: 250,
          }}
        >
          <Text>Error: {error.message}</Text>
        </View>
      </ScrollView>
    );
  }

  // 게시물 없을 시
  if (!posts.length) {
    return (
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          SPG Community
        </Text>
        <View
          style={{
            flexDirection: "center",
            alignItems: "center",
            marginTop: 250,
          }}
        >
          <Text>게시물이 없습니다.</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{marginTop:40, padding: 10}}>
      <View contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          SPG Community
        </Text>
        {Array.isArray(posts) &&
          posts.map((post, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 10,
                padding: 15,
                marginBottom: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                elevation: 3,
                position: "relative",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Image
                  source={{
                    uri:
                      post.userPhoto ||
                      "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 10,
                  }}
                />
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {post.userName ? post.userName : "알 수 없는 사용자"}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemovePost(post.id,post.createdBy)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 10,
                  }}
                >
                  <Icon name="trash-o" size={20} color="black" />
                </TouchableOpacity>
              </View>
              <Text style={{ marginBottom: 10 }}>{post.text}</Text>
              {post.image && (
                <Image
                  source={{ uri: post.image }}
                  style={{
                    width: "100%",
                    height: 200,
                    marginBottom: 10,
                  }}
                />
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => handleToggleLike(post.id, auth.currentUser.uid)}
                  disabled={loading}
                  style={{ padding: 8 }}
                >
                  <Icon
                    name={
                      post.likedByUsers.includes(auth.currentUser.uid)
                        ? "heart"
                        : "heart-o"
                    }
                    size={20}
                    color={
                      post.likedByUsers.includes(auth.currentUser.uid)
                        ? "red"
                        : "black"
                    }
                  />
                  <Text>{post.likesCount || 0} likes </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleCommentIconClick(post.id)}
                  style={{ padding: 8 }}
                >
                  <Icon
                    name="comment-o"
                    size={20}
                    color="black"
                    style={{ flexDirection: "row", alignItems: "center" }}
                  />
                  <Text>comment</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </View>
     </ScrollView>
  );
};

export default CommunityScreen;
