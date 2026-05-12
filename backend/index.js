require('dotenv').config();
const express = require('express');
const admin   = require('firebase-admin');
const cors    = require('cors');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "tourism-system-27c5f.appspot.com"
});

const db  = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());

// Prevent unhandled Firestore errors from crashing the server
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason?.message || reason);
});

// ─── Uploads: static serving + multer ────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename:    (req, file, cb) => {
    const uid = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, uid + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  },
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image received.' });
  const url = `http://localhost:5050/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});


// ─── Helper ───────────────────────────────────────────────────────────────────
// ─── SEEDING (Somali Packages) ────────────────────────────────────────────────
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
    PackageImage: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=800&q=80",
    PackageFetures: "Port Tour, Al-Madow Mountains, Seafront Hotels"
  },
  {
    PackageName: "Berbera Ancient Port",
    PackageLocation: "Saaxil, Berbera",
    PackagePrice: 320,
    PackageType: "History & Diving",
    PackageDetails: "Explore the Ottoman architecture and some of the best diving spots in the Red Sea.",
    PackageImage: "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80",
    PackageFetures: "Old Town, Diving, Deep Sea Fishing, Port Access"
  },
  {
    PackageName: "Baidoa Grain City",
    PackageLocation: "Bay, Baidoa",
    PackagePrice: 180,
    PackageType: "Agricultural",
    PackageDetails: "Experience the agricultural heartland of Somalia and the famous Isha River.",
    PackageImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    PackageFetures: "Isha River, Farm Tours, Traditional Dance"
  },
  {
    PackageName: "Borama Mountain Breeze",
    PackageLocation: "Awdal, Borama",
    PackagePrice: 210,
    PackageType: "Nature",
    PackageDetails: "Enjoy the cool mountain climate and the intellectual atmosphere of the city of education.",
    PackageImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    PackageFetures: "Amoud University, Mountain Hiking, Cool Climate"
  },
  {
    PackageName: "Beledweyne River Tour",
    PackageLocation: "Hiran, Beledweyne",
    PackagePrice: 190,
    PackageType: "River Safari",
    PackageDetails: "See the majestic Shabelle River and the bridges that connect the city.",
    PackageImage: "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?auto=format&fit=crop&w=800&q=80",
    PackageFetures: "River Boat, Bridge Tours, Local Cuisine"
  },
  {
    PackageName: "Galkacyo Twin City",
    PackageLocation: "Mudug, Galkacyo",
    PackagePrice: 200,
    PackageType: "Unity Tour",
    PackageDetails: "Experience the unique city that bridges two states, a symbol of commerce and peace.",
    PackageImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
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
    PackageLocation: "Galguduud, Dhusamareb",
    PackagePrice: 160,
    PackageType: "Peace & Politics",
    PackageDetails: "Visit the heart of Galmudug and see where history is being made.",
    PackageImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
    PackageFetures: "Regional HQ, Community Markets, Cultural Talks"
  }
];

const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error(`[${req.method} ${req.path}]`, err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

// ─── SEEDING ──────────────────────────────────────────────────────────────────
app.get('/api/admin/seed', wrap(async (req, res) => {
  console.log('--- Starting Somalia Seeding ---');
  const snapshot = await db.collection('packages').get();
  const batch = db.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  console.log('Deleted old packages.');
  for (const pkg of SOMALI_PACKAGES_SEED) {
    await db.collection('packages').add({
      ...pkg,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
  console.log('Seeding complete.');
  res.json({ message: 'Database successfully updated with Somali packages!' });
}));

// ─── PACKAGES ─────────────────────────────────────────────────────────────────
app.get('/api/packages', wrap(async (req, res) => {
  const snapshot = await db.collection('packages').get();
  const packages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), PackageId: doc.id }));
  res.json(packages);
}));

app.post('/api/packages', wrap(async (req, res) => {
  const docRef = await db.collection('packages').add({
    ...req.body,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  res.json({ id: docRef.id, message: 'Package created' });
}));

app.get('/api/packages/:id', wrap(async (req, res) => {
  const doc = await db.collection('packages').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Package not found' });
  res.json({ package: { id: doc.id, ...doc.data() } });
}));

app.put('/api/packages/:id', wrap(async (req, res) => {
  await db.collection('packages').doc(req.params.id).update(req.body);
  res.json({ message: 'Package updated' });
}));

app.delete('/api/packages/:id', wrap(async (req, res) => {
  await db.collection('packages').doc(req.params.id).delete();
  res.json({ message: 'Package deleted' });
}));

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────
app.post('/api/bookings', wrap(async (req, res) => {
  const data = { 
    ...req.body, 
    // Ensure UserEmail is capitalized for consistent filtering
    UserEmail: req.body.UserEmail || req.body.userEmail || req.body.email,
    status: 0, 
    createdAt: admin.firestore.FieldValue.serverTimestamp() 
  };
  const docRef = await db.collection('bookings').add(data);
  res.json({ id: docRef.id, message: 'Booking created' });
}));

// Helper to normalize booking data
const normalizeBooking = (doc) => {
  const d = doc.data();
  return {
    id:              doc.id,
    BookingId:       doc.id,
    UserEmail:       d.UserEmail    || d.userEmail    || d.email       || '—',
    UserName:        d.UserName     || d.userName     || d.name        || '—',
    PackageName:     d.PackageName  || d.packageName  || d.package     || '—',
    PackageLocation: d.PackageLocation || d.packageLocation            || '—',
    PackagePrice:    d.PackagePrice || d.packagePrice || 0,
    PackageType:     d.PackageType  || d.packageType  || '—',
    FromDate:        d.FromDate     || d.fromdate     || d.from        || '—',
    ToDate:          d.ToDate       || d.todate       || d.to          || '—',
    Comment:         d.Comment      || d.comment      || '',
    status:          d.status !== undefined ? Number(d.status) : 0,
    packageId:       d.packageId    || '',
    createdAt:       d.createdAt    || null,
  };
};

app.get('/api/bookings', wrap(async (req, res) => {
  const snapshot = await db.collection('bookings').get();
  const bookings = snapshot.docs.map(normalizeBooking);
  res.json({ bookings });
}));

app.get('/api/bookings/user/:email', wrap(async (req, res) => {
  const email = req.params.email;
  // Try both capitalized and lowercase field names for older data compatibility
  const snapshot1 = await db.collection('bookings').where('UserEmail', '==', email).get();
  const snapshot2 = await db.collection('bookings').where('userEmail', '==', email).get();
  const snapshot3 = await db.collection('bookings').where('email', '==', email).get();
  
  // Combine unique results
  const seen = new Set();
  const bookings = [];
  [snapshot1, snapshot2, snapshot3].forEach(snap => {
    snap.docs.forEach(doc => {
      if (!seen.has(doc.id)) {
        seen.add(doc.id);
        bookings.push(normalizeBooking(doc));
      }
    });
  });
  
  res.json({ bookings });
}));

app.put('/api/bookings/:id/confirm', wrap(async (req, res) => {
  await db.collection('bookings').doc(req.params.id).update({ status: 1 });
  res.json({ message: 'Booking confirmed' });
}));

app.put('/api/bookings/:id/cancel', wrap(async (req, res) => {
  await db.collection('bookings').doc(req.params.id).update({ status: 2 });
  res.json({ message: 'Booking cancelled' });
}));

app.put('/api/bookings/:id', wrap(async (req, res) => {
  await db.collection('bookings').doc(req.params.id).update(req.body);
  res.json({ message: 'Booking updated' });
}));

app.delete('/api/bookings/:id', wrap(async (req, res) => {
  await db.collection('bookings').doc(req.params.id).delete();
  res.json({ message: 'Booking deleted' });
}));

// ─── USER DASHBOARD ───────────────────────────────────────────────────────────
app.get('/api/user/dashboard/:email', wrap(async (req, res) => {
  const email = req.params.email;

  // Fetch everything in parallel
  const [bookingsSnap, enquiriesSnap, issuesSnap] = await Promise.all([
    db.collection('bookings').where('UserEmail', '==', email).get(),
    db.collection('enquiries').where('UserEmail', '==', email).get(),
    db.collection('issues').where('UserEmail', '==', email).get()
  ]);

  const bData = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'booking' }));
  const eData = enquiriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'enquiry' }));
  const iData = issuesSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'issue' }));

  // Aggregate stats
  const stats = {
    totalBookings:     bData.length,
    confirmedBookings: bData.filter(b => b.status == 1).length,
    pendingBookings:   bData.filter(b => b.status == 0).length,
    totalEnquiries:    eData.length,
    totalIssues:       iData.length,
    openIssues:        iData.filter(i => i.status == 0).length,
  };

  // Combine and sort recent activity
  const allActivity = [...bData, ...eData, ...iData]
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
    .slice(0, 5);

  res.json({ stats, recentActivity: allActivity });
}));

// ─── ENQUIRIES ────────────────────────────────────────────────────────────────
app.get('/api/enquiries', wrap(async (req, res) => {
  const snapshot = await db.collection('enquiries').get();
  const enquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json({ enquiries });
}));

app.post('/api/enquiry', wrap(async (req, res) => {
  await db.collection('enquiries').add({
    ...req.body,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  res.json({ message: 'Enquiry sent' });
}));

app.delete('/api/enquiries/:id', wrap(async (req, res) => {
  await db.collection('enquiries').doc(req.params.id).delete();
  res.json({ message: 'Enquiry deleted' });
}));

app.put('/api/enquiries/:id/reply', wrap(async (req, res) => {
  const { reply } = req.body;
  await db.collection('enquiries').doc(req.params.id).update({
    AdminReply: reply,
    status: 'resolved',
    repliedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  res.json({ message: 'Reply sent and enquiry resolved' });
}));

app.put('/api/enquiries/:id', wrap(async (req, res) => {
  await db.collection('enquiries').doc(req.params.id).update(req.body);
  res.json({ message: 'Enquiry updated' });
}));

// ─── SUPPORT ISSUES ───────────────────────────────────────────────────────────
app.get('/api/issues', wrap(async (req, res) => {
  const snapshot = await db.collection('issues').get();
  const issues = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json({ issues });
}));

app.post('/api/issues', wrap(async (req, res) => {
  await db.collection('issues').add({
    ...req.body,
    Status: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  res.json({ message: 'Issue created' });
}));

app.put('/api/issues/:id', wrap(async (req, res) => {
  const { status, remarks } = req.body;
  await db.collection('issues').doc(req.params.id).update({
    Status: status,
    AdminRemarks: remarks,
  });
  res.json({ message: 'Issue updated' });
}));

app.delete('/api/issues/:id', wrap(async (req, res) => {
  await db.collection('issues').doc(req.params.id).delete();
  res.json({ message: 'Issue deleted' });
}));

// ─── USERS ────────────────────────────────────────────────────────────────────
app.get('/api/users', wrap(async (req, res) => {
  const snapshot = await db.collection('users').get();
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json({ users });
}));

app.delete('/api/users/:id', wrap(async (req, res) => {
  await db.collection('users').doc(req.params.id).delete();
  res.json({ message: 'User deleted' });
}));

// ─── PROFILE ──────────────────────────────────────────────────────────────────
app.get('/api/profile/:email', wrap(async (req, res) => {
  const snapshot = await db.collection('users')
    .where('EmailId', '==', req.params.email)
    .limit(1)
    .get();
  if (snapshot.empty) return res.status(404).json({ error: 'User not found' });
  const doc = snapshot.docs[0];
  res.json({ user: { id: doc.id, ...doc.data() } });
}));

app.put('/api/profile/:email', wrap(async (req, res) => {
  const snapshot = await db.collection('users')
    .where('EmailId', '==', req.params.email)
    .limit(1)
    .get();
  if (snapshot.empty) return res.status(404).json({ error: 'User not found' });
  await snapshot.docs[0].ref.update(req.body);
  res.json({ message: 'Profile updated' });
}));

app.put('/api/change-password', wrap(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  const snapshot = await db.collection('users')
    .where('EmailId', '==', email)
    .limit(1)
    .get();
  if (snapshot.empty) return res.status(404).json({ error: 'User not found' });
  const userData = snapshot.docs[0].data();
  if (userData.Password !== oldPassword) return res.status(401).json({ error: 'Old password is incorrect' });
  await snapshot.docs[0].ref.update({ Password: newPassword });
  res.json({ message: 'Password updated successfully' });
}));

// ─── ADMIN AUTH ───────────────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { email, username, password } = req.body;
  const loginEmail = (email || username || '').trim();
  const loginPass  = (password || '').trim();

  const ADMIN_USER = (process.env.ADMIN_USERNAME || 'admin').trim();
  const ADMIN_PASS = (process.env.ADMIN_PASSWORD || 'Test@123').trim();

  if (!loginEmail || !loginPass) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (loginEmail === ADMIN_USER && loginPass === ADMIN_PASS) {
    return res.json({
      token: 'admin-token',
      admin: {
        id: 1,
        name: 'Admin',
        email: loginEmail,
        AdminUsername: loginEmail,
      },
    });
  }

  return res.status(401).json({ error: 'Invalid admin credentials.' });
});

app.put('/api/admin/change-password', (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (oldPassword !== 'Test@123') return res.status(401).json({ error: 'Old password is incorrect.' });
  // In production store the new password in Firestore admin collection
  res.json({ message: 'Admin password updated.' });
});

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
app.get('/api/admin/dashboard', wrap(async (req, res) => {
  const [u, p, b, e, i] = await Promise.all([
    db.collection('users').get(),
    db.collection('packages').get(),
    db.collection('bookings').get(),
    db.collection('enquiries').get(),
    db.collection('issues').get(),
  ]);

  const bookingDocs      = b.docs.map(doc => doc.data());
  const pendingBookings   = bookingDocs.filter(d => String(d.status) === '0').length;
  const confirmedBookings = bookingDocs.filter(d => String(d.status) === '1').length;
  const cancelledBookings = bookingDocs.filter(d => String(d.status) === '2').length;

  const issueDocs      = i.docs.map(doc => doc.data());
  const openIssues     = issueDocs.filter(d => String(d.Status) === '0').length;
  const resolvedIssues = issueDocs.filter(d => String(d.Status) === '1').length;

  res.json({
    users: u.size,
    packages: p.size,
    bookings: b.size,
    pendingBookings,
    confirmedBookings,
    cancelledBookings,
    enquiries: e.size,
    issues: i.size,
    openIssues,
    resolvedIssues,
  });
}));

// ─── USER LOGIN ───────────────────────────────────────────────────────────────
app.post('/api/login', wrap(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  const snapshot = await db.collection('users')
    .where('EmailId', '==', email)
    .limit(1)
    .get();

  if (snapshot.empty) return res.status(401).json({ error: 'No account found with this email.' });

  const userDoc  = snapshot.docs[0];
  const userData = userDoc.data();

  if (userData.Password !== password) return res.status(401).json({ error: 'Incorrect password.' });

  res.json({
    token: `token-${userDoc.id}`,
    user: {
      UserId:     userDoc.id,
      UserName:   userData.FullName,
      UserEmail:  userData.EmailId,
      UserMobile: userData.MobileNumber,
    },
  });
}));

// ─── USER REGISTER ────────────────────────────────────────────────────────────
app.post('/api/register', wrap(async (req, res) => {
  const { name, email, mobile, password } = req.body;
  if (!name || !email || !mobile || !password) return res.status(400).json({ error: 'All fields are required.' });

  const existing = await db.collection('users')
    .where('EmailId', '==', email)
    .limit(1)
    .get();

  if (!existing.empty) return res.status(409).json({ error: 'An account with this email already exists.' });

  const docRef = await db.collection('users').add({
    FullName:     name,
    EmailId:      email,
    MobileNumber: mobile,
    Password:     password,
    createdAt:    admin.firestore.FieldValue.serverTimestamp(),
  });

  res.json({
    message: 'Account created successfully.',
    user: { UserId: docRef.id, UserName: name, UserEmail: email },
  });
}));

// ─── START ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
