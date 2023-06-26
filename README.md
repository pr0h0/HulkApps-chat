## Application Live URL

[LIVE URL](https://chat.pr0h0.me/)

## How to run the application

1. Clone the repository
2. Do `npm install` to install in bakcend folder
3. Do `npm install` to install in frontend folder
4. Check .env file in frontend folder and set up backend url
5. Do `npm run copy` to copy the build folder from frontend to backend
6. Set up database credentials in backend/config/config.json file
7. Check .env file in backend folder and set up the required values
8. run `npm run db:create` to create database (if environment is diferent from development, then run `NODE_ENV=environmentName npm run db:create`)
9. run `npm run db:migrate` to run migrations (if environment is diferent from development, then run `NODE_ENV=environmentName npm run db:migrate`)
10. Do `npm start` to run the application

## Describe the design and architecture of your solution.

1.  The application is built using stack described in requirements
    - Node.js
    - Express.js
    - React.js
    - Postgres
    - Socket.io
    - Redis
2.  Application frontend is built using React.js
3.  Application backend is built using Node.js, Express.js and socket.io
4.  Persistent data is stored in Postgres
5.  Online users are stored in Redis
6.  Sequelize ORM is used for database and model management
7.  JWT is used for authentication
8.  Socket.io is used for real time chat

## If applicable, explain your reasoning behind any decisions you made while completing the challenge

1.  I have used React.js for frontend because it is fast and easy to build single page applications
2.  I have used Node.js for backend because it is fast and easy to build applications
3.  I have used Postgres for database because it is relational database but offers better performance than MySQL
4.  I have used socket.io for real time chat because it is easy to setup and use
5.  I have used Redis for storing online users because it offers easy and fast way to store data in memory
6.  I have used Sequelize ORM because it makes it easy to manage models and database
7.  I have used JWT for authentication for authentication because it can be used for both web and mobile applications

## Tests

1.  I have written unit tests for backend using mocha and chai
2.  Tests cover api endpoints for login, register and jwt check
3.  To run tests set up database configuration in backend/config/config.json file
4.  Run `npm run db:test` to create database for test environment
5.  Run `npm run test` to run tests
6.  Run `npm run db:test:down` to drop database for test environment


## Features implemented

1. User registration
2. User login
3. User authentication using JWT
4. Real time chat
5. See online users in chat room
6. Join / Leave group chat
8. Send private messages
9. Rate limit on send message functionality (10 messages per minute)
10. Unit tests for backend API endpoints
11. Persistent data storage in Postgres database
12. Online users storage in Redis

## Features not implemented
1. Dockerization
2. Message status (seen, delivered, sent)

