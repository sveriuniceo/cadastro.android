import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Button, ImageBackground, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground source={{ uri: 'https://i.pinimg.com/originals/ad/99/03/ad99037a30d32356b84197951830b203.jpg' }} style={styles.backgroundImage}>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButtonText}>Clique aqui para fazer login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    authenticate();
  }, []);

  const authenticate = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync() && await LocalAuthentication.isEnrolledAsync();
    if (compatible) {
      const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Autentique-se para continuar' });
      if (result.success) {
        setShowSuccessMessage(true);
        navigation.navigate('Home');
      }
    }
  };

  const handleLogin = async () => {
    if (email && password) {
      try {
        const usersData = await AsyncStorage.getItem('users');
        if (usersData) {
          const users = JSON.parse(usersData);
          const user = users.find(u => u.email === email && u.password === password);
          if (user) {
            setShowSuccessMessage(true);
            navigation.navigate('Home');
          } else {
            alert('Credenciais inválidas');
          }
        } else {
          alert('Nenhum usuário cadastrado');
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
      }
    } else {
      alert('Por favor, preencha todos os campos!');
    }
  };

  return (
    <ImageBackground source={{ uri: 'https://i.pinimg.com/236x/bc/4a/6f/bc4a6fd71e2967cbd664cd8aaafd3b54.jpg' }} style={styles.backgroundImage}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry
        />
        <Button title="Entrar" onPress={handleLogin} />
        {showSuccessMessage && <Text style={styles.successMessage}>Login bem sucedido</Text>}
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>Ainda não tem conta? Crie sua conta aqui!</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

function SignupScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSignup = async () => {
    if (firstName && lastName && email && password && confirmPassword) {
      if (password === confirmPassword) {
        try {
          const newUser = { firstName, lastName, email, password };
          let users = [];
          const existingUsersData = await AsyncStorage.getItem('users');
          if (existingUsersData) {
            users = JSON.parse(existingUsersData);
          }
          users.push(newUser);
          await AsyncStorage.setItem('users', JSON.stringify(users));
          setShowSuccessMessage(true);
          navigation.navigate('Login');
        } catch (error) {
          console.error('Erro ao registrar usuário:', error);
        }
      } else {
        alert('As senhas não coincidem!');
      }
    } else {
      alert('Por favor, preencha todos os campos!');
    }
  };

  return (
    <ImageBackground source={{ uri: 'https://i.pinimg.com/236x/bc/4a/6f/bc4a6fd71e2967cbd664cd8aaafd3b54.jpg' }} style={styles.backgroundImage}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Registro</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          onChangeText={text => setFirstName(text)}
          value={firstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Sobrenome"
          onChangeText={text => setLastName(text)}
          value={lastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirme sua senha"
          onChangeText={text => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry
        />
        <Button title="Registrar" onPress={handleSignup} />
        {showSuccessMessage && <Text style={styles.successMessage}>Conta registrada com sucesso</Text>}
      </View>
    </ImageBackground>
  );
}

function HomeScreen({ navigation }) {
  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);
  const [productPrice, setProductPrice] = useState('');
  const [products, setProducts] = useState([]);

  const handleAddProduct = () => {
    if (productName && productPrice) {
      const newProduct = {
        name: productName,
        quantity: productQuantity,
        price: parseFloat(productPrice).toFixed(2),
      };
      setProducts([...products, newProduct]);
      setProductName('');
      setProductQuantity(1);
      setProductPrice('');
    } else {
      alert('Por favor, preencha todos os campos!');
    }
  };

  const handleIncreaseQuantity = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index].quantity++;
    setProducts(updatedProducts);
  };

  const handleDecreaseQuantity = (index) => {
    const updatedProducts = [...products];
    if (updatedProducts[index] && updatedProducts[index].quantity > 1) {
      updatedProducts[index].quantity--;
      setProducts(updatedProducts);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do produto"
          onChangeText={text => setProductName(text)}
          value={productName}
        />
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => setProductQuantity(productQuantity > 1 ? productQuantity - 1 : 1)}>
            <Text style={styles.quantityButton}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{productQuantity}</Text>
          <TouchableOpacity onPress={() => setProductQuantity(productQuantity + 1)}>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Digite o preço do produto"
          onChangeText={text => setProductPrice(text)}
          value={productPrice}
          keyboardType="numeric"
        />
        <Button title="Salvar" onPress={handleAddProduct} />
      </View>
      {products.map((product, index) => (
        <View key={index} style={styles.productItem}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}> - R${product.price}</Text>
          </View>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => handleIncreaseQuantity(index)}>
              <Text style={styles.quantityButton}>+</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{product.quantity}</Text>
            <TouchableOpacity onPress={() => handleDecreaseQuantity(index)}>
              <Text style={styles.quantityButton}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <TouchableOpacity onPress={() => navigation.navigate('Summary', { products })}>
        <Text style={styles.summaryLink}>Visualizar resumo do dia</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function SummaryScreen({ route }) {
  const { products } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Resumo do Dia</Text>
        {products.map((product, index) => (
          <View key={index} style={[styles.productItem, { borderWidth: 1, borderColor: 'black', padding: 10, borderRadius: 5, marginBottom: 10 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}> - R${product.price}</Text>
              <Text style={styles.productQuantity}> - Quantidade: {product.quantity}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.totalValue}>Valor Total das Vendas: R${products.reduce((acc, product) => acc + (product.quantity * parseFloat(product.price)), 0).toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
  },
  loginButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  formContainer: {
    width: '80%',
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  successMessage: {
    marginTop: 10,
    color: 'green',
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quantityButton: {
    fontSize: 24,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  summaryLink: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  },
  summaryContainer: {
    width: '80%',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  productName: {
    fontSize: 16,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  productQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
