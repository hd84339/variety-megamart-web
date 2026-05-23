const axios = require('axios');
const base = 'https://project.varietymegastore.com/api';
const paths = [
  '/reviews/53',
  '/getReviews?productId=53',
  '/getProductReviews?productId=53',
  '/review/53',
  '/reviews',
  '/review',
  '/getReview?productId=53',
  '/api/reviews/53',
  '/api/getReviews?productId=53',
  '/getProduct?productId=53',
];
(async () => {
  for (const path of paths) {
    const url = base + path;
    try {
      const res = await axios.get(url, { timeout: 10000 });
      console.log(path, res.status, JSON.stringify(res.data).slice(0, 300));
    } catch (err) {
      const status = err.response?.status || err.code || 'ERR';
      console.log(path, status);
    }
  }
})();
