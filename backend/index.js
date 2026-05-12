require('dotenv').config();
const express = require('express');
const admin   = require('firebase-admin');
const cors    = require('cors');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

// Firebase Initialization - Using environment variables for Vercel
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
  : require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "tourism-system-27c5f.firebastorage.app"
  });
}

const db  = admin.firestore();
const bucket = admin.storage().bucket();
const app = express();

app.use(cors());
app.use(express.json());

// Prevent unhandled Firestore errors from crashing the server
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason?.message || reason);
});

// â- Uploads: Refactored for Firebase Storage (Vercel Support) â-
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  },
});

app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image received.' });
  
  try {
    const fileName = `uploads/${Date.now()}-${req.file.originanname}`;
    const file = bucket.file(fileName);
    
    const stream = file.createWriteStream({
      metadata: { contentType: req.file.mimetype },
      public: true,
      resumable: false
    });

    stream.on('error', (err) => {
      console.error('Upload stream error:', err);
      res.status(500).json({ error: 'Upload failed' });
    });

    stream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      res.json({ url: publicUrl, filename: fileName });
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});


// â- Helper â-
const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error(`[${req.method} ${req.path}]`, err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

// à- SEEDING (Somali Packages) à-
const SOMALI_PACKAGES_SEED = [
  {
    PackageName: "Mogadishu Coastal Discovery",
    PackageLocation: "Banadir, Mogadishu",
    PackagePrice: 350,
    PackageType: "City & Beach",
    PackageDetails: "Explore the historic Lido beach, the old city of Hamar Weyne, and the modern developments in the capital.",
    PackageImage: "https://images.unsplash.com/photo-1594913785162-e67891823cc1?auto=format&fit=crop&w=800&q=80",
    PackageFetures: "Lido Beach, Hamar Weyne, Peace Garden, Security Included"
  },
  {
    PackageName: "Hargeisa Heritage Tour",
    PackageLocation: "Woqooyi Galbeed, Hargeisa",
    PackagePrice: 280,
    PackageType: "Historical",
    PackageDetails: "Visit the famous Laas Geel cave paintings, the Hargeisa War Memorial, and the vibrant livestock market.",
    PackageImage: "https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=800&q=80",
    PackageFetures: "Laas Geel, Livestock Market, War Memorial, Cultural Dinner"
  },
  {
    PackageName: "Kismayo White Sands",
    PackageLocation: "Lower Juba, Kismayo",
    PackagePrice: 400,
    PackageType: "Luxury Resort",
    PackageDetails: "Experience the cleanest beaches in East Africa. Relax at the white sands and enjoy fresh seafood.",
    PackageImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    PackageFetures: "Beach Resort, Boat Tours, Seafood Buffet, Guided City Tour"
  },
  {
    PackageName: "Garowe Governance & Culture",
    PackageLocation: "Nugal, Garowe",
    PackagePrice: 220,
    PackageType: "Cultural",
    PackageDetails: "Learn about the stable governance and rich nomadic culture in the heart of Puntland.",
    PackageImage: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    PackageFetures: "Presidential Palace, Cultural Center, Local Markets"
  },
  {
    PackageName: "Bosaso Commercial Hub",
    PackageLocation: "Bari, Bosaso",
    PackagePrice: 260,
    PackageType: "Business & Sea",
    PackageDetails: "Visit the major port city, enjoy the mountain views of Al-Madow and the warm GULF of Aden.",
    PackageR[age: (ÎËÚ[XYÙ\Ë[Ü\ÚÛÛKÜÝËLMMNLLLLLMØÌXY
LXMOØ]]ÏYÜX]	]XÜÜ	ÏN	ONXÚØYÙQ]\\ÎÜÝ\[SXYÝÈ[Ý[Z[ËÙXYÛÝ[ÈKÂXÚØYÙS[YN\\H[ÚY[ÜXÚØYÙSØØ][ÛØX^[\\HXÚØYÙTXÙNÌXÚØYÙU\N\ÝÜH	][ÈXÚØYÙQ]Z[Î^ÜHHÝÛX[\Ú]XÝ\H[ÛÛYHÙH\Ý][ÈÜÝÈ[HYÙXKXÚØYÙR[XYÙNÎËÚ[XYÙ\Ë[Ü\ÚÛÛKÜÝËLMLLMÎÍÍXNNLÎN
XÏØ]]ÏYÜX]	]XÜÜ	ÏN	ONXÚØYÙQ]\\ÎÛÝÛ][ËY\ÙXH\Ú[ËÜXØÙ\ÜÈKÂXÚØYÙS[YNZYØHÜZ[Ú]HXÚØYÙSØØ][Û^KZYØHXÚØYÙTXÙNNXÚØYÙU\NYÜXÝ[\[XÚØYÙQ]Z[Î^\Y[ÙHHYÜXÝ[\[X\[ÙÛÛX[XH[H[[Ý\È\ÚH]\XÚØYÙR[XYÙNÎËÚ[XYÙ\Ë[Ü\ÚÛÛKÜÝËLM
ÍNLËYY
ÌØØ]]ÏYÜX]	]XÜÜ	ÏN	ONXÚØYÙQ]\\Î\ÚH]\\HÝ\ËY][Û[[ÙHKÂXÚØYÙS[YNÜ[XH[Ý[Z[Y^HXÚØYÙSØØ][Û]Ù[Ü[XHXÚØYÙTXÙNLXÚØYÙU\N]\HXÚØYÙQ]Z[Î[ÞHHÛÛÛ[Ý[Z[Û[X]H[H[[XÝX[][ÜÜ\HÙHÚ]HÙYXØ][ÛXÚØYÙTØYÙN
&GG3¢òöÖvW2çVç7Æ6æ6öÒ÷÷FòÓCcC##sS#2ÖfVCc#&fc&36#öWFóÖf÷&ÖBffCÖ7&÷gsÓgÓ"À¢6¶vTfWGW&W3¢$Ö÷VBVæfW'6GÂÖ÷VçFâ¶ærÂ6ööÂ6ÆÖFR ¢ÒÀ¢°¢6¶vTæÖS¢$&VÆVGvWæR&fW"F÷W""À¢6¶vTÆö6Föã¢$&âÂ&VÆVGvWæR"À¢6¶vU&6S¢À¢6¶vUGS¢%&fW"6f&"À¢6¶vTFWFÇ3¢%6VRFRÖ¦W7F26&VÆÆR&fW"æBFR'&FvW2FB6öææV7BFR6Gâ"À¢6¶vU%¶vS¢¡ÑÑÁÌè¼½¥µÌ¹Õ¹ÍÁ±Í ¹½´½Á¡½Ñ¼´ÄÐÌÜÜÄäÐÄÜÀÌÈ´àÔäÕååØýÕÑ¼õ½ÉµÐ¥ÐõÉ½ÀÜôàÀÀÄôàÀ°(A­ÑÕÉÌèI¥ÙÈ	½Ð°	É¥Q½ÕÉÌ°1½°
Õ¥Í¥¹(ô°(ì(A­9µè±­å¼QÝ¥¸
¥Ñä°(A­1½Ñ¥½¸è5ÕÕ°±­å¼°(A­AÉ¥èÈÀÀ°(A­QåÁèU¹¥ÑäQ½ÕÈ°(A­Ñ¥±ÌèáÁÉ¥¹Ñ¡Õ¹¥ÅÕ¥ÑäÑ¡ÐÉ¥ÌÑÝ¼ÍÑÑÌ°Íåµ½°½½µµÉ¹Á¸°(A­Imè¢https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
    PackageFetures: "Commercial Hub, Airport Tour, Peace Center"
  },
  {
    PackageName: "Jowhar Royal Farms",
    PackageLocation: "Middle Shabelle, Jowhar",
    PackagePrice: 170,
    PackageType: "Agro-Tourism",
    PackageDetails: "Visit the former capital and the lush green plantations that feed the nation.",
    PackageImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    PackageFetures: "Farm Tours, Sugar Factory Ruins, River Side"
  },
  {
    PackageName: "Dhusamareb Peace Garden",
const express = require('express');
const admin   = require('firebase-admin');
const cors    = require('cors');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
  : require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "tourism-system-27c5f.firebasestorage.app"
  });
}

const db  = admin.firestore();
const bucket = admin.storage().bucket();
const app = express();

app.use(cors());
app.use(express.json());

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason?.message || reason);
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image received.' });
  try {
    const fileName = `uploads/${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(fileName);
    const stream = file.createWriteStream({
      metadata: { contentType: req.file.mimetype },
      public: true,
      resumable: false
    });
    stream.on('error', (err) => {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Upload failed' });
    });
    stream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      res.json({ url: publicUrl, filename: fileName });
    });
    stream.end(req.file.buffer);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

const wrap = (fn) => async (req, res) => {
  try { await fn(req, res); } 
  catch (err) { console.error(`[${req.method} ${req.path}]`, err.message); res.status(500).json({ error: 'Server error' }); }
};

app.get('/api/packages', wrap(async (req, res) => {
  const snapshot = await db.collection('packages').get();
  res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), PackageId: doc.id })));
}));

app.post('/api/packages', wrap(async (req, res) => {
  const docRef = await db.collection('packages').add({ ...req.body, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  res.json({ id: docRef.id });
}));

app.get('/api/packages/:id', wrap(async (req, res) => {
  const doc = await db.collection('packages').doc(req.params.id).get();
  res.json({ package: { id: doc.id, ...doc.data() } });
}));

app.put('/api/packages/:id', wrap(async (req, res) => {
  await db.collection('packages').doc(req.params.id).update(req.body);
  res.json({ message: 'Updated' });
}));

app.delete('/api/packages/:id', wrap(async (req, res) => {
  await db.collection('packages').doc(req.params.id).delete();
  res.json({ message: 'Deleted' });
}));

app.post('/api/bookings', wrap(async (req, res) => {
  const data = { ...req.body, status: 0, createdAt: admin.firestore.FieldValue.serverTimestamp() };
  const docRef = await db.collection('bookings').add(data);
  res.json({ id: docRef.id });
}));

app.get('/api/bookings', wrap(async (req, res) => {
  const snapshot = await db.collection('bookings').get();
  res.json({ bookings: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
}));

app.get('/api/bookings/user/:email', wrap(async (req, res) => {
  const email = req.params.email;
  const snap = await db.collection('bookings').where('UserEmail', '==', email).get();
  res.json({ bookings: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
}));

app.put('/api/bookings/:id/confirm', wrap(async (req, res) => {
  await db.collection('bookings').doc(req.params.id).update({ status: 1 });
  res.json({ message: 'Confirmed' });
}));

app.put('/api/bookings/:id/cancel', wrap(async (req, res) => {
  await db.collection('bookings').doc(req.params.id).update({ status: 2 });
  res.json({ message: 'Cancelled' });
}));

app.delete('/api/bookings/:id', wrap(async (req, res) => {
  await db.collection('bookings').doc(req.params.id).delete();
  res.json({ message: 'Deleted' });
}));

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === (process.env.ADMIN_USERNAME || 'admin') && password === (process.env.ADMIN_PASSWORD || 'Test@123')) {
    return res.json({ token: 'admin-token', admin: { email } });
  }
  res.status(401).json({ error: 'Invalid' });
});

app.post('/api/login', wrap(async (req, res) => {
  const { email, password } = req.body;
  const snap = await db.collection('users').where('EmailId', '==', email).limit(1).get();
  if (snap.empty || snap.docs[0].data().Password !== password) return res.status(401).json({ error: 'Invalid' });
  const user = snap.docs[0];
  res.json({ token: `token-${user.id}`, user: { UserId: user.id, UserName: user.data().FullName, UserEmail: user.data().EmailId } });
}));

app.post('/api/register', wrap(async (req, res) => {
  const { name, email, password } = req.body;
  const docRef = await db.collection('users').add({ FullName: name, EmailId: email, Password: password, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  res.json({ message: 'Success', user: { UserId: docRef.id, UserName: name, UserEmail: email } });
}));

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => console.log(`✅ Local port ${PORT}`));
                   }
