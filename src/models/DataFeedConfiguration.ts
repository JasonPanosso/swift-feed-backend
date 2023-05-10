import { Schema, model, Document } from 'mongoose';
import { Conditional, RegexData } from '../shared/types';
import short from 'short-uuid';

interface ConditionDocument extends Document, Conditional {}

interface RegexDataDocument extends Document, RegexData {}

const RegexDataSchema = new Schema<RegexDataDocument>({
  googleFeedField: { type: String, required: true },
  regexString: { type: String, required: true },
  replaceString: { type: String, required: true },
})

RegexDataSchema.virtual('id').get(function (this: Document) {
  return this._id;
});

RegexDataSchema.set('toJSON', { virtuals: true });

const ConditionSchema = new Schema<ConditionDocument>({
  inventoryField: { type: String, required: true },
  operator: { type: String, required: true },
  condition: { type: String, required: false },
});

ConditionSchema.virtual('id').get(function (this: Document) {
  return this._id;
});

ConditionSchema.set('toJSON', { virtuals: true });

interface MappingOperationConditionsDocument extends Document {
  conditions: ConditionDocument[];
}

const MappingOperationConditionsSchema =
  new Schema<MappingOperationConditionsDocument>({
    conditions: { type: [ConditionSchema], required: false },
  });

MappingOperationConditionsSchema.virtual('id').get(function (this: Document) {
  return this._id;
});

MappingOperationConditionsSchema.set('toJSON', { virtuals: true });

interface MappingOperationDataDocument extends Document {
  operationSelect: 'static' | 'rename' | 'empty' | 'combine';
  operationInput: { data?: string | string[]; separator?: string };
  conditions?: MappingOperationConditionsDocument[];
}

const MappingOperationDataSchema = new Schema<MappingOperationDataDocument>({
  operationSelect: {
    type: String,
    enum: ['static', 'rename', 'empty', 'combine'],
    required: true,
  },
  operationInput: { type: Object, required: true },
  conditions: { type: [MappingOperationConditionsSchema], required: true },
});

MappingOperationDataSchema.virtual('id').get(function (this: Document) {
  return this._id;
});

MappingOperationDataSchema.set('toJSON', { virtuals: true });

interface MappingDataDocument extends Document {
  googleFeedField: string;
  mappingOperations: MappingOperationDataDocument[];
  conditionalToggle: boolean;
}

const MappingDataSchema = new Schema<MappingDataDocument>({
  googleFeedField: { type: String, required: true },
  mappingOperations: { type: [MappingOperationDataSchema], required: true },
  conditionalToggle: { type: Boolean, required: true },
});

MappingDataSchema.virtual('id').get(function (this: Document) {
  return this._id;
});

MappingDataSchema.set('toJSON', { virtuals: true });

export interface DataFeedConfigurationDocument extends Document {
  feedId: string;
  userId: Schema.Types.ObjectId;
  mappingsData: MappingDataDocument[];
  csvHeaders: string[];
  globalRules: MappingOperationConditionsDocument[];
  storeName: string;
  regexData: RegexData[];
}

export const DataFeedConfigurationSchema =
  new Schema<DataFeedConfigurationDocument>({
    feedId: {
      type: String,
      required: true,
      unique: true,
      default: () => short().generate(),
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mappingsData: { type: [MappingDataSchema], required: false },
    csvHeaders: { type: [String], required: false },
    regexData: { type: [RegexDataSchema], required: false },
    globalRules: { type: [MappingOperationConditionsSchema], required: false },
    storeName: { type: String, required: false },
  });

export const DataFeedConfigurationModel = model<DataFeedConfigurationDocument>(
  'DataFeedConfiguration',
  DataFeedConfigurationSchema
);
