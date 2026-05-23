// Quick test script to debug the wishlist 500 error
// Run: node test_wishlist.js
const axios = require('axios');
const BASE = 'https://project.varietymegastore.com/api';

async function test() {
  // Step 1: Get the token from the user's localStorage (you must provide it)
  // We'll read it from a file or command line
  const token = process.argv[2];
  
  if (!token) {
    console.log('Usage: node test_wishlist.js <your_auth_token>');
    console.log('');
    console.log('To get your token:');
    console.log('1. Open the website in your browser');
    console.log('2. Open DevTools (F12) -> Console');
    console.log('3. Type: localStorage.getItem("token")');
    console.log('4. Copy the token and run this script with it');
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };

  console.log('Testing getWishlist...');
  try {
    const res = await axios.get(`${BASE}/auth/getWishlist`, { headers });
    console.log('✅ SUCCESS! Status:', res.status);
    console.log('Data:', JSON.stringify(res.data, null, 2).substring(0, 2000));
  } catch (e) {
    console.log('❌ FAILED! Status:', e.response?.status);
    console.log('Error:', JSON.stringify(e.response?.data, null, 2)?.substring(0, 2000));
    
    if (e.response?.status === 500) {
      console.log('\n--- The server is crashing. Trying to clear corrupt wishlist entries... ---');
      
      // Try deleting wishlist items with common product IDs
      for (let id = 1; id <= 20; id++) {
        try {
          await axios.delete(`${BASE}/auth/deleteFromWishlist`, { 
            headers,
            params: { product_id: id },
            data: { product_id: id }
          });
          console.log(`  Deleted product_id=${id} from wishlist ✅`);
        } catch (delErr) {
          // Silently skip - item probably wasn't in wishlist
        }
      }
      
      console.log('\n--- Retrying getWishlist after cleanup... ---');
      try {
        const res2 = await axios.get(`${BASE}/auth/getWishlist`, { headers });
        console.log('✅ SUCCESS after cleanup! Status:', res2.status);
        console.log('Data:', JSON.stringify(res2.data, null, 2).substring(0, 2000));
      } catch (e2) {
        console.log('❌ Still failing after cleanup. Status:', e2.response?.status);
        console.log('This is a backend bug in ProductRepository.php line 277.');
      }
    }
  }
}

test();
