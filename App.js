import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button, Surface, Text, Provider as PaperProvider, MD3LightTheme, Card, IconButton, Chip } from 'react-native-paper';
import CryptoJS from 'crypto-js';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [result, setResult] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [selectedMethod, setSelectedMethod] = useState('AES-CBC');

  // Load saved data on component mount
  useEffect(() => {
    loadSavedData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    saveData();
  }, [inputText, encryptionKey, selectedMethod]);

  const loadSavedData = () => {
    try {
      const savedData = localStorage.getItem('encryptionData');
      if (savedData) {
        const data = JSON.parse(savedData);
        setInputText(data.inputText || '');
        setEncryptionKey(data.encryptionKey || '');
        setSelectedMethod(data.selectedMethod || 'AES-CBC');
        setCurrentScreen('encrypt'); // Navigate directly to encryption screen
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveData = () => {
    try {
      const dataToSave = {
        inputText,
        encryptionKey,
        selectedMethod
      };
      localStorage.setItem('encryptionData', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Clear saved data
  const clearSavedData = () => {
    try {
      localStorage.removeItem('encryptionData');
      setInputText('');
      setEncryptionKey('');
      setResult('');
    } catch (error) {
      console.error('Error clearing saved data:', error);
    }
  };

  // Constant encryption key for Method 2 (same as Flutter example)
  const FIXED_KEY = '7878tyefngfh9173';

  const encryptionMethods = [
    { name: 'AES-CBC', description: 'AES encryption with CBC mode and random IV' },
    { name: 'AES-ECB', description: 'AES encryption with ECB mode and fixed key' },
    { name: 'Base64', description: 'Simple Base64 encoding (not encryption)' }
  ];

  // Generate random IV (16 bytes)
  const generateIV = () => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return CryptoJS.lib.WordArray.create(array);
  };

  // Method 1: AES-CBC with random IV
  const encryptMethodOne = (data) => {
    try {
      // Convert input to JSON if it's not already a string
      const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
      
      // Generate IV
      const iv = generateIV();
      
      // Create encrypted data
      const encrypted = CryptoJS.AES.encrypt(jsonData, CryptoJS.enc.Base64.parse(encryptionKey), {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      // Create encrypted object with IV
      const encryptedObject = {
        iv: CryptoJS.enc.Base64.stringify(iv),
        value: encrypted.toString()
      };

      // Convert to Base64
      const jsonString = JSON.stringify(encryptedObject);
      return btoa(jsonString);
    } catch (error) {
      throw new Error('Encryption failed: ' + error.message);
    }
  };

  // Method 2: AES-ECB with fixed key
  const encryptMethodTwo = (data) => {
    try {
      const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
      
      const encrypted = CryptoJS.AES.encrypt(jsonData, FIXED_KEY, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });

      return encrypted.toString();
    } catch (error) {
      throw new Error('Encryption failed: ' + error.message);
    }
  };

  // Method 1: Decryption for AES-CBC
  const decryptMethodOne = (encryptedData) => {
    try {
      // Decode Base64
      const jsonString = atob(encryptedData);
      const parsedData = JSON.parse(jsonString);

      // Get IV and encrypted value
      const iv = CryptoJS.enc.Base64.parse(parsedData.iv);
      
      // Decrypt
      const decrypted = CryptoJS.AES.decrypt(parsedData.value, CryptoJS.enc.Base64.parse(encryptionKey), {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText);
    } catch (error) {
      throw new Error('Decryption failed: ' + error.message);
    }
  };

  // Method 2: Decryption for AES-ECB
  const decryptMethodTwo = (encryptedData) => {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, FIXED_KEY, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });

      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText);
    } catch (error) {
      throw new Error('Decryption failed: ' + error.message);
    }
  };

  const encrypt = () => {
    try {
      let encrypted = '';
      switch (selectedMethod) {
        case 'AES-CBC':
          encrypted = encryptMethodOne(inputText);
          break;
        case 'AES-ECB':
          encrypted = encryptMethodTwo(inputText);
          break;
        case 'Base64':
          encrypted = btoa(inputText);
          break;
      }
      setResult(encrypted);
      setIsEncrypted(true);
    } catch (error) {
      setResult('Encryption failed: ' + error.message);
    }
  };

  const decrypt = () => {
    try {
      let decrypted;
      switch (selectedMethod) {
        case 'AES-CBC':
          decrypted = decryptMethodOne(inputText);
          break;
        case 'AES-ECB':
          decrypted = decryptMethodTwo(inputText);
          break;
        case 'Base64':
          decrypted = atob(inputText);
          break;
      }
      setResult(typeof decrypted === 'object' ? JSON.stringify(decrypted, null, 2) : decrypted);
      setIsEncrypted(false);
    } catch (error) {
      setResult('Decryption failed: ' + error.message);
    }
  };

  const WelcomeScreen = () => (
    <Surface style={styles.surface} elevation={2}>
      <Text style={styles.title}>Welcome to Encryption App</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>How to Use:</Text>
          <Text style={styles.instruction}>1. Choose your encryption method</Text>
          <Text style={styles.instruction}>2. Enter the text you want to encrypt or decrypt</Text>
          <Text style={styles.instruction}>3. Provide a secure encryption key</Text>
          <Text style={styles.instruction}>4. Click 'Encrypt' to secure your text</Text>
          <Text style={styles.instruction}>5. To decrypt, paste the encrypted text and use the same key</Text>
          
          <Text style={[styles.instruction, styles.warning]}>
            Important: Remember your encryption key and method! You need both to decrypt your text.
          </Text>
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        onPress={() => setCurrentScreen('methods')}
        style={styles.startButton}
      >
        Choose Encryption Method
      </Button>
    </Surface>
  );

  const MethodsScreen = () => (
    <Surface style={styles.surface} elevation={2}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Encryption Method</Text>
        <Button
          mode="text"
          onPress={() => setCurrentScreen('welcome')}
          style={styles.backButton}
        >
          Back
        </Button>
      </View>
      
      <View style={styles.methodsContainer}>
        {encryptionMethods.map((method) => (
          <Card
            key={method.name}
            style={[
              styles.methodCard,
              selectedMethod === method.name && styles.selectedMethodCard
            ]}
            onPress={() => {
              setSelectedMethod(method.name);
              setCurrentScreen('encrypt');
            }}
          >
            <Card.Content>
              <Text style={styles.methodTitle}>{method.name}</Text>
              <Text style={styles.methodDescription}>{method.description}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>
    </Surface>
  );

  const EncryptionScreen = () => (
    <Surface style={styles.surface} elevation={2}>
      <View style={styles.header}>
        <Text style={styles.title}>Encryption/Decryption</Text>
        <View style={styles.headerButtons}>
          <Button
            mode="text"
            onPress={() => setCurrentScreen('methods')}
            style={styles.backButton}
          >
            Change Method
          </Button>
          <Button
            mode="text"
            onPress={clearSavedData}
            style={styles.clearButton}
          >
            Clear Data
          </Button>
        </View>
      </View>

      <Chip style={styles.methodChip}>{selectedMethod}</Chip>
      
      <TextInput
        label="Enter text or JSON data"
        value={inputText}
        onChangeText={setInputText}
        mode="outlined"
        style={[styles.input, styles.dataInput]}
        multiline
        numberOfLines={8}
        textAlignVertical="top"
        placeholder="Enter your text or JSON data here..."
        scrollEnabled={true}
        blurOnSubmit={false}
      />
      
      {selectedMethod === 'AES-CBC' && (
        <TextInput
          label="Encryption Key (Base64)"
          value={encryptionKey}
          onChangeText={setEncryptionKey}
          mode="outlined"
          style={styles.input}
          secureTextEntry
        />
      )}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={encrypt}
          style={styles.button}
        >
          Encrypt
        </Button>
        
        <Button
          mode="contained"
          onPress={decrypt}
          style={styles.button}
        >
          Decrypt
        </Button>
      </View>

      <Surface style={styles.resultContainer} elevation={1}>
        <Text style={styles.resultTitle}>Result:</Text>
        <ScrollView style={styles.resultScroll}>
          <Text selectable style={styles.resultText}>{result}</Text>
        </ScrollView>
      </Surface>
    </Surface>
  );

  const getScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'methods':
        return <MethodsScreen />;
      case 'encrypt':
        return <EncryptionScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <PaperProvider theme={MD3LightTheme}>
      <ScrollView style={styles.container}>
        {getScreen()}
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    marginLeft: 8,
  },
  card: {
    marginBottom: 20,
  },
  methodsContainer: {
    gap: 12,
  },
  methodCard: {
    marginBottom: 12,
  },
  selectedMethodCard: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    borderWidth: 2,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  methodDescription: {
    color: '#666',
  },
  methodChip: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  warning: {
    marginTop: 12,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  startButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
  input: {
    marginBottom: 16,
  },
  dataInput: {
    minHeight: 200,
    textAlignVertical: 'top',
    paddingTop: 8,
    paddingBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    minWidth: 120,
  },
  resultContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    maxHeight: 200,
  },
  resultScroll: {
    maxHeight: 150,
  },
  resultText: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  clearButton: {
    marginLeft: 8,
  },
}); 