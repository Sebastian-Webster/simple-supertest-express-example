# Supertest Express example

This repository has 2 examples. One with unit testing for an Express app that uses Mongoose and MongoDB for the database, and another one with unit testing for an Express app that uses Sequelize and MySQL for the database.

To try one of the examples, clone this repository and then change directory into the app you desire to test. Then do ```npm install```, and then ```npm test```.

The Sequelize example uses a SQLite in-memory database for the tests and connects to a MySQL when ran normally

The MongoDB example uses ```mongodb-memory-server``` to spin up an ephemeral mongod instance to connect to when testing. When ran normally, it uses Mongoose to connect to a MongoDB database.
