import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

mongoose.Promise = global.Promise;

const MONGODB_USER: string = process.env.MONGODB_USER;
const MONGODB_PASS: string = process.env.MONGODB_PASS;
const MONGODB_HOST: string = process.env.MONGODB_HOST;
const MONGODB_DB: string = process.env.MONGODB_DB;
const CONNECTION_STRING: string = MONGODB_HOST + '/' + MONGODB_DB;

console.log({ MONGODB_USER, MONGODB_PASS, MONGODB_HOST, MONGODB_DB, CONNECTION_STRING });

export const connect = (url: string = CONNECTION_STRING) => {
  mongoose
    .connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      user: MONGODB_USER,
      pass: MONGODB_PASS,
      authSource: 'admin',
    })
    .then(() => {
      console.log('CONNNECTED');
    })
    .catch((err) => {
      console.error(err);
      // process.exit(1);
    });
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);
  // mongoose.set('debug', true);

  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
  mongoose.connection.once('open', () =>
    console.log(`Connected to MongoDB
    URI: ${url}`),
  );
  mongoose.connection.on('disconnected', () => console.log('Disconnected from MongoDB'));

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose disconnected through app termination');
    });
  });

  return mongoose.connection;
};
