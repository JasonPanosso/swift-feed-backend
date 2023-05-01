import mongoose from 'mongoose';

export const setupDb = async (): Promise<void> => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/swift-feed';
  await mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error.message);
      throw new Error(`Could not connect to database, error: ${error.message}`)
    });
};
