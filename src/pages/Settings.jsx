import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';

const Settings = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonLabel>Dark Mode</IonLabel>
            <IonToggle slot="end" />
          </IonItem>
          <IonItem>
            <IonLabel>Notifications</IonLabel>
            <IonToggle slot="end" defaultChecked />
          </IonItem>
          <IonItem>
            <IonLabel>Language</IonLabel>
            <IonSelect value="english">
              <IonSelectOption value="english">English</IonSelectOption>
              <IonSelectOption value="spanish">Spanish</IonSelectOption>
              <IonSelectOption value="french">French</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
