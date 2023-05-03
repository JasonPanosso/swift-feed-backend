export type ParsedCsvData = Array<Record<string, string>>;

export enum ConditionalOperator {
  blank = 'blank',
  notBlank = 'notBlank',
  includes = 'includes',
  notIncludes = 'notIncludes',
  equals = 'equals',
  notEquals = 'notEquals',
  greater = 'greater',
  lesser = 'lesser',
}

export interface Conditional {
  inventoryField: string;
  operator: ConditionalOperator;
  condition: string;
}

export interface MappingOperationConditions {
  conditions: Conditional[];
}

interface OperationInput {
  data: string | string[];
  separator?: string;
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
  globalRules: MappingOperationConditions[];
  storeName: string;
}
