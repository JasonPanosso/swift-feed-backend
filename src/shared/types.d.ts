export type ParsedCsvData = Array<Record<string, string>>;

export interface Conditional {
  inventoryField: string;
  operator: string;
  condition: string;
}

export interface MappingOperationConditions {
  conditions: Conditional[];
}

export interface OperationInput {
  data: string | string[];
  separator?: string;
}

export interface ConditionalOperationInput {
  inventoryField: string;
  operator:
    | 'blank'
    | 'notBlank'
    | 'includes'
    | 'notIncludes'
    | 'equals'
    | 'notEquals'
    | 'greater'
    | 'lesser';
  condition: string;
}

export interface MappingOperationData {
  operationSelect: 'static' | 'rename' | 'empty' | 'combine';
  operationInput: OperationInput;
  conditions: MappingOperationConditions[];
}

export interface MappingData {
  googleFeedField: string;
  mappingOperations: MappingOperationData[];
  conditionalToggle: boolean;
}

export interface DataFeedConfiguration {
  feedId: string;
  userId: string;
  mappingsData: MappingData[];
  globalRules: Conditional[][];
  storeName: string;
  ftpLogin: { username: string; password: string };
}
