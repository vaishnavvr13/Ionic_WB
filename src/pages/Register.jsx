import React, { useState } from 'react';
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
  IonText,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.detail.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Add registration logic here
    console.log('Register attempt with:', formData);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <form onSubmit={handleRegister}>
              <IonItem>
                <IonLabel position="floating">Full Name</IonLabel>
                <IonInput
                  type="text"
                  value={formData.name}
                  onIonChange={(e) => handleChange(e, 'name')}
                  required
                />
              </IonItem>

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

              <IonItem className="ion-margin-bottom">
                <IonLabel position="floating">Confirm Password</IonLabel>
                <IonInput
                  type="password"
                  value={formData.confirmPassword}
                  onIonChange={(e) => handleChange(e, 'confirmPassword')}
                  required
                />
              </IonItem>

              <IonButton expand="block" type="submit" className="ion-margin-top">
                Create Account
              </IonButton>

              <div className="ion-text-center ion-margin-top">
                <IonText>Already have an account? </IonText>
                <Link to="/login">
                  <IonText color="primary">Login</IonText>
                </Link>
              </div>
            </form>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Register;
