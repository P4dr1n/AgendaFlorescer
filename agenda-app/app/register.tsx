import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleGoBack = () => {
    router.back(); 
  };

  const handleRegister = () => {
    
    console.log("Registrando usuário...");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#B23A6D', '#E85A8E']} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="calendar-clock" size={60} color="#FFF" />
          </View>
          <View style={styles.inputGroup}><Text style={styles.label}>Usuário:</Text><TextInput style={styles.input} placeholder="Digite Seu Usuário" placeholderTextColor="#EEDDE6" value={usuario} onChangeText={setUsuario} /></View>
          <View style={styles.inputGroup}><Text style={styles.label}>Senha:</Text><TextInput style={styles.input} placeholder="Digite Sua Senha" placeholderTextColor="#EEDDE6" secureTextEntry value={senha} onChangeText={setSenha} /></View>
          <View style={styles.inputGroup}><Text style={styles.label}>Confirmar Sua Senha:</Text><TextInput style={styles.input} placeholder="Confirme sua senha" placeholderTextColor="#EEDDE6" secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} /></View>
          <View style={styles.inputGroup}><Text style={styles.label}>Telefone:</Text><TextInput style={styles.input} placeholder="Digite Seu Número" placeholderTextColor="#EEDDE6" keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} /></View>
          <View style={styles.inputGroup}><Text style={styles.label}>Email:</Text><TextInput style={styles.input} placeholder="Digite Seu Email" placeholderTextColor="#EEDDE6" keyboardType="email-address" value={email} onChangeText={setEmail} /></View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleGoBack}>
              <Text style={styles.buttonText}>VOLTAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>REGISTRAR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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