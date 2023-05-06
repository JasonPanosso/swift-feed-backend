import { Schema, model, Document } from 'mongoose';

export interface FormattedDataFeedDocument extends Document {
  feedId: string;
  data: any;
}

const FormattedDataFeedSchema = new Schema<FormattedDataFeedDocument>({
  feedId: { type: String, required: true, unique: true },
  data: { type: Schema.Types.Mixed, required: true },
});

export const FormattedDataFeedModel = model<FormattedDataFeedDocument>(
  'FormattedDataFeed',
  FormattedDataFeedSchema
);
