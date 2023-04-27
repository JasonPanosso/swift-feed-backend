interface Conditional {
  inventoryField: string;
  operator: string;
  condition: string;
}

interface Operation {
  (input: string, dataRow: any): string;
}

const staticOperation: Operation = (input, dataRow) => input;

const renameOperation: Operation = (input, dataRow) => {
  if (dataRow[input]) return dataRow[input];
  throw new Error(
    `Error while applying Rename Mapping Operation - Header not in CSV File: ${input}`
  );
};

const emptyOperation: Operation = (input, dataRow) => '';

const combineOperation: Operation = (input, dataRow) => '';

const operationMap = {
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

const evaluateConditions = (
  conditions: Conditional[][],
  dataRow: any
): boolean => {
  // ... implement condition evaluation logic
  return true;
};

const evaluateCondition = (condition: Conditional, dataRow: any): boolean => {
  // ... implement single condition evaluation logic
  return true;
};

const applyMappings = (mappingsData: any[], csvData: any[]): any[] => {
  return mappingsData.map((mapping) => {
    if (evaluateConditions(mapping.conditions, csvData)) {
      const operation = createOperation(mapping.operationSelect);
      csvData[mapping.operationInput.data] = operation(
        mapping.operationInput.data,
        csvData
      );
    }
    // this is garbage output to get rid of errors XD
    return csvData;
  });
};
