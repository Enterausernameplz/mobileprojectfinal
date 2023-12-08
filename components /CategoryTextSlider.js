import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const CategoryTextSlider = () => {
  const [active, setActive] = useState(1);
  const navigation = useNavigation();

  const categoryList = [
    {
      id: 1,
      name: "최신",
    },
    {
      id: 2,
      name: "이적",
    },
    {
      id: 3,
      name: "이슈",
    }
  ];

  const onCategoryClick = (id) => {
    setActive(id);
  };

  const navigateToTeam = () => {
    try {
      navigation.navigate('Team');
    } catch (error) {
      console.error("Navigation failed: ", error);
      Alert.alert("Error", "Navigation failed");
    }
  };

  return (
    <View style={{ marginTop: 10 }}>
      <FlatList
        data={categoryList}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style ={{paddingHorizontal:13,flex:1}}onPress={() => onCategoryClick(item.id)}>
            <Text style={item.id == active ? styles.selectText : styles.unselectText}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <TouchableOpacity onPress={navigateToTeam}>
            <Text style={active ? styles.teamText : styles.unteamText}>팀</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

export default CategoryTextSlider;

const styles = StyleSheet.create({
  listContainer :{
    justifyContent: 'space-between'
  },
  footerComponent:{
    flexGrow:1,
    justifyContent: 'center'
  },
  unselectText: {
    marginRight: 15,
    fontSize: 20,
    fontWeight: "800",
    color: "gray",
    paddingLeft:20,
  },
  selectText: {
    marginRight: 15,
    fontSize: 20,
    fontWeight: "900",
    color: "black",
    paddingLeft :23,
  },
  teamText: {
    fontSize: 20,
    fontWeight: "900",
    color: "black",
    paddingLeft: 23,
    marginRight: 15,
  },
  teamText: {
    fontSize: 20,
    fontWeight: "900",
    color: "grey",
    paddingLeft: 23,
    marginRight: 15,
  }
});
