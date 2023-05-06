import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface UserDocument extends Document {
  email: string;
  password: string;
  role: string;
}

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' }
});

UserSchema.pre('save', async function (next) { 
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
})

export const UserModel = model<UserDocument>('User', UserSchema);
