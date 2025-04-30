import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonButton,
  IonInput,
  IonModal,
  IonButtons,
  IonToast,
} from "@ionic/react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [emailForm, setEmailForm] = useState({
    email: "",
    currentPassword: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdateEmail = async () => {
    try {
      if (!emailForm.email || !emailForm.currentPassword) {
        setToastMessage("Please fill in all fields");
        setShowToast(true);
        return;
      }

      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          email: emailForm.email,
          currentPassword: emailForm.currentPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowEmailModal(false);
        setEmailForm({ email: "", currentPassword: "" });
        setToastMessage("Email updated successfully");
        setShowToast(true);
        // Update local storage with new token
        localStorage.setItem("userToken", data.token);
        window.location.reload(); // Refresh to update user data
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setToastMessage(error.message);
      setShowToast(true);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (
        !passwordForm.currentPassword ||
        !passwordForm.newPassword ||
        !passwordForm.confirmPassword
      ) {
        setToastMessage("Please fill in all fields");
        setShowToast(true);
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setToastMessage("New passwords do not match");
        setShowToast(true);
        return;
      }

      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowPasswordModal(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setToastMessage("Password updated successfully");
        setShowToast(true);
        // Update local storage with new token
        localStorage.setItem("userToken", data.token);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setToastMessage(error.message);
      setShowToast(true);
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonAvatar slot="start">
              <img
                alt="Profile"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonLabel>
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
            </IonLabel>
          </IonItem>

          <IonItem button onClick={() => setShowEmailModal(true)}>
            <IonLabel>
              <h3>Update Email</h3>
              <p>Change your email address</p>
            </IonLabel>
          </IonItem>

          <IonItem button onClick={() => setShowPasswordModal(true)}>
            <IonLabel>
              <h3>Update Password</h3>
              <p>Change your password</p>
            </IonLabel>
          </IonItem>

          <IonItem button onClick={logout} color="danger">
            <IonLabel>
              <h3>Logout</h3>
            </IonLabel>
          </IonItem>
        </IonList>

        {/* Email Update Modal */}
        <IonModal
          isOpen={showEmailModal}
          onDidDismiss={() => setShowEmailModal(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Update Email</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowEmailModal(false)}>
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">New Email</IonLabel>
                <IonInput
                  type="email"
                  value={emailForm.email}
                  onIonChange={(e) =>
                    setEmailForm({ ...emailForm, email: e.detail.value })
                  }
                  placeholder="Enter new email"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Current Password</IonLabel>
                <IonInput
                  type="password"
                  value={emailForm.currentPassword}
                  onIonChange={(e) =>
                    setEmailForm({
                      ...emailForm,
                      currentPassword: e.detail.value,
                    })
                  }
                  placeholder="Enter current password"
                />
              </IonItem>
              <IonButton
                expand="block"
                className="ion-margin"
                onClick={handleUpdateEmail}
              >
                Update Email
              </IonButton>
            </IonList>
          </IonContent>
        </IonModal>

        {/* Password Update Modal */}
        <IonModal
          isOpen={showPasswordModal}
          onDidDismiss={() => setShowPasswordModal(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Update Password</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowPasswordModal(false)}>
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Current Password</IonLabel>
                <IonInput
                  type="password"
                  value={passwordForm.currentPassword}
                  onIonChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.detail.value,
                    })
                  }
                  placeholder="Enter current password"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">New Password</IonLabel>
                <IonInput
                  type="password"
                  value={passwordForm.newPassword}
                  onIonChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.detail.value,
                    })
                  }
                  placeholder="Enter new password"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Confirm New Password</IonLabel>
                <IonInput
                  type="password"
                  value={passwordForm.confirmPassword}
                  onIonChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.detail.value,
                    })
                  }
                  placeholder="Confirm new password"
                />
              </IonItem>
              <IonButton
                expand="block"
                className="ion-margin"
                onClick={handleUpdatePassword}
              >
                Update Password
              </IonButton>
            </IonList>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
