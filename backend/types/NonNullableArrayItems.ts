export type NonNullableArrayItems<T> = T extends ( infer U )[] | null | undefined
    ? NonNullable<U>[]
    : [];