require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const SOMALI_PACKAGES = [
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

async function seed() {
  console.log('--- Starting Somalia Seeding ---');
  
  // 1. Delete all existing packages
  const snapshot = await db.collection('packages').get();
  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  console.log('Deleted existing packages.');

  // 2. Add Somali packages
  for (const pkg of SOMALI_PACKAGES) {
    await db.collection('packages').add({
      ...pkg,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`Added: ${pkg.PackageName}`);
  }

  console.log('--- Seeding Complete ---');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
