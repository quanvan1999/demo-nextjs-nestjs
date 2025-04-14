export const getSchemaName = <T extends { name: string }>(schema: T, key: string): string => schema[key] as string;
