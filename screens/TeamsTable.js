import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { ref, onValue } from "firebase/database";
import { realtimeDb } from '../firebase';
import { SafeAreaView } from "react-native-safe-area-context";

const teamLogos = {
    "Ulsan": "https://www.kleague.com/assets/images/emblem/emblem_K01.png",
    "Jeonbuk Motors": "https://www.kleague.com/assets/images/emblem/emblem_K05.png",
    "FC Seoul":"https://www.kleague.com/assets/images/emblem/emblem_K09.png",
    "Incheon United":"https://www.kleague.com/assets/images/emblem/emblem_K18.png",
    "Suwon Bluewings":"https://www.kleague.com/assets/images/emblem/emblem_K02.png",
    "Gwangju":"https://www.kleague.com/assets/images/emblem/emblem_K22.png",
    "Jeju United":"https://www.kleague.com/assets/images/emblem/emblem_K04.png",
    "Suwon":"https://www.kleague.com/assets/images/emblem/emblem_K29.png",
    "Daegu":"https://www.kleague.com/assets/images/emblem/emblem_K17.png",
    "Daejeon Citizen":"https://www.kleague.com/assets/images/emblem/emblem_K10.png",
    "Pohang Steelers":"https://www.kleague.com/assets/images/emblem/emblem_K03.png",
    "Gangwon":"https://www.kleague.com/assets/images/emblem/emblem_K21.png",
};


const TeamsTable = () => {
    const [teams, setTeams] = useState([]);
    
    useEffect(() => {
        const teamsRef = ref(realtimeDb, 'teams');
    
        onValue(teamsRef, (snapshot) => {
          if (snapshot.exists()) {
            const teamsData = snapshot.val();
            let teamsArray = Object.keys(teamsData).map(key => ({
              ...teamsData[key],
              logo: teamLogos[teamsData[key].team] // 로고 URL 추가
            }));
    
            // 승리 수에 따라 정렬
            teamsArray.sort((a, b) => b.wins - a.wins);
    
            setTeams(teamsArray);
          } else {
            setTeams([]);
          }
        });
    }, []);

    const renderHeader = () => (
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.teamCell]}>팀</Text>
        <Text style={styles.headerCell}>승</Text>
        <Text style={styles.headerCell}>무</Text>
        <Text style={styles.headerCell}>패</Text>
        <Text style={styles.headerCell}>골</Text>
        <Text style={styles.headerCell}>실점</Text>
      </View>
    );
  
    const renderItem = ({ item }) => (
      <View style={styles.row}>
        <View style={[styles.cell, styles.teamCell]}>
          <Image source={{ uri: item.logo }} style={styles.logo} />
          <Text style={styles.teamName}>{item.team}</Text>
        </View>
        <Text style={styles.cell}>{item.wins}</Text>
        <Text style={styles.cell}>{item.draws}</Text>
        <Text style={styles.cell}>{item.losses}</Text>
        <Text style={styles.cell}>{item.goals_scored}</Text>
        <Text style={styles.cell}>{item.goals_conceded}</Text>
      </View>
    );
  
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <FlatList
          data={teams}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
      },
      header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      row: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
      },
      teamInfo: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
      },
      logo: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 10,
      },
      teamName: {
        marginRight: 10,
      },
      cell: {
        flex: 1,
        marginRight: 10,
      },
      headerRow: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingHorizontal: 10,
        justifyContent: 'center', // 각 헤더 셀을 중앙에 배치
      },
      headerCell: {
        flex: 1,
        paddingLeft:10,
        fontWeight: 'bold',
        textAlign: 'center', // 헤더 셀 텍스트 중앙 정렬
      },
      row: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center', // 각 행의 셀을 중앙에 배치
      },
      teamCell: {
        flex: 3, // 팀 이름을 위한 추가 공간
        flexDirection: 'row',
        justifyContent: 'flex-start', // 로고와 팀 이름 왼쪽 정렬
        alignItems: 'center',
      },
      teamName: {
        flexShrink: 1, // 필요한 경우 텍스트를 줄바꿈
        marginRight: 10,
      },
      logo: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 10,
      },
      cell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center', // 셀 텍스트 중앙 정렬
    },
    
  });
  
  export default TeamsTable;