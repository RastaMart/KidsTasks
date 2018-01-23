
import * as firebase from 'firebase';
import firebaseui from 'firebaseui';


    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyDg3ant1rGaercWggLzR1SueEpTDsiTEuw",
      authDomain: "kidstasks-649d6.firebaseapp.com",
      databaseURL: "https://kidstasks-649d6.firebaseio.com",
      projectId: "kidstasks-649d6",
      storageBucket: "kidstasks-649d6.appspot.com",
      messagingSenderId: "419939611097",
      //domain:'http://localhost:3000',
      //domain:'http://192.168.0.114:3000',
      //domain:'https://192.168.0.114:3000',
      domain:document.location.protocol+'//'+document.location.hostname+(document.location.port ? ':'+document.location.port: '')
    };
    firebase.initializeApp(config);

    // FirebaseUI config.
      var uiConfig = {
        signInSuccessUrl: config.domain + '/LoginSuccess',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          //firebase.auth.GithubAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        // Terms of service url.
        tosUrl: config.domain + '/termOfService'
      };

      // Initialize the FirebaseUI Widget using Firebase.
      

export default {
    fbAuth : firebase.auth(),
    fbDb: firebase.database(),
    fbUi : new firebaseui.auth.AuthUI(firebase.auth()),
    fbUiConfig : uiConfig,
    dayOfWeek : ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
};