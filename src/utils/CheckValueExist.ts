export const checkValueExists = async (
  table: any,
  field: any,
  value: string | number | boolean
) => {
  const existingValue = await table.findOne({ where: { [field]: value } });
  return existingValue !== null;
};


export const checkMultipleFields = async (
  table: any,
  field1: any,
  field2: any,
  value1: string | number | boolean,
  value2: string | number | boolean,
) => {
  const existingValue = await table.findOne({ where: { [field1]: value1,[field2]:value2 } });
  return existingValue !== null;
};
