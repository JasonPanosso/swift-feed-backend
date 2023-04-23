import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface ConditionDocument extends Document {
  inventoryField: string;
  operator: string;
  condition: string;
}

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
  conditions: { type: [MappingOperationConditionsSchema], required: false },
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

interface DataFeedConfigurationDocument extends Document {
  _id: string;
  userId: Schema.Types.ObjectId;
  mappingsData: MappingDataDocument[];
  globalRules: ConditionDocument[];
  storeName: string;
  ftpLogin: { username: string; password: string };
}

const DataFeedConfigurationSchema = new Schema<DataFeedConfigurationDocument>({
  _id: { type: String, default: uuidv4() },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mappingsData: { type: [MappingDataSchema], required: true },
  globalRules: { type: [ConditionSchema], required: false },
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
});

const DataFeedConfiguration = model<DataFeedConfigurationDocument>(
  'DataFeedConfiguration',
  DataFeedConfigurationSchema
);

export default DataFeedConfiguration;
