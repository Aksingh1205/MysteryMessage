import mongoose, { Schema, Model, Document } from 'mongoose';
import { dbConnect } from '@/lib/dbConnect';

// Message Interface
export interface IMessage extends Document {
  content: string;
  createdAt: Date;
}

// Message Schema
const MessageSchema: Schema<IMessage> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// User Interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date; 
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: IMessage[];
}

// User Schema
const UserSchema: Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  verifyCode: {
    type: String,
    required: [true, 'Verify Code is required'],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, 'Verify Code Expiry is required'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

// Ensure connection and get model
const getModel = async (): Promise<Model<IUser>> => {
  await dbConnect();
  return mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
};

// Initialize model promise
const modelPromise = getModel();

// Create a class that mimics the Mongoose model behavior
class UserModelClass {
  private static model: Model<IUser>;

  constructor(data: any) {
    // Return a promise that resolves to a new document
    return (async () => {
      const Model = await modelPromise;
      return new Model(data);
    })();
  }

  // Static methods
  static async find(conditions: any) {
    const Model = await modelPromise;
    return Model.find(conditions);
  }

  static async findOne(conditions: any) {
    const Model = await modelPromise;
    return Model.findOne(conditions);
  }

  static async findById(id: any) {
    const Model = await modelPromise;
    return Model.findById(id);
  }

  static async create(data: any) {
    const Model = await modelPromise;
    return Model.create(data);
  }

  static async updateOne(conditions: any, update: any) {
    const Model = await modelPromise;
    return Model.updateOne(conditions, update);
  }

  static async updateMany(conditions: any, update: any) {
    const Model = await modelPromise;
    return Model.updateMany(conditions, update);
  }

  static async deleteOne(conditions: any) {
    const Model = await modelPromise;
    return Model.deleteOne(conditions);
  }

  static async deleteMany(conditions: any) {
    const Model = await modelPromise;
    return Model.deleteMany(conditions);
  }

  static async exists(conditions: any) {
    const Model = await modelPromise;
    return Model.exists(conditions);
  }

  static async countDocuments(conditions: any) {
    const Model = await modelPromise;
    return Model.countDocuments(conditions);
  }
}

// Cast to any to avoid TypeScript errors
const UserModel = UserModelClass as any as Model<IUser>;

export default UserModel;