
export interface MongoDuplicateKeyError {
    code: number;
    keyValue: Record<string, unknown>;
}