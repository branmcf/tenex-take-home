export type GraphQLErrorWithCode = {
    graphQLErrors: [
        {
            extensions?: {
                pgSqlErrorCode?: string;
            };
        }
    ];
};