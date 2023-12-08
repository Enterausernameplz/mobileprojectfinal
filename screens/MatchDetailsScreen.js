import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// 팀 로고 URL 상수
const teamLogos = {
    "Ulsan": "https://www.kleague.com/assets/images/emblem/emblem_K01.png",
    "Jeonbuk Motors": "https://www.kleague.com/assets/images/emblem/emblem_K05.png",
    "FC Seoul": "https://www.kleague.com/assets/images/emblem/emblem_K09.png",
    "Incheon United": "https://www.kleague.com/assets/images/emblem/emblem_K18.png",
    "Suwon Bluewings": "https://www.kleague.com/assets/images/emblem/emblem_K02.png",
    "Gwangju": "https://www.kleague.com/assets/images/emblem/emblem_K22.png",
    "Jeju United": "https://www.kleague.com/assets/images/emblem/emblem_K04.png",
    "Suwon": "https://www.kleague.com/assets/images/emblem/emblem_K29.png",
    "Daegu": "https://www.kleague.com/assets/images/emblem/emblem_K17.png",
    "Daejeon Citizen": "https://www.kleague.com/assets/images/emblem/emblem_K10.png",
    "Pohang Steelers": "https://www.kleague.com/assets/images/emblem/emblem_K03.png",
    "Gangwon": "https://www.kleague.com/assets/images/emblem/emblem_K21.png",
};

// 전체 바 길이 상수
const TOTAL_BAR_LENGTH = 300;

const MatchDetailsScreen = ({ route, navigation }) => {
    const { match } = route.params;
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        fetchPrediction(match).then(setPrediction);
    }, [match]);

    const getSegmentLength = (percentage) => {
        return TOTAL_BAR_LENGTH * (percentage / 100);
    };

    const handlePress = () => {
        const url = "https://www.coupangplay.com/"; // URL을 입력
        Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
    };

    const fetchPrediction = async (match) => {
        try {
            const requestData = {
                home_team: match.home_team_name,
                away_team: match.away_team_name,
            };
    
            // 심판 데이터가 있으면 요청 데이터에 추가
            if (match.referee) {
                requestData.referee = match.referee;
            }
    
            const response = await fetch('http://127.0.0.1:5000/predict', { //ip변환
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
    
            if (response.ok) {
                const prediction = await response.json();
                return prediction;
            } else {
                console.error('Server responded with an error:', response.status);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            

            <View style={styles.teamContainer}>
                <View style={styles.team}>
                    <Text style={styles.homeAwayLabel}>Home</Text>
                    <Image source={{ uri: teamLogos[match.home_team_name] }} style={styles.teamLogo} />
                    <Text style={styles.teamName}>{match.home_team_name}</Text>
                </View>

                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>{match.home_team_goal_count}</Text>
                    <Text style={styles.scoreDivider}>-</Text>
                    <Text style={styles.scoreText}>{match.away_team_goal_count}</Text>
                </View>

                <View style={styles.team}>
                    <Text style={styles.homeAwayLabel}>Away</Text>
                    <Image source={{ uri: teamLogos[match.away_team_name] }} style={styles.teamLogo} />
                    <Text style={styles.teamName}>{match.away_team_name}</Text>
                </View>
            </View>

            {prediction && (
                <View style={styles.predictionBarContainer}>
                    <View style={styles.barStyle}>
                        <View style={[styles.segment, styles.firstSegment, { backgroundColor: 'red', width: getSegmentLength(prediction['홈 팀 승률']) }]} />
                        <View style={[styles.segment, { backgroundColor: 'grey', width: getSegmentLength(prediction['무승부 승률']) }]} />
                        <View style={[styles.segment, styles.lastSegment, { backgroundColor: 'blue', width: getSegmentLength(prediction['원정 팀 승률']) }]} />
                    </View>
                    <Text style={styles.percentageText}>홈: {prediction['홈 팀 승률']}% / 무: {prediction['무승부 승률']}% / 원정: {prediction['원정 팀 승률']}%</Text>
                </View>
            )}
            <TouchableOpacity onPress={handlePress} style={styles.button}>
                <Text style={styles.buttonText}>Visit K League Website</Text>
            </TouchableOpacity>
            <View style={styles.additionalInfo}>
                <View style={styles.infoItem}>
                    <Ionicons name="person" size={24} style={styles.infoIcon} />
                    <Text style={styles.infoText}>Referee: {match.referee || 'N/A'}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Ionicons name="location" size={24} style={styles.infoIcon} />
                    <Text style={styles.infoText}>Stadium: {match.stadium_name || 'N/A'}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    teamContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    team: {
        alignItems: 'center',
        flex: 1,
    },
    teamLogo: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    teamName: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 4,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    scoreDivider: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    additionalInfo: {
        marginTop: 20,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoIcon: {
        marginRight: 8,
    },
    infoText: {
        fontSize: 16,
    },
    homeAwayLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    predictionBarContainer: {
        alignItems: 'center',
        marginVertical: 10
    },
    percentageText: {
        marginTop: 4,
        fontSize: 14
    },
    barStyle: {
        flexDirection: 'row',
        width: TOTAL_BAR_LENGTH,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden', // 이 부분을 추가하세요
    },
    segment: {
        height: '100%',
    },
    firstSegment: {
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    lastSegment: {
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    button: {
        backgroundColor: '#007AFF', // 버튼 배경색
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MatchDetailsScreen;