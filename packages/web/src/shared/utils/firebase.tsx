import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

import config from "../../config";

firebase.initializeApp(config.firebase);

export default firebase;
