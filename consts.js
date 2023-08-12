const isProduction = process.env.MODE === "production" ? true : false;

const backend_url = isProduction
  ? process.env.BACKEND_URL
  : "http://localhost:5000";
const frontend_url = isProduction
  ? process.env.FRONTEND_URL
  : "http://localhost:3000";

module.exports = backend_url;
module.exports = frontend_url;
