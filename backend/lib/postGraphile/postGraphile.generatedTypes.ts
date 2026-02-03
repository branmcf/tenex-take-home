/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Cursor: { input: any; output: any; }
  Datetime: { input: any; output: any; }
};

export type Account = Node & {
  __typename?: 'Account';
  accessToken?: Maybe<Scalars['String']['output']>;
  accessTokenExpiresAt?: Maybe<Scalars['Datetime']['output']>;
  accountId: Scalars['String']['output'];
  createdAt: Scalars['Datetime']['output'];
  id: Scalars['String']['output'];
  idToken?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  password?: Maybe<Scalars['String']['output']>;
  providerId: Scalars['String']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
  refreshTokenExpiresAt?: Maybe<Scalars['Datetime']['output']>;
  scope?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Datetime']['output'];
  /** Reads a single `User` that is related to this `Account`. */
  userByUserId?: Maybe<User>;
  userId: Scalars['String']['output'];
};

/** A condition to be used against `Account` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type AccountCondition = {
  /** Checks for equality with the object’s `accessToken` field. */
  accessToken?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `accessTokenExpiresAt` field. */
  accessTokenExpiresAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `accountId` field. */
  accountId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `idToken` field. */
  idToken?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `password` field. */
  password?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `providerId` field. */
  providerId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `refreshToken` field. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `refreshTokenExpiresAt` field. */
  refreshTokenExpiresAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `scope` field. */
  scope?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['String']['input']>;
};

/** An input for mutations affecting `Account` */
export type AccountInput = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
  accessTokenExpiresAt?: InputMaybe<Scalars['Datetime']['input']>;
  accountId: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  id: Scalars['String']['input'];
  idToken?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  providerId: Scalars['String']['input'];
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  refreshTokenExpiresAt?: InputMaybe<Scalars['Datetime']['input']>;
  scope?: InputMaybe<Scalars['String']['input']>;
  updatedAt: Scalars['Datetime']['input'];
  userId: Scalars['String']['input'];
};

/** Represents an update to a `Account`. Fields that are set will be updated. */
export type AccountPatch = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
  accessTokenExpiresAt?: InputMaybe<Scalars['Datetime']['input']>;
  accountId?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  idToken?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  providerId?: InputMaybe<Scalars['String']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  refreshTokenExpiresAt?: InputMaybe<Scalars['Datetime']['input']>;
  scope?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Account` values. */
export type AccountsConnection = {
  __typename?: 'AccountsConnection';
  /** A list of edges which contains the `Account` and cursor to aid in pagination. */
  edges: Array<AccountsEdge>;
  /** A list of `Account` objects. */
  nodes: Array<Maybe<Account>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Account` edge in the connection. */
export type AccountsEdge = {
  __typename?: 'AccountsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Account` at the end of the edge. */
  node?: Maybe<Account>;
};

