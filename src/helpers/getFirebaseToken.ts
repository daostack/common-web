import firebase from "../shared/utils/firebase";

const getFirebaseToken = async (): Promise<string | undefined> => await firebase.auth().currentUser?.getIdToken(true);

export default getFirebaseToken;
