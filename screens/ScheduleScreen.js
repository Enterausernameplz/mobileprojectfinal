import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { realtimeDb } from '../firebase';
import {ref, onValue, query,orderByChild,equalTo} from 'firebase/database'
import { SafeAreaView } from "react-native-safe-area-context";

const generateDates = (centerDate, daysBefore, daysAfter) => {
  let dates = [];
  for (let i = -daysBefore; i <= daysAfter; i++) {
    dates.push(moment(centerDate).add(i, 'days').format('YYYY-MM-DD'));
  }
  return dates;
};

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

const ScheduleScreen = ({ navigation }) => {
  // 오늘 날짜를 기준으로 상태를 설정합
  const today = moment().startOf('day');
  const [dates, setDates] = useState(generateDates(today, 3, 3));
  const [selectedDate, setSelectedDate] = useState(today.format('YYYY-MM-DD'));
  const [matches, setMatches] = useState({});
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const scrollViewRef = React.createRef(); // 스크롤 뷰의 참조를 저장하기 위한 ref
  const [markedDates, setMarkedDates] = useState({}); // 캘린더에 표시될 날짜들을 저장하는 상태
  
  useEffect(() => {
    //캘린더에 표시될 날짜를 설정하는 함수 호출
    const fetchMatchDates = async () => {
      try {
        const matchesRef = ref(realtimeDb, 'matchs');
        onValue(matchesRef, (snapshot) => {
          if (snapshot.exists()) {
            const allMatches = snapshot.val();
            const allDates = Object.keys(allMatches).reduce((dates, key) => {
              const matchDate = allMatches[key].date;
              if (!dates[matchDate]) {
                dates[matchDate] = { marked: true, dotColor: 'blue' }; // 경기가 있는 날짜에 표시를 합니다.
              }
              return dates;
            }, {});
            setMarkedDates(allDates);
          }
        });
      } catch (error) {
        console.error("Error fetching match dates: ", error);
      }
    };

    fetchMatchDates(); //경기 일정을 가져옴
  }, []);

  const fetchMatches = async (date) => {
    // 선택된 날짜에 해당하는 경기 정보를 가져오는 함수
    try {
       // Firebase 데이터베이스에서 해당 날짜의 경기 정보를 가져옴
      const matchesRef = ref(realtimeDb,'matchs')
      const matchesQuery = query(matchesRef, orderByChild('date'), equalTo(date));
      onValue(matchesQuery,(snapshot) =>{
        console.log("Snapshot exists: ", snapshot.exists());
        console.log("Snapshot data: ", snapshot.val());
        if (snapshot.exists()) {
          let data = snapshot.val();
          console.log(data);
          let matchesArray = Object.keys(data).map(key => data[key]);
          setMatches({ [date]: matchesArray })
      } else {
        setMatches({ [date]: [] });
      }
    });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const onDateSelect = (date) => { // 날짜 탭을 선택했을 때 호출되는 함수
    // 사용자가 선택한 날짜를 상태에 설정하고, 해당 날짜의 경기 정보를 가져옵니다.
    setSelectedDate(date);
    setDates(generateDates(moment(date), 3, 3)); //선택 날짜를 기준으로 양옆에 3날짜 출력
    fetchMatches(date);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: dates.indexOf(date) * 70,
        animated: true,
      });
    }
  };

  const onDayPress = (day) => { //캘린더의 날짜를 눌렀을 때 호출되는 함수
    setSelectedDate(day.dateString);
    setDates(generateDates(moment(day.dateString), 3, 3));
    setIsCalendarVisible(false);
    fetchMatches(day.dateString);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: dates.indexOf(day.dateString) * 70,
        animated: true,
      });
    }
  };

  const renderDateTabs = () => {// 날짜 탭을 렌더링하는 함수
    return dates.map((date, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.dateTab, selectedDate === date && styles.selectedDateTab]}
        onPress={() => onDateSelect(date)}
      >
        <Text style={[styles.dateText, selectedDate === date && styles.selectedDateText]}>
          {moment(date).calendar(null, {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'MM/DD',
            lastDay: '[Yesterday]',
            lastWeek: 'MM/DD',
            sameElse: 'MM/DD'
          })}
        </Text>
      </TouchableOpacity>
    ));
  };

  const renderMatchesForDate = () => {  // 선택된 날짜에 해당하는 경기 목록을 렌더링하는 함수
    return (matches[selectedDate] || []).map((match, index) => (
      <TouchableOpacity
        key={index}
        style={styles.matchItem}
        onPress={() => navigation.navigate('MatchDetails', { match })}
      >
        <View style={styles.teamSection}>
          <Image source={{ uri: teamLogos[match.home_team_name] }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{match.home_team_name}</Text>
        </View>
  
        <View style={styles.matchDetails}>
          {match.status === 'complete' ? (
            <View style={styles.scoreBox}>
              <Text style={styles.scoreText}>{match.home_team_goal_count}</Text>
              <Text style={styles.vsText}>vs</Text>
              <Text style={styles.scoreText}>{match.away_team_goal_count}</Text>
            </View>
          ) : (
            <Text style={styles.vsText}>vs</Text>
          )}
          <Text style={styles.matchTime}>{match.time}</Text>
        </View>
  
        <View style={styles.teamSection}>
          <Image source={{ uri: teamLogos[match.away_team_name] }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{match.away_team_name}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ScrollView
          horizontal
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          {renderDateTabs()}
        </ScrollView>
        <TouchableOpacity
          onPress={() => setIsCalendarVisible(!isCalendarVisible)}
          style={styles.calendarButton}
        >
          <Ionicons name="calendar" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      {isCalendarVisible && (
        <Calendar
          onDayPress={onDayPress}
          current={selectedDate}
          markedDates={{
            ...markedDates,
            [selectedDate]: { ...markedDates[selectedDate], selected: true, selectedColor: 'black' },
          }}
        />
      )}
      <ScrollView style={styles.matchList}>
        {renderMatchesForDate()}
      </ScrollView>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarButton: {
    marginLeft: 'auto',
  },
  dateTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    backgroundColor: 'transparent',
    borderRadius: 18,
  },
  selectedDateTab: {
    backgroundColor: '#000000',
  },
  dateText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedDateText: {
    color: '#fff',
  },
  matchList: {
    flex: 1,
  },
  matchItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  matchText: {
    fontSize: 16,
  },
  matchTime: {
    fontSize: 16,
    color: '#888',
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
  },
  teamLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  teamName: {
    fontSize: 12,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  matchDetails: {
    flex: 1,
    alignItems: 'center',
  },
  matchText: {
    fontSize: 16,
  },
  matchTime: {
    fontSize: 14,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  vsText: {
    fontSize: 16,
  },
});

export default ScheduleScreen;