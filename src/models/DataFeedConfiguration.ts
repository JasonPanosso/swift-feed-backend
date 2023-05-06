import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Conditional } from '../shared/types';
import short from 'short-uuid';

interface ConditionDocument extends Document, Conditional {}

const ConditionSchema = new Schema<ConditionDocument>({
  inventoryField: { type: String, required: true },
  operator: { type: String, required: true },
  condition: { type: String, required: false },
});

interface MappingOperationConditionsDocument extends Document {
  conditions: ConditionDocument[];
}

const MappingOperationConditionsSchema =
  new Schema<MappingOperationConditionsDocument>({
    conditions: { type: [ConditionSchema], required: false },
  });

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

export interface DataFeedConfigurationDocument extends Document {
  feedId: string;
  userId: Schema.Types.ObjectId;
  mappingsData: MappingDataDocument[];
  csvHeaders: Record<string, string>;
  globalRules: MappingOperationConditionsDocument[];
  storeName: string;
}

export const DataFeedConfigurationSchema =
  new Schema<DataFeedConfigurationDocument>({
    _id: { type: String, default: uuidv4() },
    feedId: {
      type: String,
      required: true,
      unique: true,
      default: short().generate(),
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mappingsData: { type: [MappingDataSchema], required: false },
    csvHeaders: { type: Schema.Types.Mixed, required: false },
    globalRules: { type: [MappingOperationConditionsSchema], required: false },
    storeName: { type: String, required: false },
  });

export const DataFeedConfigurationModel = model<DataFeedConfigurationDocument>(
  'DataFeedConfiguration',
  DataFeedConfigurationSchema
);