/** Methods to use when ordering `Account`. */
export enum AccountsOrderBy {
  AccessTokenAsc = 'ACCESS_TOKEN_ASC',
  AccessTokenDesc = 'ACCESS_TOKEN_DESC',
  AccessTokenExpiresAtAsc = 'ACCESS_TOKEN_EXPIRES_AT_ASC',
  AccessTokenExpiresAtDesc = 'ACCESS_TOKEN_EXPIRES_AT_DESC',
  AccountIdAsc = 'ACCOUNT_ID_ASC',
  AccountIdDesc = 'ACCOUNT_ID_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IdTokenAsc = 'ID_TOKEN_ASC',
  IdTokenDesc = 'ID_TOKEN_DESC',
  Natural = 'NATURAL',
  PasswordAsc = 'PASSWORD_ASC',
  PasswordDesc = 'PASSWORD_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProviderIdAsc = 'PROVIDER_ID_ASC',
  ProviderIdDesc = 'PROVIDER_ID_DESC',
  RefreshTokenAsc = 'REFRESH_TOKEN_ASC',
  RefreshTokenDesc = 'REFRESH_TOKEN_DESC',
  RefreshTokenExpiresAtAsc = 'REFRESH_TOKEN_EXPIRES_AT_ASC',
  RefreshTokenExpiresAtDesc = 'REFRESH_TOKEN_EXPIRES_AT_DESC',
  ScopeAsc = 'SCOPE_ASC',
  ScopeDesc = 'SCOPE_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

/** All input for the create `Account` mutation. */
export type CreateAccountInput = {
  /** The `Account` to be created by this mutation. */
  account: AccountInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** The output of our create `Account` mutation. */
export type CreateAccountPayload = {
  __typename?: 'CreateAccountPayload';
  /** The `Account` that was created by this mutation. */
  account?: Maybe<Account>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Account`. */
  userByUserId?: Maybe<User>;
};


/** The output of our create `Account` mutation. */
export type CreateAccountPayloadAccountEdgeArgs = {
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};

/** All input for the create `Pgmigration` mutation. */
export type CreatePgmigrationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Pgmigration` to be created by this mutation. */
  pgmigration: PgmigrationInput;
};

/** The output of our create `Pgmigration` mutation. */
export type CreatePgmigrationPayload = {
  __typename?: 'CreatePgmigrationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Pgmigration` that was created by this mutation. */
  pgmigration?: Maybe<Pgmigration>;
  /** An edge for our `Pgmigration`. May be used by Relay 1. */
  pgmigrationEdge?: Maybe<PgmigrationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Pgmigration` mutation. */
export type CreatePgmigrationPayloadPgmigrationEdgeArgs = {
  orderBy?: InputMaybe<Array<PgmigrationsOrderBy>>;
};

/** All input for the create `Session` mutation. */
export type CreateSessionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Session` to be created by this mutation. */
  session: SessionInput;
};

/** The output of our create `Session` mutation. */
export type CreateSessionPayload = {
  __typename?: 'CreateSessionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Session` that was created by this mutation. */
  session?: Maybe<Session>;
  /** An edge for our `Session`. May be used by Relay 1. */
  sessionEdge?: Maybe<SessionsEdge>;
  /** Reads a single `User` that is related to this `Session`. */
  userByUserId?: Maybe<User>;
};


/** The output of our create `Session` mutation. */
export type CreateSessionPayloadSessionEdgeArgs = {
  orderBy?: InputMaybe<Array<SessionsOrderBy>>;
};

/** All input for the create `User` mutation. */
export type CreateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `User` to be created by this mutation. */
  user: UserInput;
};

/** The output of our create `User` mutation. */
export type CreateUserPayload = {
  __typename?: 'CreateUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `User` that was created by this mutation. */
  user?: Maybe<User>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>;
};


/** The output of our create `User` mutation. */
export type CreateUserPayloadUserEdgeArgs = {
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

/** All input for the create `Verification` mutation. */
export type CreateVerificationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Verification` to be created by this mutation. */
  verification: VerificationInput;
};

/** The output of our create `Verification` mutation. */
export type CreateVerificationPayload = {
  __typename?: 'CreateVerificationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Verification` that was created by this mutation. */
  verification?: Maybe<Verification>;
  /** An edge for our `Verification`. May be used by Relay 1. */
  verificationEdge?: Maybe<VerificationsEdge>;
};


/** The output of our create `Verification` mutation. */
export type CreateVerificationPayloadVerificationEdgeArgs = {
  orderBy?: InputMaybe<Array<VerificationsOrderBy>>;
};

/** All input for the `deleteAccountById` mutation. */
export type DeleteAccountByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};

/** All input for the `deleteAccount` mutation. */
export type DeleteAccountInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Account` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `Account` mutation. */
export type DeleteAccountPayload = {
  __typename?: 'DeleteAccountPayload';
  /** The `Account` that was deleted by this mutation. */
  account?: Maybe<Account>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedAccountId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Account`. */
  userByUserId?: Maybe<User>;
};


/** The output of our delete `Account` mutation. */
export type DeleteAccountPayloadAccountEdgeArgs = {
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};

/** All input for the `deletePgmigrationById` mutation. */
export type DeletePgmigrationByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

