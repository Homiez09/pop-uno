import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export const load = (async () => {
    const ref = doc(db, 'count', 'first-post');
    const snapshot = await getDoc(ref);
    return {
      post: snapshot.data(),
    };
});