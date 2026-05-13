require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const multer = require('multer');

// Firebase Admin initialization
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
  : null;

if (!admin.apps.length && serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "tourism-system-27c5f.firebasestorage.app"
  });
}

const db = admin.apps.length ? admin.firestore() : null;
const bucket = admin.apps.length ? admin.storage().bucket() : null;

const app = express();
app.use(cors());
app.use(express.json());

// Multer setup for Firebase Storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const wrap = (fn) => async (req, res) => {
  try {
    if (!db) throw new Error('Firebase DB not initialized');
    await fn(req, res);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message });
  }
};

app.get('/api/health', (req, res) => res.json({ status: 'ok', firebase: !!db }));

app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file || !bucket) return res.status(400).json({ error: 'Upload not available' });
  try {
    const fileName = `uploads/${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(fileName);
    const stream = file.createWriteStream({
      metadata: { contentType: req.file.mimetype },
      public: true,
      resumable: false
    });
    stream.on('error', () => res.status(500).json({ error: 'Upload failed' }));
    stream.on('finish', () => {
      res.json({ url: `https://storage.googleapis.com/${bucket.name}/${fileName}`, filename: fileName });
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const multer = require('multer');

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
  : null;

if (!admin.apps.length && serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'tourism-system-27c5f.firebasestorage.app'
  });
}

const db = admin.apps.length ? admin.firestore() : null;
const bucket = admin.apps.length ? admin.storage().bucket() : null;

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const wrap = (fn) => async (req, res) => {
  try {
    if (!db) throw new Error('Firebase DB not initialized');
    await fn(req, res);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message });
  }
};

app.get('/api/health', (req, res) => res.json({ status: 'ok', firebase: !!db }));

app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file || !bucket) return res.status(400).json({ error: 'Upload not available' });
  try {
    const fileName = 'uploads/' + Date.now() + '-' + req.file.originalname;
    const file = bucket.file(fileName);
    const stream = file.createWriteStream({
      metadata: { contentType: req.file.mimetype },
      public: true,
      resumable: false
    });
    stream.on('error', () => res.status(500).json({ error: 'Upload failed' }));
    stream.on('finish', () => {
      res.json({ url: 'https://storage.googleapis.com/' + bucket.name + '/' + fileName, filename: fileName });
    });
    stream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/packages', wrap(async (req, res) => {
  const snap = await db.collection('packages').get();
  res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
}));

app.post('/api/packages', wrap(async (req, res) => {
  const ref = await db.collection('packages').add({ ...req.body, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  res.json({ id: ref.id });
}));

app.get('/api/bookings', wrap(async (req, res) => {
  const snap = await db.collection('bookings').get();
  res.json({ bookings: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
}));

app.post('/api/bookings', wrap(async (req, res) => {
  const ref = await db.collection('bookings').add({ ...req.body, status: 0, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  res.json({ id: ref.id });
}));

app.post('/api/login', wrap(async (req, res) => {
  const { email, password } = req.body;
  const snap = await db.collection('users').where('EmailId', '==', email).limit(1).get();
  if (snap.empty || snap.docs[0].data().Password !== password) return res.status(401).json({ error: 'Invalid' });
  const u = snap.docs[0];
  res.json({ token: 'token-' + u.id, user: { UserId: u.id, UserName: u.data().FullName, UserEmail: u.data().EmailId } });
}));

app.post('/api/signup', wrap(async (req, res) => {
  const { FullName, EmailId, Password, MobileNo } = req.body;
  const existing = await db.collection('users').where('EmailId', '==', EmailId).get();
  if (!existing.empty) return res.status(400).json({ error: 'Exists' });
  const ref = await db.collection('users').add({ FullName, EmailId, Password, MobileNo, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  res.json({ id: ref.id });
}));

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(5050, () => console.log('Local port 5050'));
    }
