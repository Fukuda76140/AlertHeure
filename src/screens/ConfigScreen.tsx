import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {WorkConfig} from '../types';

type ConfigScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Config'
>;

interface Props {
  navigation: ConfigScreenNavigationProp;
}

const ConfigScreen: React.FC<Props> = ({navigation}) => {
  const [workHours, setWorkHours] = useState<36 | 39>(36);
  const [lunchBreak, setLunchBreak] = useState<string>('30');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const configStr = await AsyncStorage.getItem('workConfig');
      if (configStr) {
        const config: WorkConfig = JSON.parse(configStr);
        setWorkHours(config.workHours);
        setLunchBreak(config.lunchBreak.toString());
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
    }
  };

  const saveConfig = async () => {
    const lunchBreakNum = parseInt(lunchBreak, 10);
    if (isNaN(lunchBreakNum) || lunchBreakNum < 0) {
      Alert.alert('Erreur', 'Veuillez entrer une durée de pause valide');
      return;
    }

    const config: WorkConfig = {
      workHours,
      lunchBreak: lunchBreakNum,
    };

    try {
      await AsyncStorage.setItem('workConfig', JSON.stringify(config));
      navigation.navigate('Timer');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder la configuration');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuration des horaires</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Type d'horaire :</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.button,
              workHours === 36 && styles.buttonSelected,
            ]}
            onPress={() => setWorkHours(36)}>
            <Text
              style={[
                styles.buttonText,
                workHours === 36 && styles.buttonTextSelected,
              ]}>
              36h/semaine
            </Text>
            <Text style={styles.buttonSubtext}>7h12/jour</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              workHours === 39 && styles.buttonSelected,
            ]}
            onPress={() => setWorkHours(39)}>
            <Text
              style={[
                styles.buttonText,
                workHours === 39 && styles.buttonTextSelected,
              ]}>
              39h/semaine
            </Text>
            <Text style={styles.buttonSubtext}>7h48/jour</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pause déjeuner (minutes) :</Text>
        <TextInput
          style={styles.input}
          value={lunchBreak}
          onChangeText={setLunchBreak}
          keyboardType="numeric"
          placeholder="30"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveConfig}>
        <Text style={styles.saveButtonText}>Commencer</Text>
      </TouchableOpacity>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    margin: 5,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  buttonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  buttonTextSelected: {
    color: '#007AFF',
  },
  buttonSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ConfigScreen;