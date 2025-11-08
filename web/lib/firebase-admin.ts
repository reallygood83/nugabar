// Lightweight compatibility shim to mimic firebase-admin Firestore chain API
// using the v9 modular client SDK. This is sufficient for our API routes
// that use patterns like db.collection(...).doc(...).collection(...).orderBy(...).get()

import { db as clientDb } from './firebase';
import {
  collection as col,
  doc as docFn,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query as queryFn,
  orderBy as orderByFn,
  Firestore,
  Query,
  CollectionReference,
  DocumentReference,
  QuerySnapshot,
  DocumentSnapshot,
} from 'firebase/firestore';

class QuerySnapshotAdapter {
  private snap: QuerySnapshot;
  constructor(snap: QuerySnapshot) {
    this.snap = snap;
  }
  get size() {
    return this.snap.size;
  }
  get docs() {
    return this.snap.docs.map((d) => ({ id: d.id, data: () => d.data() }));
  }
}

class DocumentSnapshotAdapter {
  private snap: DocumentSnapshot;
  constructor(snap: DocumentSnapshot) {
    this.snap = snap;
  }
  get exists() {
    return this.snap.exists();
  }
  data() {
    return this.snap.data();
  }
}

class QueryAdapter {
  private q: Query;
  constructor(q: Query) {
    this.q = q;
  }
  orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
    this.q = queryFn(this.q, orderByFn(field, direction));
    return this;
  }
  async get() {
    const snap = await getDocs(this.q);
    return new QuerySnapshotAdapter(snap);
  }
}

class DocumentAdapter {
  private ref: DocumentReference;
  constructor(ref: DocumentReference) {
    this.ref = ref;
  }
  async get() {
    const snap = await getDoc(this.ref);
    return new DocumentSnapshotAdapter(snap);
  }
  async update(data: Record<string, any>) {
    await updateDoc(this.ref, data);
  }
  collection(name: string) {
    return new CollectionAdapter(col(this.ref, name));
  }
}

class CollectionAdapter {
  private ref: CollectionReference;
  constructor(ref: CollectionReference) {
    this.ref = ref;
  }
  doc(id: string) {
    return new DocumentAdapter(docFn(this.ref, id));
  }
  async add(data: Record<string, any>) {
    const newRef = await addDoc(this.ref, data);
    return newRef; // Has .id property, compatible with usage
  }
  orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
    return new QueryAdapter(queryFn(this.ref, orderByFn(field, direction)));
  }
  async get() {
    const snap = await getDocs(this.ref);
    return new QuerySnapshotAdapter(snap);
  }
}

// Export an object with a firebase-admin-like surface
export const db = {
  collection(name: string) {
    return new CollectionAdapter(col(clientDb as Firestore, name));
  },
};