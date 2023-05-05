import {
  MappingOperationConditions,
  Conditional,
  ConditionalOperator,
} from '../shared/types';

interface ConditionalOperation {
  (
    inventoryField: string,
    condition: string,
    dataRow: Record<string, string>
  ): boolean;
}

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

const conditionalOperationMap: Record<
  ConditionalOperator,
  ConditionalOperation
> = {
  blank: blankConditionalOperation,
  notBlank: notBlankConditionalOperation,
  includes: includesConditionalOperation,
  notIncludes: notIncludesConditionalOperation,
  equals: equalsConditionalOperation,
  notEquals: notEqualsConditionalOperation,
  greater: greaterConditionalOperation,
  lesser: lesserConditionalOperation,
};

const createConditionalOperation = (
  conditionalOperator: ConditionalOperator
) => {
  if (conditionalOperationMap[conditionalOperator]) {
    return conditionalOperationMap[conditionalOperator];
  } else {
    throw new Error(
      `Error while creating Conditional Operation - Unknown operation: ${conditionalOperator}`
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
