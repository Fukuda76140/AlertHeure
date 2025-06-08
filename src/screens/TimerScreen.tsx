import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {WorkConfig, TimeEntry} from '../types';
import {
  getWorkHoursPerDay,
  formatTimeWithSeconds,
  getCurrentTimeString,
  getTodayDateString,
} from '../utils/timeCalculations';
import NotificationService from '../services/NotificationService';

type TimerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Timer'
>;

interface Props {
  navigation: TimerScreenNavigationProp;
}

const TimerScreen: React.FC<Props> = ({navigation}) => {
  const [config, setConfig] = useState<WorkConfig | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [todayEntry, setTodayEntry] = useState<TimeEntry | null>(null);
  const [notificationsScheduled, setNotificationsScheduled] = useState({
    workComplete: false,
    overtime: false,
    maxOvertime: false,
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    loadConfig();
    loadTodayEntry();
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      subscription?.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: any) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      if (isWorking && startTime) {
        updateElapsedTime();
      }
    }
    appState.current = nextAppState;
  };

  const loadConfig = async () => {
    try {
      const configStr = await AsyncStorage.getItem('workConfig');
      if (configStr) {
        setConfig(JSON.parse(configStr));
      } else {
        navigation.navigate('Config');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
    }
  };

  const loadTodayEntry = async () => {
    try {
      const today = getTodayDateString();
      const entryStr = await AsyncStorage.getItem(`timeEntry_${today}`);
      if (entryStr) {
        const entry: TimeEntry = JSON.parse(entryStr);
        setTodayEntry(entry);
        
        if (entry.endTime === null) {
          setIsWorking(true);
          setStartTime(entry.startTime);
          updateElapsedTime();
          startTimer();
        } else {
          setElapsedSeconds(entry.totalWorked * 60);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'entrée du jour:', error);
    }
  };

  const updateElapsedTime = () => {
    if (startTime) {
      const now = new Date();
      const start = new Date();
      const [hours, minutes] = startTime.split(':');
      start.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const diffMs = now.getTime() - start.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);
      setElapsedSeconds(diffSeconds > 0 ? diffSeconds : 0);
    }
  };

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      updateElapsedTime();
      checkAndScheduleNotifications();
    }, 1000);
  };

  const checkAndScheduleNotifications = () => {
    if (!config || !isWorking) return;

    const requiredSeconds = getWorkHoursPerDay(config.workHours) * 60;
    const overtimeSeconds = elapsedSeconds - requiredSeconds;
    const maxOvertimeSeconds = 72 * 60; // 1h12

    // Notification de fin de journée normale
    if (elapsedSeconds >= requiredSeconds && !notificationsScheduled.workComplete) {
      NotificationService.showImmediateNotification(
        'Horaire de travail terminé ! 🎉',
        'Vous avez accompli votre temps de travail quotidien.'
      );
      setNotificationsScheduled(prev => ({...prev, workComplete: true}));
    }

    // Notification heures supplémentaires (15 minutes après fin normale)
    if (overtimeSeconds >= 900 && !notificationsScheduled.overtime) { // 15 minutes
      NotificationService.showImmediateNotification(
        'Heures supplémentaires ⏰',
        'Vous faites des heures supplémentaires. Pensez à vous reposer !'
      );
      setNotificationsScheduled(prev => ({...prev, overtime: true}));
    }

    // Notification limite heures sup
    if (overtimeSeconds >= maxOvertimeSeconds && !notificationsScheduled.maxOvertime) {
      NotificationService.showImmediateNotification(
        'Limite d\'heures sup atteinte ! ⚠️',
        'Vous avez dépassé la limite de 1h12 d\'heures supplémentaires.'
      );
      setNotificationsScheduled(prev => ({...prev, maxOvertime: true}));
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    NotificationService.cancelAllNotifications();
  };

  const startWork = async () => {
    const now = getCurrentTimeString();
    const today = getTodayDateString();
    
    const newEntry: TimeEntry = {
      date: today,
      startTime: now,
      endTime: null,
      breakDuration: config?.lunchBreak || 30,
      totalWorked: 0,
      overtime: 0,
    };

    try {
      await AsyncStorage.setItem(`timeEntry_${today}`, JSON.stringify(newEntry));
      setTodayEntry(newEntry);
      setStartTime(now);
      setIsWorking(true);
      setElapsedSeconds(0);
      setNotificationsScheduled({
        workComplete: false,
        overtime: false,
        maxOvertime: false,
      });
      startTimer();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de démarrer le timer');
    }
  };

  const endWork = async () => {
    if (!todayEntry || !config) return;

    const now = getCurrentTimeString();
    const totalWorkedMinutes = Math.floor(elapsedSeconds / 60);
    const requiredMinutes = getWorkHoursPerDay(config.workHours);
    const overtime = Math.max(0, totalWorkedMinutes - requiredMinutes);

    const updatedEntry: TimeEntry = {
      ...todayEntry,
      endTime: now,
      totalWorked: totalWorkedMinutes,
      overtime: overtime,
    };

    try {
      await AsyncStorage.setItem(
        `timeEntry_${updatedEntry.date}`,
        JSON.stringify(updatedEntry)
      );
      setTodayEntry(updatedEntry);
      setIsWorking(false);
      stopTimer();
      
      Alert.alert(
        'Journée terminée',
        `Temps travaillé: ${formatTimeWithSeconds(elapsedSeconds)}\nHeures sup: ${Math.floor(overtime / 60)}h${(overtime % 60).toString().padStart(2, '0')}`
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder');
    }
  };

  const resetDay = async () => {
    Alert.alert(
      'Réinitialiser',
      'Voulez-vous vraiment recommencer la journée ?',
      [
        {text: 'Annuler', style: 'cancel'},
        {
          text: 'Oui',
          style: 'destructive',
          onPress: async () => {
            const today = getTodayDateString();
            try {
              await AsyncStorage.removeItem(`timeEntry_${today}`);
              setTodayEntry(null);
              setIsWorking(false);
              setStartTime(null);
              setElapsedSeconds(0);
              setNotificationsScheduled({
                workComplete: false,
                overtime: false,
                maxOvertime: false,
              });
              stopTimer();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de réinitialiser');
            }
          },
        },
      ]
    );
  };

  if (!config) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const requiredSeconds = getWorkHoursPerDay(config.workHours) * 60;
  const remainingSeconds = Math.max(0, requiredSeconds - elapsedSeconds);
  const overtimeSeconds = Math.max(0, elapsedSeconds - requiredSeconds);
  const maxOvertimeSeconds = 72 * 60; // 1h12

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horaires du jour</Text>
      
      <View style={styles.timeCard}>
        <Text style={styles.timeLabel}>Temps effectué</Text>
        <Text style={styles.timeValue}>
          {formatTimeWithSeconds(elapsedSeconds)}
        </Text>
      </View>

      {elapsedSeconds < requiredSeconds ? (
        <View style={styles.timeCard}>
          <Text style={styles.timeLabel}>Temps restant</Text>
          <Text style={[styles.timeValue, styles.remainingTime]}>
            {formatTimeWithSeconds(remainingSeconds)}
          </Text>
        </View>
      ) : (
        <View style={styles.timeCard}>
          <Text style={styles.timeLabel}>Heures supplémentaires</Text>
          <Text style={[
            styles.timeValue, 
            overtimeSeconds > maxOvertimeSeconds ? styles.maxOvertime : styles.overtime
          ]}>
            {formatTimeWithSeconds(overtimeSeconds)}
          </Text>
          {overtimeSeconds > maxOvertimeSeconds && (
            <Text style={styles.maxOvertimeText}>
              Limite de 1h12 dépassée !
            </Text>
          )}
        </View>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          Horaire: {config.workHours}h/semaine
        </Text>
        <Text style={styles.infoText}>
          Pause: {config.lunchBreak} minutes
        </Text>
        {startTime && (
          <Text style={styles.infoText}>
            Début: {startTime}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {!isWorking && !todayEntry ? (
          <TouchableOpacity style={styles.startButton} onPress={startWork}>
            <Text style={styles.buttonText}>Commencer la journée</Text>
          </TouchableOpacity>
        ) : isWorking ? (
          <TouchableOpacity style={styles.endButton} onPress={endWork}>
            <Text style={styles.buttonText}>Terminer la journée</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.finishedContainer}>
            <Text style={styles.finishedText}>Journée terminée</Text>
            <TouchableOpacity style={styles.resetButton} onPress={resetDay}>
              <Text style={styles.buttonText}>Recommencer</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <TouchableOpacity
          style={styles.configButton}
          onPress={() => navigation.navigate('Config')}>
          <Text style={styles.configButtonText}>Configuration</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  timeCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  timeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  remainingTime: {
    color: '#007AFF',
  },
  overtime: {
    color: '#FF6B35',
  },
  maxOvertime: {
    color: '#FF3B30',
  },
  maxOvertimeText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 5,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  startButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  endButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#FF9500',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  configButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  configButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  finishedContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  finishedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34C759',
    marginBottom: 15,
  },
});

export default TimerScreen;