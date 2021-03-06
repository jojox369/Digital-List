import React, {useState, useContext} from 'react';

import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import InputComponent from '../components/Input';
import AsyncStorage from '@react-native-community/async-storage';
import {Context} from '../contexts/context';
import {
  Container,
  InputArea,
  LoginButton,
  LoginButtonText,
  ForgotPasswordButton,
  ForgotPasswordButtonText,
} from '../assets/styles/login';

import DSLIcon from '../assets/icons/dsl-icon.svg';
import Api from '../services/user';
import LoadingComponent from '../components/Loading';

export default () => {
  const navigation = useNavigation();

  [username, setUsername] = useState('');
  [password, setPassword] = useState('');
  [loading, setLoading] = useState(false);
  const {dispatch: userDispatch} = useContext(Context);

  const handleClickLogin = async () => {
    if (!username || !password) {
      showMessage({
        message: 'Preencha os campos',
        type: 'warning',
        icon: 'warning',
      });
    } else {
      if (!username.includes('@')) {
        showMessage({
          message: 'Informe um email valido',
          type: 'warning',
          icon: 'warning',
        });
      } else {
        setLoading(true);

        const result = await Api.auth(username, password);

        if (result !== 'error') {
          await AsyncStorage.setItem('logged', 'true');
          await AsyncStorage.setItem('userData', JSON.stringify(result.user));
          userDispatch({
            type: 'setUser',
            payload: {
              user: result.user,
            },
          });
          navigation.reset({
            routes: [{name: 'MainRoutes'}],
          });
        } else {
          setLoading(false);

          showMessage({
            message: 'Usuário e/ou senha inválidos',
            type: 'warning',
            icon: 'warning',
          });
        }
      }
    }
  };
  if (loading) {
    return <LoadingComponent />;
  } else {
    return (
      <Container>
        <DSLIcon width="100%" height="140" fill="#000000" />
        <InputArea>
          <InputComponent
            placeholder="Digite o seu email"
            onChangeText={(t) => setUsername(t)}
            value={username}
            keyboardType="email-address"
          />
          <InputComponent
            placeholder="Digite a sua senha"
            password={true}
            onChangeText={(t) => setPassword(t)}
            value={password}
          />
          <LoginButton onPress={handleClickLogin}>
            <LoginButtonText>Login</LoginButtonText>
          </LoginButton>
        </InputArea>
        <ForgotPasswordButton onPress={() => navigation.navigate('Register')}>
          <ForgotPasswordButtonText>Cadastrar-se</ForgotPasswordButtonText>
        </ForgotPasswordButton>
      </Container>
    );
  }
};
