import type {
  ParsedCsvData,
  Conditional,
  MappingData,
  MappingOperationData,
  OperationInput,
  MappingOperationConditions,
} from '../shared/types';

interface Operation {
  (input: OperationInput, dataRow: Record<string, string>): string;
}

interface ConditionalOperation {
  (
    inventoryField: string,
    condition: string,
    dataRow: Record<string, string>
  ): boolean;
}

const isInputInventoryField = (input: string): boolean => {
  return input.startsWith('column');
};

const removeStringPrefix = (str: string): string => str.slice(7);

const staticOperation: Operation = (input, dataRow) => input.data as string;

const renameOperation: Operation = (input, dataRow) => {
  if (dataRow[input.data as string]) return dataRow[input.data as string];
  throw new Error(
    `Error while applying Rename Mapping Operation - Header not in CSV File: ${input}`
  );
};

const emptyOperation: Operation = (input, dataRow) => '';

// TODO: this function really exposes how the current types/db schema fails to
// hold up to SOLID principles. Fix pls ye dumby
const combineOperation: Operation = (input, dataRow) => {
  if (!input.separator) {
    throw new Error(
      `Error: Input provided to combineOperation missing required separator field. Input: ${input}`
    );
  }
  const strList = input.data as string[];
  const formattedStrList = strList.map((str) => {
    if (isInputInventoryField(str)) {
      return dataRow[removeStringPrefix(str)];
    } else {
      return removeStringPrefix(str);
    }
  });
  return formattedStrList.join(input.separator);
};

const operationMap: Record<string, Operation> = {
  static: staticOperation,
  rename: renameOperation,
  empty: emptyOperation,
  combine: combineOperation,
};

const blankConditionalOperation: ConditionalOperation = (
  inventoryField,
  condition,
  dataRow
) => {
  return !dataRow[inventoryField];
};

const notBlankConditionalOperation: ConditionalOperation = (
  inventoryField,
  condition,
  dataRow
) => {
  return !!dataRow[inventoryField];
};

const equalsConditionalOperation: ConditionalOperation = (
  inventoryField,
  condition,
  dataRow
) => {
  return dataRow[inventoryField] == condition;
};

const notEqualsConditionalOperation: ConditionalOperation = (
  inventoryField,
  condition,
  dataRow
) => {
  return dataRow[inventoryField] !== condition;
};

const includesConditionalOperation: ConditionalOperation = (
  inventoryField,
  condition,
  dataRow
) => {
  return dataRow[inventoryField].includes(condition);
};

const notIncludesConditionalOperation: ConditionalOperation = (
  inventoryField,
  condition,
  dataRow
) => {
  return !dataRow[inventoryField].includes(condition);
};

const greaterConditionalOperation: ConditionalOperation = (
  inventoryField,
  condition,
  dataRow
) => {
  return dataRow[inventoryField] > condition;
};

const lesserConditionalOperation: ConditionalOperation = (
  inventoryField,
  condition,
  dataRow
) => {
  return dataRow[inventoryField] < condition;
};

const conditionalOperationMap: Record<string, ConditionalOperation> = {
  blank: blankConditionalOperation,
  notBlank: notBlankConditionalOperation,
  includes: includesConditionalOperation,
  notIncludes: notIncludesConditionalOperation,
  equals: equalsConditionalOperation,
  notEquals: notEqualsConditionalOperation,
  greater: greaterConditionalOperation,
  lesser: lesserConditionalOperation,
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

const createConditionalOperation = (conditionalOperationSelect: string) => {
  if (conditionalOperationMap[conditionalOperationSelect]) {
    return conditionalOperationMap[conditionalOperationSelect];
  } else {
    throw new Error(
      `Error while creating Conditional Operation - Unknown operation: ${conditionalOperationSelect}`
    );
  }
};

const evaluateCondition = (
  conditional: Conditional,
  dataRow: Record<string, string>
): boolean => {
  if (!conditional) return true;
  const operation = createConditionalOperation(conditional.operator);
  return operation(conditional.inventoryField, conditional.condition, dataRow);
};

export const evaluateConditions = (
  conditionsList: MappingOperationConditions[],
  dataRow: Record<string, string>
): boolean =>
  conditionsList.some((conditions) =>
    conditions.conditions.every((condition) =>
      evaluateCondition(condition, dataRow)
    )
  );

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
  csvData: ParsedCsvData,
  mappingsData: MappingData[],
  globalRules: MappingOperationConditions[]
): Record<string, string>[] => {
  const output: Record<string, string>[] = [];
  const filteredCsvData = csvData.filter((dataRow) =>
    evaluateConditions(globalRules, dataRow)
  );
  filteredCsvData.forEach((productData) => {
    output.push(applyMappingsToProduct(productData, mappingsData));
  });
  return output;
};
