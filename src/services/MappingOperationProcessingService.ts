import type {
  ParsedData,
  MappingData,
  MappingOperationData,
  OperationInput,
} from '../shared/types';
import { evaluateConditions } from '../utils/conditionalOperationsUtil';

interface Operation {
  (input: OperationInput, dataRow: Record<string, string>): string;
}

const isInputCsvColumn = (input: string): boolean => {
  return input.startsWith('column');
};

const removeStringPrefix = (str: string): string => str.slice(7);

const staticOperation: Operation = (input, _dataRow) => input.data as string;

const renameOperation: Operation = (input, dataRow) => {
  if (dataRow[input.data as string]) return dataRow[input.data as string];
  throw new Error(
    `Error while applying Rename Mapping Operation - Header not in CSV File: ${input}`
  );
};

const emptyOperation: Operation = (_input, _dataRow) => '';

const combineOperation: Operation = (input, dataRow) => {
  if (!Array.isArray(input.data)) {
    throw new Error(
      `Error: Input provided to combineOperation is not a string array. Input: ${input}`
    );
  }
  const strList = input.data;
  const formattedStrList = strList.map((str) => {
    const strWithoutPrefix = removeStringPrefix(str);
    if (isInputCsvColumn(str)) {
      return dataRow[strWithoutPrefix];
    } else {
      return strWithoutPrefix;
    }
  });
  return formattedStrList.join(input.separator || '');
};

const operationMap: Record<string, Operation> = {
  static: staticOperation,
  rename: renameOperation,
  empty: emptyOperation,
  combine: combineOperation,
};

const createOperation = (operationSelect: string) => {
  if (operationMap[operationSelect]) {
    return operationMap[operationSelect];
  } else {
    throw new Error(
      `Error while creating Mapping Operation - Unknown operation: ${operationSelect}`
    );
  }
};

const applyMappingsToProduct = (
  productData: Record<string, string>,
  mappingsData: MappingData[]
): Record<string, string> => {
  const feedFormattedProduct: Record<string, string> = {};
  mappingsData.forEach((mappingData) => {
    const key = mappingData.googleFeedField;
    let mappingOperation: MappingOperationData;
    if (mappingData.conditionalToggle) {
      mappingOperation =
        mappingData.mappingOperations.find((mappingOperation) =>
          evaluateConditions(mappingOperation.conditions, productData)
        ) ??
        mappingData.mappingOperations[mappingData.mappingOperations.length - 1];
    } else {
      mappingOperation = mappingData.mappingOperations[0];
    }
    const operation = createOperation(mappingOperation.operationSelect);
    const value = operation(mappingOperation.operationInput, productData);
    feedFormattedProduct[key] = value;
  });
  return feedFormattedProduct;
};

export const applyMappingsToCsvData = (
  csvData: ParsedData,
  mappingsData: MappingData[]
): Record<string, string>[] => {
  const output = csvData.map((productData) =>
    applyMappingsToProduct(productData, mappingsData)
  );
  return output;
};
