import { Schema, model, Document } from 'mongoose';

interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = model<UserDocument>('User', UserSchema);

export default User;