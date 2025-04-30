import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonText,
} from '@ionic/react';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const history = useHistory();
  const { login, register, error: authError, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.detail.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let success;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (!formData.name || !formData.email || !formData.password) {
          setError('All fields are required');
          return;
        }
        success = await register(formData);
      }

      if (success) {
        history.push('/home');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{isLogin ? 'Login' : 'Create Account'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

        <IonCard className="ion-margin-top">
          <IonCardContent>
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <IonItem>
                  <IonLabel position="floating">Full Name</IonLabel>
                  <IonInput
                    type="text"
                    value={formData.name}
                    onIonChange={(e) => handleChange(e, 'name')}
                    required={!isLogin}
                  />
                </IonItem>
              )}

              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  type="email"
                  value={formData.email}
                  onIonChange={(e) => handleChange(e, 'email')}
                  required
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput
                  type="password"
                  value={formData.password}
                  onIonChange={(e) => handleChange(e, 'password')}
                  required
                />
              </IonItem>

              {!isLogin && (
                <IonItem>
                  <IonLabel position="floating">Confirm Password</IonLabel>
                  <IonInput
                    type="password"
                    value={formData.confirmPassword}
                    onIonChange={(e) => handleChange(e, 'confirmPassword')}
                    required={!isLogin}
                  />
                </IonItem>
              )}

              {(error || authError) && (
                <IonText color="danger" className="ion-padding-top">
                  <p>{error || authError}</p>
                </IonText>
              )}

              <IonButton
                expand="block"
                type="submit"
                className="ion-margin-top"
                disabled={loading}
              >
                {isLogin ? 'Login' : 'Create Account'}
              </IonButton>

              <div className="ion-text-center ion-margin-top">
                <IonText>
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <IonText 
                    color="primary" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                      setFormData({
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                      });
                    }}
                  >
                    {isLogin ? 'Create one' : 'Login'}
                  </IonText>
                </IonText>
              </div>
            </form>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Auth;
