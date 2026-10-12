import { db } from '../config/firebase.js';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';

export const FirestoreService = {
  // Collection reference helper
  col: (name) => collection(db, name),
  
  // Document reference helper
  docRef: (name, id) => doc(db, name, id),

  // Get all documents in a collection
  async getAll(colName, queryConstraints = []) {
    let q = collection(db, colName);
    if (queryConstraints.length > 0) {
      q = query(q, ...queryConstraints);
    }
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
  },

  // Get a single document by ID
  async getById(colName, id) {
    if (!id) return null;
    const snap = await getDoc(doc(db, colName, id));
    if (!snap.exists()) return null;
    return { id: snap.id, _id: snap.id, ...snap.data() };
  },

  // Find one document matching a field
  async findOne(colName, field, value) {
    const q = query(collection(db, colName), where(field, '==', value), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, _id: d.id, ...d.data() };
  },

  // Create a document (with custom ID or auto-generated)
  async create(colName, data, customId = null) {
    const id = customId || (data.id ? String(data.id) : doc(collection(db, colName)).id);
    const docToSave = {
      ...data,
      id: id,
      _id: id,
      createdAt: data.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(doc(db, colName, id), docToSave, { merge: true });
    return docToSave;
  },

  // Update a document by ID
  async update(colName, id, updateData) {
    const ref = doc(db, colName, id);
    const existing = await getDoc(ref);
    if (!existing.exists()) {
      return null;
    }
    const dataWithTs = {
      ...updateData,
      updatedAt: serverTimestamp()
    };
    await updateDoc(ref, dataWithTs);
    return { id, _id: id, ...existing.data(), ...dataWithTs };
  },

  // Delete a document by ID
  async delete(colName, id) {
    const ref = doc(db, colName, id);
    const existing = await getDoc(ref);
    if (!existing.exists()) {
      return false;
    }
    await deleteDoc(ref);
    return true;
  }
};

export default FirestoreService;
