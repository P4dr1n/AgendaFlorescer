import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function LoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = () => {
   
    router.replace('/(tabs)/home'); 
  };

  const handleNavigateToRegister = () => {
    router.push('/register'); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#B23A6D', '#E85A8E']} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="calendar-clock" size={60} color="#FFF" />
          </View>
          <Text style={styles.title}>AGENDAMENTO</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Usuário:</Text>
            <TextInput style={styles.input} placeholder="Digite Seu Usuário" placeholderTextColor="#EEDDE6" value={usuario} onChangeText={setUsuario} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha:</Text>
            <TextInput style={styles.input} placeholder="Digite Sua Senha" placeholderTextColor="#EEDDE6" secureTextEntry value={senha} onChangeText={setSenha} />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>ENTRAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNavigateToRegister}>
              <Text style={styles.buttonText}>REGISTRAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 40,
    letterSpacing: 2,
  },
  inputGroup: { width: '100%', marginBottom: 15 },
  label: { color: '#FFF', fontSize: 16, marginBottom: 5 },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#FFF',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#886F80',
    paddingVertical: 15,
    borderRadius: 25,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});