/** All input for the `deletePgmigration` mutation. */
export type DeletePgmigrationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Pgmigration` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `Pgmigration` mutation. */
export type DeletePgmigrationPayload = {
  __typename?: 'DeletePgmigrationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedPgmigrationId?: Maybe<Scalars['ID']['output']>;
  /** The `Pgmigration` that was deleted by this mutation. */
  pgmigration?: Maybe<Pgmigration>;
  /** An edge for our `Pgmigration`. May be used by Relay 1. */
  pgmigrationEdge?: Maybe<PgmigrationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Pgmigration` mutation. */
export type DeletePgmigrationPayloadPgmigrationEdgeArgs = {
  orderBy?: InputMaybe<Array<PgmigrationsOrderBy>>;
};

/** All input for the `deleteSessionById` mutation. */
export type DeleteSessionByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};

/** All input for the `deleteSessionByToken` mutation. */
export type DeleteSessionByTokenInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  token: Scalars['String']['input'];
};

/** All input for the `deleteSession` mutation. */
export type DeleteSessionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Session` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `Session` mutation. */
export type DeleteSessionPayload = {
  __typename?: 'DeleteSessionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedSessionId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Session` that was deleted by this mutation. */
  session?: Maybe<Session>;
  /** An edge for our `Session`. May be used by Relay 1. */
  sessionEdge?: Maybe<SessionsEdge>;
  /** Reads a single `User` that is related to this `Session`. */
  userByUserId?: Maybe<User>;
};


/** The output of our delete `Session` mutation. */
export type DeleteSessionPayloadSessionEdgeArgs = {
  orderBy?: InputMaybe<Array<SessionsOrderBy>>;
};

/** All input for the `deleteUserByEmail` mutation. */
export type DeleteUserByEmailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
};

/** All input for the `deleteUserById` mutation. */
export type DeleteUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};

/** All input for the `deleteUser` mutation. */
export type DeleteUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `User` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `User` mutation. */
export type DeleteUserPayload = {
  __typename?: 'DeleteUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedUserId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `User` that was deleted by this mutation. */
  user?: Maybe<User>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>;
};


/** The output of our delete `User` mutation. */
export type DeleteUserPayloadUserEdgeArgs = {
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

/** All input for the `deleteVerificationById` mutation. */
export type DeleteVerificationByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};

/** All input for the `deleteVerification` mutation. */
export type DeleteVerificationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Verification` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `Verification` mutation. */
export type DeleteVerificationPayload = {
  __typename?: 'DeleteVerificationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedVerificationId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Verification` that was deleted by this mutation. */
  verification?: Maybe<Verification>;
  /** An edge for our `Verification`. May be used by Relay 1. */
  verificationEdge?: Maybe<VerificationsEdge>;
};


