const API = 'http://localhost:8000';

async function getdata() {
  const fetch = (await import('node-fetch')).default; 
  
  try {
    const res = await fetch(API);
    const data = await res.json();
    return data;
  } catch (e) {
    console.log('❌ Error:', e);
    process.exit(1);
  }
}

module.exports = { getdata };