import { getStorage, ref } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: 'tadakirnet-clone-ae832.firebaseapp.com',
  projectId: 'tadakirnet-clone-ae832',
  storageBucket: 'tadakirnet-clone-ae832.appspot.com',
  messagingSenderId: '430309336963',
  appId: '1:430309336963:web:c30381855394fe42fdb8b6',
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