/** The output of our delete `Verification` mutation. */
export type DeleteVerificationPayloadVerificationEdgeArgs = {
  orderBy?: InputMaybe<Array<VerificationsOrderBy>>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `Account`. */
  createAccount?: Maybe<CreateAccountPayload>;
  /** Creates a single `Pgmigration`. */
  createPgmigration?: Maybe<CreatePgmigrationPayload>;
  /** Creates a single `Session`. */
  createSession?: Maybe<CreateSessionPayload>;
  /** Creates a single `User`. */
  createUser?: Maybe<CreateUserPayload>;
  /** Creates a single `Verification`. */
  createVerification?: Maybe<CreateVerificationPayload>;
  /** Deletes a single `Account` using its globally unique id. */
  deleteAccount?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Account` using a unique key. */
  deleteAccountById?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Pgmigration` using its globally unique id. */
  deletePgmigration?: Maybe<DeletePgmigrationPayload>;
  /** Deletes a single `Pgmigration` using a unique key. */
  deletePgmigrationById?: Maybe<DeletePgmigrationPayload>;
  /** Deletes a single `Session` using its globally unique id. */
  deleteSession?: Maybe<DeleteSessionPayload>;
  /** Deletes a single `Session` using a unique key. */
  deleteSessionById?: Maybe<DeleteSessionPayload>;
  /** Deletes a single `Session` using a unique key. */
  deleteSessionByToken?: Maybe<DeleteSessionPayload>;
  /** Deletes a single `User` using its globally unique id. */
  deleteUser?: Maybe<DeleteUserPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUserByEmail?: Maybe<DeleteUserPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUserById?: Maybe<DeleteUserPayload>;
  /** Deletes a single `Verification` using its globally unique id. */
  deleteVerification?: Maybe<DeleteVerificationPayload>;
  /** Deletes a single `Verification` using a unique key. */
  deleteVerificationById?: Maybe<DeleteVerificationPayload>;
  /** Updates a single `Account` using its globally unique id and a patch. */
  updateAccount?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Account` using a unique key and a patch. */
  updateAccountById?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Pgmigration` using its globally unique id and a patch. */
  updatePgmigration?: Maybe<UpdatePgmigrationPayload>;
  /** Updates a single `Pgmigration` using a unique key and a patch. */
  updatePgmigrationById?: Maybe<UpdatePgmigrationPayload>;
  /** Updates a single `Session` using its globally unique id and a patch. */
  updateSession?: Maybe<UpdateSessionPayload>;
  /** Updates a single `Session` using a unique key and a patch. */
  updateSessionById?: Maybe<UpdateSessionPayload>;
  /** Updates a single `Session` using a unique key and a patch. */
  updateSessionByToken?: Maybe<UpdateSessionPayload>;
  /** Updates a single `User` using its globally unique id and a patch. */
  updateUser?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUserByEmail?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUserById?: Maybe<UpdateUserPayload>;
  /** Updates a single `Verification` using its globally unique id and a patch. */
  updateVerification?: Maybe<UpdateVerificationPayload>;
  /** Updates a single `Verification` using a unique key and a patch. */
  updateVerificationById?: Maybe<UpdateVerificationPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePgmigrationArgs = {
  input: CreatePgmigrationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSessionArgs = {
  input: CreateSessionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateVerificationArgs = {
  input: CreateVerificationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountArgs = {
  input: DeleteAccountInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountByIdArgs = {
  input: DeleteAccountByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePgmigrationArgs = {
  input: DeletePgmigrationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePgmigrationByIdArgs = {
  input: DeletePgmigrationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSessionArgs = {
  input: DeleteSessionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSessionByIdArgs = {
  input: DeleteSessionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSessionByTokenArgs = {
  input: DeleteSessionByTokenInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserByEmailArgs = {
  input: DeleteUserByEmailInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserByIdArgs = {
  input: DeleteUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteVerificationArgs = {
  input: DeleteVerificationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteVerificationByIdArgs = {
  input: DeleteVerificationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountArgs = {
  input: UpdateAccountInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountByIdArgs = {
  input: UpdateAccountByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePgmigrationArgs = {
  input: UpdatePgmigrationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePgmigrationByIdArgs = {
  input: UpdatePgmigrationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSessionArgs = {
  input: UpdateSessionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSessionByIdArgs = {
  input: UpdateSessionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSessionByTokenArgs = {
  input: UpdateSessionByTokenInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByEmailArgs = {
  input: UpdateUserByEmailInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByIdArgs = {
  input: UpdateUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateVerificationArgs = {
  input: UpdateVerificationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateVerificationByIdArgs = {
  input: UpdateVerificationByIdInput;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>;
};

export type Pgmigration = Node & {
  __typename?: 'Pgmigration';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  runOn: Scalars['Datetime']['output'];
};

/**
 * A condition to be used against `Pgmigration` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type PgmigrationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `runOn` field. */
  runOn?: InputMaybe<Scalars['Datetime']['input']>;
};

/** An input for mutations affecting `Pgmigration` */
export type PgmigrationInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  runOn: Scalars['Datetime']['input'];
};

/** Represents an update to a `Pgmigration`. Fields that are set will be updated. */
export type PgmigrationPatch = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  runOn?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `Pgmigration` values. */
export type PgmigrationsConnection = {
  __typename?: 'PgmigrationsConnection';
  /** A list of edges which contains the `Pgmigration` and cursor to aid in pagination. */
  edges: Array<PgmigrationsEdge>;
  /** A list of `Pgmigration` objects. */
  nodes: Array<Maybe<Pgmigration>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Pgmigration` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Pgmigration` edge in the connection. */
export type PgmigrationsEdge = {
  __typename?: 'PgmigrationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Pgmigration` at the end of the edge. */
  node?: Maybe<Pgmigration>;
};

/** Methods to use when ordering `Pgmigration`. */
export enum PgmigrationsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RunOnAsc = 'RUN_ON_ASC',
  RunOnDesc = 'RUN_ON_DESC'
}

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  /** Reads a single `Account` using its globally unique `ID`. */
  account?: Maybe<Account>;
  accountById?: Maybe<Account>;
  /** Reads and enables pagination through a set of `Account`. */
  allAccounts?: Maybe<AccountsConnection>;
  /** Reads and enables pagination through a set of `Pgmigration`. */
  allPgmigrations?: Maybe<PgmigrationsConnection>;
  /** Reads and enables pagination through a set of `Session`. */
  allSessions?: Maybe<SessionsConnection>;
  /** Reads and enables pagination through a set of `User`. */
  allUsers?: Maybe<UsersConnection>;
  /** Reads and enables pagination through a set of `Verification`. */
  allVerifications?: Maybe<VerificationsConnection>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID']['output'];
  /** Reads a single `Pgmigration` using its globally unique `ID`. */
  pgmigration?: Maybe<Pgmigration>;
  pgmigrationById?: Maybe<Pgmigration>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** Reads a single `Session` using its globally unique `ID`. */
  session?: Maybe<Session>;
  sessionById?: Maybe<Session>;
  sessionByToken?: Maybe<Session>;
  /** Reads a single `User` using its globally unique `ID`. */
  user?: Maybe<User>;
  userByEmail?: Maybe<User>;
  userById?: Maybe<User>;
  /** Reads a single `Verification` using its globally unique `ID`. */
  verification?: Maybe<Verification>;
  verificationById?: Maybe<Verification>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAccountArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAccountByIdArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAllAccountsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<AccountCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllPgmigrationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PgmigrationCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PgmigrationsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllSessionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<SessionCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SessionsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllUsersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UserCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllVerificationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<VerificationCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<VerificationsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPgmigrationArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPgmigrationByIdArgs = {
  id: Scalars['Int']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySessionArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySessionByIdArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySessionByTokenArgs = {
  token: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserByEmailArgs = {
  email: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserByIdArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryVerificationArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryVerificationByIdArgs = {
  id: Scalars['String']['input'];
};

export type Session = Node & {
  __typename?: 'Session';
  createdAt: Scalars['Datetime']['output'];
  expiresAt: Scalars['Datetime']['output'];
  id: Scalars['String']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  token: Scalars['String']['output'];
  updatedAt: Scalars['Datetime']['output'];
  userAgent?: Maybe<Scalars['String']['output']>;
  /** Reads a single `User` that is related to this `Session`. */
  userByUserId?: Maybe<User>;
  userId: Scalars['String']['output'];
};

/** A condition to be used against `Session` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type SessionCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `expiresAt` field. */
  expiresAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `ipAddress` field. */
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `token` field. */
  token?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `userAgent` field. */
  userAgent?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['String']['input']>;
};

/** An input for mutations affecting `Session` */
export type SessionInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  expiresAt: Scalars['Datetime']['input'];
  id: Scalars['String']['input'];
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  token: Scalars['String']['input'];
  updatedAt: Scalars['Datetime']['input'];
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};

/** Represents an update to a `Session`. Fields that are set will be updated. */
export type SessionPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  expiresAt?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Session` values. */
export type SessionsConnection = {
  __typename?: 'SessionsConnection';
  /** A list of edges which contains the `Session` and cursor to aid in pagination. */
  edges: Array<SessionsEdge>;
  /** A list of `Session` objects. */
  nodes: Array<Maybe<Session>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Session` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Session` edge in the connection. */
export type SessionsEdge = {
  __typename?: 'SessionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Session` at the end of the edge. */
  node?: Maybe<Session>;
};

/** Methods to use when ordering `Session`. */
export enum SessionsOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  ExpiresAtAsc = 'EXPIRES_AT_ASC',
  ExpiresAtDesc = 'EXPIRES_AT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IpAddressAsc = 'IP_ADDRESS_ASC',
  IpAddressDesc = 'IP_ADDRESS_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TokenAsc = 'TOKEN_ASC',
  TokenDesc = 'TOKEN_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  UserAgentAsc = 'USER_AGENT_ASC',
  UserAgentDesc = 'USER_AGENT_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

/** All input for the `updateAccountById` mutation. */
export type UpdateAccountByIdInput = {
  /** An object where the defined keys will be set on the `Account` being updated. */
  accountPatch: AccountPatch;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};

/** All input for the `updateAccount` mutation. */
export type UpdateAccountInput = {
  /** An object where the defined keys will be set on the `Account` being updated. */
  accountPatch: AccountPatch;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Account` to be updated. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our update `Account` mutation. */
export type UpdateAccountPayload = {
  __typename?: 'UpdateAccountPayload';
  /** The `Account` that was updated by this mutation. */
  account?: Maybe<Account>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Account`. */
  userByUserId?: Maybe<User>;
};


/** The output of our update `Account` mutation. */
export type UpdateAccountPayloadAccountEdgeArgs = {
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};

/** All input for the `updatePgmigrationById` mutation. */
export type UpdatePgmigrationByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  /** An object where the defined keys will be set on the `Pgmigration` being updated. */
  pgmigrationPatch: PgmigrationPatch;
};

/** All input for the `updatePgmigration` mutation. */
export type UpdatePgmigrationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Pgmigration` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Pgmigration` being updated. */
  pgmigrationPatch: PgmigrationPatch;
};

/** The output of our update `Pgmigration` mutation. */
export type UpdatePgmigrationPayload = {
  __typename?: 'UpdatePgmigrationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Pgmigration` that was updated by this mutation. */
  pgmigration?: Maybe<Pgmigration>;
  /** An edge for our `Pgmigration`. May be used by Relay 1. */
  pgmigrationEdge?: Maybe<PgmigrationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Pgmigration` mutation. */
export type UpdatePgmigrationPayloadPgmigrationEdgeArgs = {
  orderBy?: InputMaybe<Array<PgmigrationsOrderBy>>;
};

/** All input for the `updateSessionById` mutation. */
export type UpdateSessionByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  /** An object where the defined keys will be set on the `Session` being updated. */
  sessionPatch: SessionPatch;
};

/** All input for the `updateSessionByToken` mutation. */
export type UpdateSessionByTokenInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Session` being updated. */
  sessionPatch: SessionPatch;
  token: Scalars['String']['input'];
};

/** All input for the `updateSession` mutation. */
export type UpdateSessionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Session` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Session` being updated. */
  sessionPatch: SessionPatch;
};

/** The output of our update `Session` mutation. */
export type UpdateSessionPayload = {
  __typename?: 'UpdateSessionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Session` that was updated by this mutation. */
  session?: Maybe<Session>;
  /** An edge for our `Session`. May be used by Relay 1. */
  sessionEdge?: Maybe<SessionsEdge>;
  /** Reads a single `User` that is related to this `Session`. */
  userByUserId?: Maybe<User>;
};


/** The output of our update `Session` mutation. */
export type UpdateSessionPayloadSessionEdgeArgs = {
  orderBy?: InputMaybe<Array<SessionsOrderBy>>;
};

/** All input for the `updateUserByEmail` mutation. */
export type UpdateUserByEmailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  /** An object where the defined keys will be set on the `User` being updated. */
  userPatch: UserPatch;
};

/** All input for the `updateUserById` mutation. */
export type UpdateUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  /** An object where the defined keys will be set on the `User` being updated. */
  userPatch: UserPatch;
};

/** All input for the `updateUser` mutation. */
export type UpdateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `User` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `User` being updated. */
  userPatch: UserPatch;
};

/** The output of our update `User` mutation. */
export type UpdateUserPayload = {
  __typename?: 'UpdateUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `User` that was updated by this mutation. */
  user?: Maybe<User>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>;
};


/** The output of our update `User` mutation. */
export type UpdateUserPayloadUserEdgeArgs = {
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

/** All input for the `updateVerificationById` mutation. */
export type UpdateVerificationByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  /** An object where the defined keys will be set on the `Verification` being updated. */
  verificationPatch: VerificationPatch;
};

/** All input for the `updateVerification` mutation. */
export type UpdateVerificationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Verification` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Verification` being updated. */
  verificationPatch: VerificationPatch;
};

/** The output of our update `Verification` mutation. */
export type UpdateVerificationPayload = {
  __typename?: 'UpdateVerificationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Verification` that was updated by this mutation. */
  verification?: Maybe<Verification>;
  /** An edge for our `Verification`. May be used by Relay 1. */
  verificationEdge?: Maybe<VerificationsEdge>;
};


/** The output of our update `Verification` mutation. */
export type UpdateVerificationPayloadVerificationEdgeArgs = {
  orderBy?: InputMaybe<Array<VerificationsOrderBy>>;
};

export type User = Node & {
  __typename?: 'User';
  /** Reads and enables pagination through a set of `Account`. */
  accountsByUserId: AccountsConnection;
  createdAt: Scalars['Datetime']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads and enables pagination through a set of `Session`. */
  sessionsByUserId: SessionsConnection;
  updatedAt: Scalars['Datetime']['output'];
};


export type UserAccountsByUserIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<AccountCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};


export type UserSessionsByUserIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<SessionCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SessionsOrderBy>>;
};

/** A condition to be used against `User` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type UserCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `email` field. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `emailVerified` field. */
  emailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `image` field. */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** An input for mutations affecting `User` */
export type UserInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  email: Scalars['String']['input'];
  emailVerified: Scalars['Boolean']['input'];
  id: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Represents an update to a `User`. Fields that are set will be updated. */
export type UserPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `User` values. */
export type UsersConnection = {
  __typename?: 'UsersConnection';
  /** A list of edges which contains the `User` and cursor to aid in pagination. */
  edges: Array<UsersEdge>;
  /** A list of `User` objects. */
  nodes: Array<Maybe<User>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `User` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `User` edge in the connection. */
export type UsersEdge = {
  __typename?: 'UsersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `User` at the end of the edge. */
  node?: Maybe<User>;
};

/** Methods to use when ordering `User`. */
export enum UsersOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  EmailAsc = 'EMAIL_ASC',
  EmailDesc = 'EMAIL_DESC',
  EmailVerifiedAsc = 'EMAIL_VERIFIED_ASC',
  EmailVerifiedDesc = 'EMAIL_VERIFIED_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ImageAsc = 'IMAGE_ASC',
  ImageDesc = 'IMAGE_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

export type Verification = Node & {
  __typename?: 'Verification';
  createdAt: Scalars['Datetime']['output'];
  expiresAt: Scalars['Datetime']['output'];
  id: Scalars['String']['output'];
  identifier: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  updatedAt: Scalars['Datetime']['output'];
  value: Scalars['String']['output'];
};

/**
 * A condition to be used against `Verification` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type VerificationCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `expiresAt` field. */
  expiresAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `identifier` field. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `value` field. */
  value?: InputMaybe<Scalars['String']['input']>;
};

/** An input for mutations affecting `Verification` */
export type VerificationInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  expiresAt: Scalars['Datetime']['input'];
  id: Scalars['String']['input'];
  identifier: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  value: Scalars['String']['input'];
};

/** Represents an update to a `Verification`. Fields that are set will be updated. */
export type VerificationPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  expiresAt?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Verification` values. */
export type VerificationsConnection = {
  __typename?: 'VerificationsConnection';
  /** A list of edges which contains the `Verification` and cursor to aid in pagination. */
  edges: Array<VerificationsEdge>;
  /** A list of `Verification` objects. */
  nodes: Array<Maybe<Verification>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Verification` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Verification` edge in the connection. */
export type VerificationsEdge = {
  __typename?: 'VerificationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Verification` at the end of the edge. */
  node?: Maybe<Verification>;
};

/** Methods to use when ordering `Verification`. */
export enum VerificationsOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  ExpiresAtAsc = 'EXPIRES_AT_ASC',
  ExpiresAtDesc = 'EXPIRES_AT_DESC',
  IdentifierAsc = 'IDENTIFIER_ASC',
  IdentifierDesc = 'IDENTIFIER_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  ValueAsc = 'VALUE_ASC',
  ValueDesc = 'VALUE_DESC'
}
