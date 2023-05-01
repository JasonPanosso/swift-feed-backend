import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Conditional } from '../shared/types';

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
  globalRules: MappingOperationConditionsDocument[];
  storeName: string;
  ftpLogin: { username: string; password: string };
}

export const DataFeedConfigurationSchema =
  new Schema<DataFeedConfigurationDocument>(
    {
      _id: { type: String, default: uuidv4() },
      feedId: { type: String, required: true, unique: true },
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      mappingsData: { type: [MappingDataSchema], required: true },
      globalRules: { type: [MappingOperationConditionsSchema], required: true },
      storeName: { type: String, required: true },
      ftpLogin: {
        username: {
          type: String,
          required: true,
          unique: true,
        },
        password: {
          type: String,
          required: true,
        },
      },
    },
    { validateBeforeSave: true }
  );

DataFeedConfigurationSchema.pre<DataFeedConfigurationDocument>(
  'validate',
  function () {
    if (
      (this.isModified('ftpLogin.username') || this.isModified('feedId')) &&
      this.feedId !== this.ftpLogin.username
    ) {
      throw new Error(`feedId and ftp username must be the same`);
    }
  }
);

export const DataFeedConfigurationModel = model<DataFeedConfigurationDocument>(
  'DataFeedConfiguration',
  DataFeedConfigurationSchema
);
