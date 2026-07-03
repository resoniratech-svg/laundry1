import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';

export default function App() {
  const [role, setRole] = useState(null); // 'customer' or 'delivery'

  if (role === 'customer') {
    return <CustomerDashboard onLogout={() => setRole(null)} />;
  }
  
  if (role === 'delivery') {
    return <DeliveryDashboard onLogout={() => setRole(null)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Laundra Mobile</Text>
        <Text style={styles.subtitle}>Sign in to your portal</Text>
        
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Email Address" 
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            secureTextEntry 
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#3b82f6' }]} 
          onPress={() => setRole('customer')}
        >
          <Text style={styles.buttonText}>Log in as Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#10b981', marginTop: 16 }]} 
          onPress={() => setRole('delivery')}
        >
          <Text style={styles.buttonText}>Log in as Delivery Driver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function CustomerDashboard({ onLogout }) {
  return (
    <SafeAreaView style={styles.dashboardContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customer Portal</Text>
        <TouchableOpacity onPress={onLogout}><Text style={styles.logoutText}>Log out</Text></TouchableOpacity>
      </View>
      <View style={styles.dashboardContent}>
        <Text style={styles.welcomeText}>Welcome back, Selena!</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Orders</Text>
          <Text style={styles.cardText}>Order #1042 - In Progress (Washing)</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Wallet Balance</Text>
          <Text style={styles.cardText}>$45.00</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function DeliveryDashboard({ onLogout }) {
  return (
    <SafeAreaView style={styles.dashboardContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Delivery Portal</Text>
        <TouchableOpacity onPress={onLogout}><Text style={styles.logoutText}>Log out</Text></TouchableOpacity>
      </View>
      <View style={styles.dashboardContent}>
        <Text style={styles.welcomeText}>Welcome back, Driver!</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Route</Text>
          <Text style={styles.cardText}>3 pickups, 2 deliveries remaining today.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Next Stop</Text>
          <Text style={styles.cardText}>102 Ocean View Apt (Pickup)</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 48,
  },
  inputContainer: {
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  dashboardContent: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '600',
  },
  cardText: {
    fontSize: 18,
    color: '#0f172a',
    fontWeight: '500',
  }
});
