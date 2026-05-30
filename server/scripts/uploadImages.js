require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const shoes = [
  { name: "nike-air-max-270", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600" },
  { name: "nike-air-force-1", url: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600" },
  { name: "adidas-ultraboost", url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600" },
  { name: "adidas-stan-smith", url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600" },
  { name: "puma-rsx", url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600" },
  { name: "puma-softride", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600" },
  { name: "reebok-classic", url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600" },
  { name: "skechers-dlites", url: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600" },
  { name: "woodland-hiking", url: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600" },
  { name: "nike-revolution-6", url: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600" },
  { name: "adidas-duramo-kids", url: "https://images.unsplash.com/photo-1555274175-6cbf6f3b137b?w=600" },
  { name: "nike-court-vision", url: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600" },
  { name: "skechers-gowalk", url: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600" },
  { name: "woodland-derby", url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600" },
  { name: "puma-mirage-sport", url: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600" },
];

async function uploadAll() {
  const results = {};

  for (const shoe of shoes) {
    try {
      const res = await cloudinary.uploader.upload(shoe.url, {
        folder: "shoemart/products",
        public_id: shoe.name,
        overwrite: true,
      });
      results[shoe.name] = res.secure_url;
      console.log(`✅ ${shoe.name}: ${res.secure_url}`);
    } catch (error) {
      console.error(`❌ ${shoe.name}: ${error.message}`);
    }
  }

  console.log("\n📋 Copy these URLs into seed.js:\n");
  console.log(JSON.stringify(results, null, 2));
}

uploadAll();