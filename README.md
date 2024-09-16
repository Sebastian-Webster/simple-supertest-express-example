# Supertest Express example

This repository has 3 examples.
- Tests for an Express app with Mongoose and MongoDB as the database
- Tests for an Express app with Sequelize and MySQL as the database
- Tests for an Express app with mysql2 and MySQL as the database

To try one of the examples, clone this repository and then change directory into the app you desire to test. Then do ```npm install```, and then ```npm test```.

The MongoDB example uses ```mongodb-memory-server``` to spin up an ephemeral mongod instance to connect to when testing. When ran normally, it uses Mongoose to connect to a MongoDB database.

The Sequelize and mysql2 examples use ```mysql-memory-server``` to spin up an ephemeral mysqld instance to connect to when testing. When ran normally, they use Sequelize and mysql2 respectively to connect to a MySQL database.
