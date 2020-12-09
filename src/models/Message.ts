import { Schema, Document, model } from 'mongoose';

export interface IMessageDocument extends Document {
  status: string;
  url: string;
  resource: string;
  label: string[];
}

const messageSchema = new Schema(
  {
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['send', 'wait'],
      trim: true,
      lowercase: true,
    },
    group: { type: String },
    userId: { type: Number },
    userName: { type: String },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true, minimize: true },
  },
);

export const MessageModel = model<IMessageDocument>('Message', messageSchema);
