import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { KeycloakService } from '@/services/auth/keycloak.service';
import { useAuthStore } from '@/store/auth.store';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '@/services/api/api-client';

export default function LoginScreen() {
  const setUser = useAuthStore((s) => s.setUser);
  
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: KeycloakService.getClientId(),
      redirectUri: KeycloakService.getRedirectUri(),
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Code,
    },
    KeycloakService.getDiscovery()
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      const codeVerifier = request?.codeVerifier;

      if (code && codeVerifier) {
        handleCallback(code, codeVerifier);
      }
    }
  }, [response]);

  const handleCallback = async (code: string, codeVerifier: string) => {
    try {
      await KeycloakService.handleTokenExchange(code, codeVerifier);
      
      // Busca dados do usuário logado
      const userRes = await apiClient.get('/bff/users/me');
      setUser(userRes.data);
      
      router.replace('/(app)/home');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="home" size={80} color="#007AFF" />
        <Text style={styles.title}>Cawme</Text>
        <Text style={styles.subtitle}>Sua solução para serviços domésticos</Text>
      </View>

      <View style={styles.form}>
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => promptAsync()}
          disabled={!request}
        >
          {!request ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar com Keycloak</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 50 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#007AFF', marginTop: 10 },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  form: { width: '100%' },
  loginButton: { 
    backgroundColor: '#007AFF', 
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center',
    height: 56,
    justifyContent: 'center'
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
