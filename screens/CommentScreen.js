import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

const CommentScreen = ({ route }) => {
  const { postId, postUserId } = route.params; // 게시물 ID와 게시물 작성자 ID
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const auth = getAuth();

  useEffect(() => {
    // 댓글 불러오기
    const commentsRef = collection(db, "comments");
    const q = query(commentsRef, where("postId", "==", postId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedComments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, []);

  // 댓글 추가 함수
  const handleAddComment = async () => {
    const commentToAdd = {
      postId,
      userId: auth.currentUser.uid,
      userName:auth.currentUser.displayName || "User",
      text: newComment,
      createdAt: new Date(),
      // 사용자 프로필 정보 추가 필요 (이름, 프로필 사진 등)
    };

    await addDoc(collection(db, "comments"), commentToAdd);
    setNewComment('');
  };

  return (
    <View style={styles.container}>
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={item.userId === auth.currentUser.uid ? styles.commentAuthor : styles.commentUser}>
          {/* 프로필 사진과 이름 표시 */}
          <Image 
            source={{ uri: item.userPhoto || "https://cdn-icons-png.flaticon.com/128/149/149071.png" }}
            style={styles.profilePic}
          />
          <Text style={styles.userName}>{item.userName}</Text>
          <Text>{item.text}</Text>
        </View>
      )}
    />
    <TextInput
      value={newComment}
      onChangeText={setNewComment}
      placeholder="댓글을 입력하세요..."
      style={styles.input}
    />
    <Button title="댓글 추가" onPress={handleAddComment} />
  </View>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  commentAuthor: {
    backgroundColor:"grey",
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  commentUser: {
    backgroundColor:"blue",
    padding: 10,
    backgroundColor: '#add8e6',
    borderRadius: 5,
    marginBottom: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10
  }
});

export default CommentScreen;
