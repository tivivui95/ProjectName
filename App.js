/*
 * #8 Send Notification to React Native App using
 * Firebase Cloud Messaging
 * https://aboutreact.com/react-native-notification-firebase-cloud-messaging
 */

// import React in our code
import React, {useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

function onMessageReceived(message) {
  notifee.displayNotification(JSON.parse(message.data.notifee));
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);


var TOPIC = 'gv';

const App = () => {
  const requestUserPermission = async () => {
    /**
     * On iOS, messaging permission must be requested by
     * the current application before messages can be
     * received or sent
     */
    const authStatus = await messaging().requestPermission();
    console.log('Authorization status(authStatus):', authStatus);
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  };

  useEffect(() => {
    if (requestUserPermission()) {
      /**
       * Returns an FCM token for this device
       */
      messaging()
        .getToken()
        .then((fcmToken) => {
          console.log('FCM Token -> ', fcmToken);
          TOPIC = fcmToken;
        });
    } else console.log('Not Authorization status:', authStatus);

    /**
     * When a notification from FCM has triggered the application
     * to open from a quit state, this method will return a
     * `RemoteMessage` containing the notification data, or
     * `null` if the app was opened via another method.
     */
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'getInitialNotification:' +
              'Notification caused app to open from quit state',
          );
          console.log(remoteMessage);
          alert(
            'getInitialNotification: Notification caused app to' +
            ' open from quit state',
          );
        }
      });

    /**
     * When the user presses a notification displayed via FCM,
     * this listener will be called if the app has opened from
     * a background state. See `getInitialNotification` to see
     * how to watch for when a notification opens the app from
     * a quit state.
     */
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      if (remoteMessage) {
        console.log(
          'onNotificationOpenedApp: ' +
            'Notification caused app to open from background state',
        );
        console.log(remoteMessage);
        alert(
          'onNotificationOpenedApp: Notification caused app to' +
          ' open from background state',
        );
      }
    });

    /**
     * Set a message handler function which is called when
     * the app is in the background or terminated. In Android,
     * a headless task is created, allowing you to access the
     * React Native environment to perform tasks such as updating
     * local storage, or sending a network request.
     */
    messaging().setBackgroundMessageHandler(
      async (remoteMessage) => {
        console.log(
          'Message handled in the background!',
          remoteMessage
        );
    });

    /**
     * When any FCM payload is received, the listener callback
     * is called with a `RemoteMessage`. Returns an unsubscribe
     * function to stop listening for new messages.
     */
    const unsubscribe = messaging().onMessage(
      async (remoteMessage) => {
        alert('A new FCM message arrived!');
        console.log(
          'A new FCM message arrived!',
          JSON.stringify(remoteMessage)
        );
      }
    );

    /**
     * Apps can subscribe to a topic, which allows the FCM
     * server to send targeted messages to only those devices
     * subscribed to that topic.
     */
    messaging()
      .subscribeToTopic(TOPIC)
      .then(() => {
        console.log(`Topic: ${TOPIC} Suscribed`);
      });

    return () => {
      unsubscribe;
      /**
       * Unsubscribe the device from a topic.
       */
      // messaging().unsubscribeFromTopic(TOPIC);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleText}>
          Send Notification to React Native App
        </Text>
        <Text style={styles.textStyle}>using</Text>
        {/* <Image
          source={require('./Image/firebase.png')}
          style={{
            width: '90%',
            height: '50%',
            resizeMode: 'contain',
            margin: 30,
          }}
        /> */}
        <Text style={styles.titleText}>
          Firebase Cloud Messaging
        </Text>
      </View>
      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: 'white',
        }}>
        www.aboutreact.com
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    textAlign: 'center',
    backgroundColor: '#307ecc',
  },
  titleText: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'white',
  },
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: 'white',
  },
});

export default App;