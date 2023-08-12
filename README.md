# mern-social-network

MERN (MongoDB + Express + React + NodeJS) Social Network.

СТЕК ТЕХНОЛОГИЙ:

- MongoDB
- Express
- ReactJS
- NodeJS
- Mongoose
- WebSocket
- Redis
- SpotifyAPI
- socket.io
- bcryptjs
- cors
- jwt
- express-validator
- multer
- axios
- react-router-v6
- config
- concurrently
- nodemon
- framer-motion
- react-content-loader

# To launch frontend:

- ./frontend
- npm install
- npm run client

# To launch backend:

- /
- create a new directory in the root folder -- config, then create file default.json in this folder that should look like this:
  {
  "PORT": "5000",
  "mongourl": "mongodb+srv://username:password@cluster0.3pnrkiv.mongodb.net/", //HERE SHOULD BE YOUR MONGODB CLUSTER LINK
  "jwtsecret": "your jwt secret key"
  }

- npm install
- npm run serve

# To launch frontend and backend together:

- /
- npm run dev
