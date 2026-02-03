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
  BigFloat: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Cursor: { input: any; output: any; }
  Datetime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  UUID: { input: any; output: any; }
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

export type Chat = Node & {
  __typename?: 'Chat';
  createdAt: Scalars['Datetime']['output'];
  deletedAt?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['UUID']['output'];
  /** Reads and enables pagination through a set of `Message`. */
  messagesByChatId: MessagesConnection;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Datetime']['output'];
  /** Reads a single `User` that is related to this `Chat`. */
  userByUserId?: Maybe<User>;
  userId: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `WorkflowRun`. */
  workflowRunsByChatId: WorkflowRunsConnection;
};


export type ChatMessagesByChatIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MessageCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MessagesOrderBy>>;
};


export type ChatWorkflowRunsByChatIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<WorkflowRunCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkflowRunsOrderBy>>;
};

/** A condition to be used against `Chat` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ChatCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `deletedAt` field. */
  deletedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['String']['input']>;
};

/** An input for mutations affecting `Chat` */
export type ChatInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  deletedAt?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId: Scalars['String']['input'];
};

/** Represents an update to a `Chat`. Fields that are set will be updated. */
export type ChatPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  deletedAt?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Chat` values. */
export type ChatsConnection = {
  __typename?: 'ChatsConnection';
  /** A list of edges which contains the `Chat` and cursor to aid in pagination. */
  edges: Array<ChatsEdge>;
  /** A list of `Chat` objects. */
  nodes: Array<Maybe<Chat>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Chat` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Chat` edge in the connection. */
export type ChatsEdge = {
  __typename?: 'ChatsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Chat` at the end of the edge. */
  node?: Maybe<Chat>;
};

/** Methods to use when ordering `Chat`. */
export enum ChatsOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  DeletedAtAsc = 'DELETED_AT_ASC',
  DeletedAtDesc = 'DELETED_AT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
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

/** All input for the create `Chat` mutation. */
export type CreateChatInput = {
  /** The `Chat` to be created by this mutation. */
  chat: ChatInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** The output of our create `Chat` mutation. */
export type CreateChatPayload = {
  __typename?: 'CreateChatPayload';
  /** The `Chat` that was created by this mutation. */
  chat?: Maybe<Chat>;
  /** An edge for our `Chat`. May be used by Relay 1. */
  chatEdge?: Maybe<ChatsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Chat`. */
  userByUserId?: Maybe<User>;
};


/** The output of our create `Chat` mutation. */
export type CreateChatPayloadChatEdgeArgs = {
  orderBy?: InputMaybe<Array<ChatsOrderBy>>;
};

/** All input for the create `Message` mutation. */
export type CreateMessageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Message` to be created by this mutation. */
  message: MessageInput;
};

/** The output of our create `Message` mutation. */
export type CreateMessagePayload = {
  __typename?: 'CreateMessagePayload';
  /** Reads a single `Chat` that is related to this `Message`. */
  chatByChatId?: Maybe<Chat>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Message` that was created by this mutation. */
  message?: Maybe<Message>;
  /** An edge for our `Message`. May be used by Relay 1. */
  messageEdge?: Maybe<MessagesEdge>;
  /** Reads a single `Model` that is related to this `Message`. */
  modelByModelId?: Maybe<Model>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `WorkflowRun` that is related to this `Message`. */
  workflowRunByWorkflowRunId?: Maybe<WorkflowRun>;
};


/** The output of our create `Message` mutation. */
export type CreateMessagePayloadMessageEdgeArgs = {
  orderBy?: InputMaybe<Array<MessagesOrderBy>>;
};

/** All input for the create `MessageSource` mutation. */
export type CreateMessageSourceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `MessageSource` to be created by this mutation. */
  messageSource: MessageSourceInput;
};

/** The output of our create `MessageSource` mutation. */
export type CreateMessageSourcePayload = {
  __typename?: 'CreateMessageSourcePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Message` that is related to this `MessageSource`. */
  messageByMessageId?: Maybe<Message>;
  /** The `MessageSource` that was created by this mutation. */
  messageSource?: Maybe<MessageSource>;
  /** An edge for our `MessageSource`. May be used by Relay 1. */
  messageSourceEdge?: Maybe<MessageSourcesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `MessageSource` mutation. */
export type CreateMessageSourcePayloadMessageSourceEdgeArgs = {
  orderBy?: InputMaybe<Array<MessageSourcesOrderBy>>;
};

/** All input for the create `Model` mutation. */
export type CreateModelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Model` to be created by this mutation. */
  model: ModelInput;
};

/** The output of our create `Model` mutation. */
export type CreateModelPayload = {
  __typename?: 'CreateModelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Model` that was created by this mutation. */
  model?: Maybe<Model>;
  /** An edge for our `Model`. May be used by Relay 1. */
  modelEdge?: Maybe<ModelsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Model` mutation. */
export type CreateModelPayloadModelEdgeArgs = {
  orderBy?: InputMaybe<Array<ModelsOrderBy>>;
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

/** All input for the create `StepRun` mutation. */
export type CreateStepRunInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `StepRun` to be created by this mutation. */
  stepRun: StepRunInput;
};

/** The output of our create `StepRun` mutation. */
export type CreateStepRunPayload = {
  __typename?: 'CreateStepRunPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `StepRun` that was created by this mutation. */
  stepRun?: Maybe<StepRun>;
  /** An edge for our `StepRun`. May be used by Relay 1. */
  stepRunEdge?: Maybe<StepRunsEdge>;
  /** Reads a single `WorkflowRun` that is related to this `StepRun`. */
  workflowRunByWorkflowRunId?: Maybe<WorkflowRun>;
};


/** The output of our create `StepRun` mutation. */
export type CreateStepRunPayloadStepRunEdgeArgs = {
  orderBy?: InputMaybe<Array<StepRunsOrderBy>>;
};

/** All input for the create `Tool` mutation. */
export type CreateToolInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Tool` to be created by this mutation. */
  tool: ToolInput;
};

/** The output of our create `Tool` mutation. */
export type CreateToolPayload = {
  __typename?: 'CreateToolPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Tool` that was created by this mutation. */
  tool?: Maybe<Tool>;
  /** An edge for our `Tool`. May be used by Relay 1. */
  toolEdge?: Maybe<ToolsEdge>;
  /** Reads a single `User` that is related to this `Tool`. */
  userByUserId?: Maybe<User>;
};


/** The output of our create `Tool` mutation. */
export type CreateToolPayloadToolEdgeArgs = {
  orderBy?: InputMaybe<Array<ToolsOrderBy>>;
};

/** All input for the create `UsageRecord` mutation. */
export type CreateUsageRecordInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `UsageRecord` to be created by this mutation. */
  usageRecord: UsageRecordInput;
};

/** The output of our create `UsageRecord` mutation. */
export type CreateUsageRecordPayload = {
  __typename?: 'CreateUsageRecordPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Message` that is related to this `UsageRecord`. */
  messageByMessageId?: Maybe<Message>;
  /** Reads a single `Model` that is related to this `UsageRecord`. */
  modelByModelId?: Maybe<Model>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `UsageRecord` that was created by this mutation. */
  usageRecord?: Maybe<UsageRecord>;
  /** An edge for our `UsageRecord`. May be used by Relay 1. */
  usageRecordEdge?: Maybe<UsageRecordsEdge>;
  /** Reads a single `User` that is related to this `UsageRecord`. */
  userByUserId?: Maybe<User>;
  /** Reads a single `WorkflowChatMessage` that is related to this `UsageRecord`. */
  workflowChatMessageByWorkflowChatMessageId?: Maybe<WorkflowChatMessage>;
};


/** The output of our create `UsageRecord` mutation. */
export type CreateUsageRecordPayloadUsageRecordEdgeArgs = {
  orderBy?: InputMaybe<Array<UsageRecordsOrderBy>>;
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

/** All input for the create `WorkflowChatMessage` mutation. */
export type CreateWorkflowChatMessageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `WorkflowChatMessage` to be created by this mutation. */
  workflowChatMessage: WorkflowChatMessageInput;
};

/** The output of our create `WorkflowChatMessage` mutation. */
export type CreateWorkflowChatMessagePayload = {
  __typename?: 'CreateWorkflowChatMessagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Model` that is related to this `WorkflowChatMessage`. */
  modelByModelId?: Maybe<Model>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Workflow` that is related to this `WorkflowChatMessage`. */
  workflowByWorkflowId?: Maybe<Workflow>;
  /** The `WorkflowChatMessage` that was created by this mutation. */
  workflowChatMessage?: Maybe<WorkflowChatMessage>;
  /** An edge for our `WorkflowChatMessage`. May be used by Relay 1. */
  workflowChatMessageEdge?: Maybe<WorkflowChatMessagesEdge>;
};


/** The output of our create `WorkflowChatMessage` mutation. */
export type CreateWorkflowChatMessagePayloadWorkflowChatMessageEdgeArgs = {
  orderBy?: InputMaybe<Array<WorkflowChatMessagesOrderBy>>;
};

/** All input for the create `Workflow` mutation. */
export type CreateWorkflowInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Workflow` to be created by this mutation. */
  workflow: WorkflowInput;
};

/** The output of our create `Workflow` mutation. */
export type CreateWorkflowPayload = {
  __typename?: 'CreateWorkflowPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Workflow`. */
  userByUserId?: Maybe<User>;
  /** The `Workflow` that was created by this mutation. */
  workflow?: Maybe<Workflow>;
  /** An edge for our `Workflow`. May be used by Relay 1. */
  workflowEdge?: Maybe<WorkflowsEdge>;
};


/** The output of our create `Workflow` mutation. */
export type CreateWorkflowPayloadWorkflowEdgeArgs = {
  orderBy?: InputMaybe<Array<WorkflowsOrderBy>>;
};

/** All input for the create `WorkflowRun` mutation. */
export type CreateWorkflowRunInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `WorkflowRun` to be created by this mutation. */
  workflowRun: WorkflowRunInput;
};

/** The output of our create `WorkflowRun` mutation. */
export type CreateWorkflowRunPayload = {
  __typename?: 'CreateWorkflowRunPayload';
  /** Reads a single `Chat` that is related to this `WorkflowRun`. */
  chatByChatId?: Maybe<Chat>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Message` that is related to this `WorkflowRun`. */
  messageByTriggerMessageId?: Maybe<Message>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `WorkflowRun` that was created by this mutation. */
  workflowRun?: Maybe<WorkflowRun>;
  /** An edge for our `WorkflowRun`. May be used by Relay 1. */
  workflowRunEdge?: Maybe<WorkflowRunsEdge>;
  /** Reads a single `WorkflowVersion` that is related to this `WorkflowRun`. */
  workflowVersionByWorkflowVersionId?: Maybe<WorkflowVersion>;
};


/** The output of our create `WorkflowRun` mutation. */
export type CreateWorkflowRunPayloadWorkflowRunEdgeArgs = {
  orderBy?: InputMaybe<Array<WorkflowRunsOrderBy>>;
};

/** All input for the create `WorkflowVersion` mutation. */
export type CreateWorkflowVersionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `WorkflowVersion` to be created by this mutation. */
  workflowVersion: WorkflowVersionInput;
};

/** The output of our create `WorkflowVersion` mutation. */
export type CreateWorkflowVersionPayload = {
  __typename?: 'CreateWorkflowVersionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Workflow` that is related to this `WorkflowVersion`. */
  workflowByWorkflowId?: Maybe<Workflow>;
  /** The `WorkflowVersion` that was created by this mutation. */
  workflowVersion?: Maybe<WorkflowVersion>;
  /** An edge for our `WorkflowVersion`. May be used by Relay 1. */
  workflowVersionEdge?: Maybe<WorkflowVersionsEdge>;
};


/** The output of our create `WorkflowVersion` mutation. */
export type CreateWorkflowVersionPayloadWorkflowVersionEdgeArgs = {
  orderBy?: InputMaybe<Array<WorkflowVersionsOrderBy>>;
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

/** All input for the `deleteChatById` mutation. */
export type DeleteChatByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** All input for the `deleteChat` mutation. */
export type DeleteChatInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Chat` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `Chat` mutation. */
export type DeleteChatPayload = {
  __typename?: 'DeleteChatPayload';
  /** The `Chat` that was deleted by this mutation. */
  chat?: Maybe<Chat>;
  /** An edge for our `Chat`. May be used by Relay 1. */
  chatEdge?: Maybe<ChatsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedChatId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Chat`. */
  userByUserId?: Maybe<User>;
};


/** The output of our delete `Chat` mutation. */
export type DeleteChatPayloadChatEdgeArgs = {
  orderBy?: InputMaybe<Array<ChatsOrderBy>>;
};

/** All input for the `deleteMessageById` mutation. */
export type DeleteMessageByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** All input for the `deleteMessage` mutation. */
export type DeleteMessageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Message` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `Message` mutation. */
export type DeleteMessagePayload = {
  __typename?: 'DeleteMessagePayload';
  /** Reads a single `Chat` that is related to this `Message`. */
  chatByChatId?: Maybe<Chat>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedMessageId?: Maybe<Scalars['ID']['output']>;
  /** The `Message` that was deleted by this mutation. */
  message?: Maybe<Message>;
  /** An edge for our `Message`. May be used by Relay 1. */
  messageEdge?: Maybe<MessagesEdge>;
  /** Reads a single `Model` that is related to this `Message`. */
  modelByModelId?: Maybe<Model>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `WorkflowRun` that is related to this `Message`. */
  workflowRunByWorkflowRunId?: Maybe<WorkflowRun>;
};


/** The output of our delete `Message` mutation. */
export type DeleteMessagePayloadMessageEdgeArgs = {
  orderBy?: InputMaybe<Array<MessagesOrderBy>>;
};

/** All input for the `deleteMessageSourceById` mutation. */
export type DeleteMessageSourceByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** All input for the `deleteMessageSourceByMessageIdAndPosition` mutation. */
export type DeleteMessageSourceByMessageIdAndPositionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  messageId: Scalars['UUID']['input'];
  position: Scalars['Int']['input'];
};

/** All input for the `deleteMessageSource` mutation. */
export type DeleteMessageSourceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `MessageSource` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `MessageSource` mutation. */
export type DeleteMessageSourcePayload = {
  __typename?: 'DeleteMessageSourcePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedMessageSourceId?: Maybe<Scalars['ID']['output']>;
  /** Reads a single `Message` that is related to this `MessageSource`. */
  messageByMessageId?: Maybe<Message>;
  /** The `MessageSource` that was deleted by this mutation. */
  messageSource?: Maybe<MessageSource>;
  /** An edge for our `MessageSource`. May be used by Relay 1. */
  messageSourceEdge?: Maybe<MessageSourcesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `MessageSource` mutation. */
export type DeleteMessageSourcePayloadMessageSourceEdgeArgs = {
  orderBy?: InputMaybe<Array<MessageSourcesOrderBy>>;
};

/** All input for the `deleteModelById` mutation. */
export type DeleteModelByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};

/** All input for the `deleteModel` mutation. */
export type DeleteModelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Model` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `Model` mutation. */
export type DeleteModelPayload = {
  __typename?: 'DeleteModelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedModelId?: Maybe<Scalars['ID']['output']>;
  /** The `Model` that was deleted by this mutation. */
  model?: Maybe<Model>;
  /** An edge for our `Model`. May be used by Relay 1. */
  modelEdge?: Maybe<ModelsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Model` mutation. */
export type DeleteModelPayloadModelEdgeArgs = {
  orderBy?: InputMaybe<Array<ModelsOrderBy>>;
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

/** All input for the `deleteStepRunById` mutation. */
export type DeleteStepRunByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** All input for the `deleteStepRunByWorkflowRunIdAndStepId` mutation. */
export type DeleteStepRunByWorkflowRunIdAndStepIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  stepId: Scalars['String']['input'];
  workflowRunId: Scalars['UUID']['input'];
};

/** All input for the `deleteStepRun` mutation. */
export type DeleteStepRunInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `StepRun` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `StepRun` mutation. */
export type DeleteStepRunPayload = {
  __typename?: 'DeleteStepRunPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedStepRunId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `StepRun` that was deleted by this mutation. */
  stepRun?: Maybe<StepRun>;
  /** An edge for our `StepRun`. May be used by Relay 1. */
  stepRunEdge?: Maybe<StepRunsEdge>;
  /** Reads a single `WorkflowRun` that is related to this `StepRun`. */
  workflowRunByWorkflowRunId?: Maybe<WorkflowRun>;
};


/** The output of our delete `StepRun` mutation. */
export type DeleteStepRunPayloadStepRunEdgeArgs = {
  orderBy?: InputMaybe<Array<StepRunsOrderBy>>;
};

/** All input for the `deleteToolById` mutation. */
export type DeleteToolByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** All input for the `deleteTool` mutation. */
export type DeleteToolInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Tool` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `Tool` mutation. */
export type DeleteToolPayload = {
  __typename?: 'DeleteToolPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedToolId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Tool` that was deleted by this mutation. */
  tool?: Maybe<Tool>;
  /** An edge for our `Tool`. May be used by Relay 1. */
  toolEdge?: Maybe<ToolsEdge>;
  /** Reads a single `User` that is related to this `Tool`. */
  userByUserId?: Maybe<User>;
};


/** The output of our delete `Tool` mutation. */
export type DeleteToolPayloadToolEdgeArgs = {
  orderBy?: InputMaybe<Array<ToolsOrderBy>>;
};

/** All input for the `deleteUsageRecordById` mutation. */
export type DeleteUsageRecordByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** All input for the `deleteUsageRecord` mutation. */
export type DeleteUsageRecordInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `UsageRecord` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `UsageRecord` mutation. */
export type DeleteUsageRecordPayload = {
  __typename?: 'DeleteUsageRecordPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedUsageRecordId?: Maybe<Scalars['ID']['output']>;
  /** Reads a single `Message` that is related to this `UsageRecord`. */
  messageByMessageId?: Maybe<Message>;
  /** Reads a single `Model` that is related to this `UsageRecord`. */
  modelByModelId?: Maybe<Model>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `UsageRecord` that was deleted by this mutation. */
  usageRecord?: Maybe<UsageRecord>;
  /** An edge for our `UsageRecord`. May be used by Relay 1. */
  usageRecordEdge?: Maybe<UsageRecordsEdge>;
  /** Reads a single `User` that is related to this `UsageRecord`. */
  userByUserId?: Maybe<User>;
  /** Reads a single `WorkflowChatMessage` that is related to this `UsageRecord`. */
  workflowChatMessageByWorkflowChatMessageId?: Maybe<WorkflowChatMessage>;
};


/** The output of our delete `UsageRecord` mutation. */
export type DeleteUsageRecordPayloadUsageRecordEdgeArgs = {
  orderBy?: InputMaybe<Array<UsageRecordsOrderBy>>;
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

/** All input for the `deleteWorkflowById` mutation. */
export type DeleteWorkflowByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** All input for the `deleteWorkflowChatMessageById` mutation. */
export type DeleteWorkflowChatMessageByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** All input for the `deleteWorkflowChatMessage` mutation. */
export type DeleteWorkflowChatMessageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `WorkflowChatMessage` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `WorkflowChatMessage` mutation. */
export type DeleteWorkflowChatMessagePayload = {
  __typename?: 'DeleteWorkflowChatMessagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedWorkflowChatMessageId?: Maybe<Scalars['ID']['output']>;
  /** Reads a single `Model` that is related to this `WorkflowChatMessage`. */
  modelByModelId?: Maybe<Model>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Workflow` that is related to this `WorkflowChatMessage`. */
  workflowByWorkflowId?: Maybe<Workflow>;
  /** The `WorkflowChatMessage` that was deleted by this mutation. */
  workflowChatMessage?: Maybe<WorkflowChatMessage>;
  /** An edge for our `WorkflowChatMessage`. May be used by Relay 1. */
  workflowChatMessageEdge?: Maybe<WorkflowChatMessagesEdge>;
};


/** The output of our delete `WorkflowChatMessage` mutation. */
export type DeleteWorkflowChatMessagePayloadWorkflowChatMessageEdgeArgs = {
  orderBy?: InputMaybe<Array<WorkflowChatMessagesOrderBy>>;
};

/** All input for the `deleteWorkflow` mutation. */
export type DeleteWorkflowInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Workflow` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `Workflow` mutation. */
export type DeleteWorkflowPayload = {
  __typename?: 'DeleteWorkflowPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedWorkflowId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Workflow`. */
  userByUserId?: Maybe<User>;
  /** The `Workflow` that was deleted by this mutation. */
  workflow?: Maybe<Workflow>;
  /** An edge for our `Workflow`. May be used by Relay 1. */
  workflowEdge?: Maybe<WorkflowsEdge>;
};


/** The output of our delete `Workflow` mutation. */
export type DeleteWorkflowPayloadWorkflowEdgeArgs = {
  orderBy?: InputMaybe<Array<WorkflowsOrderBy>>;
};

/** All input for the `deleteWorkflowRunById` mutation. */
export type DeleteWorkflowRunByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** All input for the `deleteWorkflowRun` mutation. */
export type DeleteWorkflowRunInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `WorkflowRun` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `WorkflowRun` mutation. */
export type DeleteWorkflowRunPayload = {
  __typename?: 'DeleteWorkflowRunPayload';
  /** Reads a single `Chat` that is related to this `WorkflowRun`. */
  chatByChatId?: Maybe<Chat>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedWorkflowRunId?: Maybe<Scalars['ID']['output']>;
  /** Reads a single `Message` that is related to this `WorkflowRun`. */
  messageByTriggerMessageId?: Maybe<Message>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `WorkflowRun` that was deleted by this mutation. */
  workflowRun?: Maybe<WorkflowRun>;
  /** An edge for our `WorkflowRun`. May be used by Relay 1. */
  workflowRunEdge?: Maybe<WorkflowRunsEdge>;
  /** Reads a single `WorkflowVersion` that is related to this `WorkflowRun`. */
  workflowVersionByWorkflowVersionId?: Maybe<WorkflowVersion>;
};


/** The output of our delete `WorkflowRun` mutation. */
export type DeleteWorkflowRunPayloadWorkflowRunEdgeArgs = {
  orderBy?: InputMaybe<Array<WorkflowRunsOrderBy>>;
};

/** All input for the `deleteWorkflowVersionById` mutation. */
export type DeleteWorkflowVersionByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** All input for the `deleteWorkflowVersionByWorkflowIdAndVersionNumber` mutation. */
export type DeleteWorkflowVersionByWorkflowIdAndVersionNumberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  versionNumber: Scalars['Int']['input'];
  workflowId: Scalars['UUID']['input'];
};

/** All input for the `deleteWorkflowVersion` mutation. */
export type DeleteWorkflowVersionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `WorkflowVersion` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `WorkflowVersion` mutation. */
export type DeleteWorkflowVersionPayload = {
  __typename?: 'DeleteWorkflowVersionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedWorkflowVersionId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Workflow` that is related to this `WorkflowVersion`. */
  workflowByWorkflowId?: Maybe<Workflow>;
  /** The `WorkflowVersion` that was deleted by this mutation. */
  workflowVersion?: Maybe<WorkflowVersion>;
  /** An edge for our `WorkflowVersion`. May be used by Relay 1. */
  workflowVersionEdge?: Maybe<WorkflowVersionsEdge>;
};


/** The output of our delete `WorkflowVersion` mutation. */
export type DeleteWorkflowVersionPayloadWorkflowVersionEdgeArgs = {
  orderBy?: InputMaybe<Array<WorkflowVersionsOrderBy>>;
};

export type Message = Node & {
  __typename?: 'Message';
  /** Reads a single `Chat` that is related to this `Message`. */
  chatByChatId?: Maybe<Chat>;
  chatId: Scalars['UUID']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['Datetime']['output'];
  id: Scalars['UUID']['output'];
  /** Reads and enables pagination through a set of `MessageSource`. */
  messageSourcesByMessageId: MessageSourcesConnection;
  /** Reads a single `Model` that is related to this `Message`. */
  modelByModelId?: Maybe<Model>;
  modelId?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  role: MessageRole;
  /** Reads and enables pagination through a set of `UsageRecord`. */
  usageRecordsByMessageId: UsageRecordsConnection;
  /** Reads a single `WorkflowRun` that is related to this `Message`. */
  workflowRunByWorkflowRunId?: Maybe<WorkflowRun>;
  workflowRunId?: Maybe<Scalars['UUID']['output']>;
  /** Reads and enables pagination through a set of `WorkflowRun`. */
  workflowRunsByTriggerMessageId: WorkflowRunsConnection;
};


export type MessageMessageSourcesByMessageIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MessageSourceCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MessageSourcesOrderBy>>;
};


export type MessageUsageRecordsByMessageIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UsageRecordCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsageRecordsOrderBy>>;
};


export type MessageWorkflowRunsByTriggerMessageIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<WorkflowRunCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkflowRunsOrderBy>>;
};

/** A condition to be used against `Message` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type MessageCondition = {
  /** Checks for equality with the object’s `chatId` field. */
  chatId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `content` field. */
  content?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `modelId` field. */
  modelId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `role` field. */
  role?: InputMaybe<MessageRole>;
  /** Checks for equality with the object’s `workflowRunId` field. */
  workflowRunId?: InputMaybe<Scalars['UUID']['input']>;
};

/** An input for mutations affecting `Message` */
export type MessageInput = {
  chatId: Scalars['UUID']['input'];
  content: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  modelId?: InputMaybe<Scalars['String']['input']>;
  role: MessageRole;
  workflowRunId?: InputMaybe<Scalars['UUID']['input']>;
};

/** Represents an update to a `Message`. Fields that are set will be updated. */
export type MessagePatch = {
  chatId?: InputMaybe<Scalars['UUID']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  modelId?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<MessageRole>;
  workflowRunId?: InputMaybe<Scalars['UUID']['input']>;
};

export enum MessageRole {
  Assistant = 'ASSISTANT',
  System = 'SYSTEM',
  User = 'USER'
}

export type MessageSource = Node & {
  __typename?: 'MessageSource';
  createdAt: Scalars['Datetime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  /** Reads a single `Message` that is related to this `MessageSource`. */
  messageByMessageId?: Maybe<Message>;
  messageId: Scalars['UUID']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  position: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

/**
 * A condition to be used against `MessageSource` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type MessageSourceCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `messageId` field. */
  messageId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `position` field. */
  position?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `url` field. */
  url?: InputMaybe<Scalars['String']['input']>;
};

/** An input for mutations affecting `MessageSource` */
export type MessageSourceInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  messageId: Scalars['UUID']['input'];
  position?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

/** Represents an update to a `MessageSource`. Fields that are set will be updated. */
export type MessageSourcePatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  messageId?: InputMaybe<Scalars['UUID']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `MessageSource` values. */
export type MessageSourcesConnection = {
  __typename?: 'MessageSourcesConnection';
  /** A list of edges which contains the `MessageSource` and cursor to aid in pagination. */
  edges: Array<MessageSourcesEdge>;
  /** A list of `MessageSource` objects. */
  nodes: Array<Maybe<MessageSource>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `MessageSource` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `MessageSource` edge in the connection. */
export type MessageSourcesEdge = {
  __typename?: 'MessageSourcesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `MessageSource` at the end of the edge. */
  node?: Maybe<MessageSource>;
};

/** Methods to use when ordering `MessageSource`. */
export enum MessageSourcesOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  MessageIdAsc = 'MESSAGE_ID_ASC',
  MessageIdDesc = 'MESSAGE_ID_DESC',
  Natural = 'NATURAL',
  PositionAsc = 'POSITION_ASC',
  PositionDesc = 'POSITION_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UrlAsc = 'URL_ASC',
  UrlDesc = 'URL_DESC'
}

/** A connection to a list of `Message` values. */
export type MessagesConnection = {
  __typename?: 'MessagesConnection';
  /** A list of edges which contains the `Message` and cursor to aid in pagination. */
  edges: Array<MessagesEdge>;
  /** A list of `Message` objects. */
  nodes: Array<Maybe<Message>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Message` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Message` edge in the connection. */
export type MessagesEdge = {
  __typename?: 'MessagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Message` at the end of the edge. */
  node?: Maybe<Message>;
};

/** Methods to use when ordering `Message`. */
export enum MessagesOrderBy {
  ChatIdAsc = 'CHAT_ID_ASC',
  ChatIdDesc = 'CHAT_ID_DESC',
  ContentAsc = 'CONTENT_ASC',
  ContentDesc = 'CONTENT_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ModelIdAsc = 'MODEL_ID_ASC',
  ModelIdDesc = 'MODEL_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RoleAsc = 'ROLE_ASC',
  RoleDesc = 'ROLE_DESC',
  WorkflowRunIdAsc = 'WORKFLOW_RUN_ID_ASC',
  WorkflowRunIdDesc = 'WORKFLOW_RUN_ID_DESC'
}

export type Model = Node & {
  __typename?: 'Model';
  createdAt: Scalars['Datetime']['output'];
  id: Scalars['String']['output'];
  inputPricePerMillion?: Maybe<Scalars['BigFloat']['output']>;
  isActive: Scalars['Boolean']['output'];
  /** Reads and enables pagination through a set of `Message`. */
  messagesByModelId: MessagesConnection;
  name: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  outputPricePerMillion?: Maybe<Scalars['BigFloat']['output']>;
  provider: Scalars['String']['output'];
  updatedAt: Scalars['Datetime']['output'];
  /** Reads and enables pagination through a set of `UsageRecord`. */
  usageRecordsByModelId: UsageRecordsConnection;
  /** Reads and enables pagination through a set of `WorkflowChatMessage`. */
  workflowChatMessagesByModelId: WorkflowChatMessagesConnection;
};


export type ModelMessagesByModelIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MessageCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MessagesOrderBy>>;
};


export type ModelUsageRecordsByModelIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UsageRecordCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsageRecordsOrderBy>>;
};


export type ModelWorkflowChatMessagesByModelIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<WorkflowChatMessageCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkflowChatMessagesOrderBy>>;
};

/** A condition to be used against `Model` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ModelCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `inputPricePerMillion` field. */
  inputPricePerMillion?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Checks for equality with the object’s `isActive` field. */
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `outputPricePerMillion` field. */
  outputPricePerMillion?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Checks for equality with the object’s `provider` field. */
  provider?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** An input for mutations affecting `Model` */
export type ModelInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  id: Scalars['String']['input'];
  inputPricePerMillion?: InputMaybe<Scalars['BigFloat']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  outputPricePerMillion?: InputMaybe<Scalars['BigFloat']['input']>;
  provider: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Represents an update to a `Model`. Fields that are set will be updated. */
export type ModelPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  inputPricePerMillion?: InputMaybe<Scalars['BigFloat']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  outputPricePerMillion?: InputMaybe<Scalars['BigFloat']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `Model` values. */
export type ModelsConnection = {
  __typename?: 'ModelsConnection';
  /** A list of edges which contains the `Model` and cursor to aid in pagination. */
  edges: Array<ModelsEdge>;
  /** A list of `Model` objects. */
  nodes: Array<Maybe<Model>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Model` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Model` edge in the connection. */
export type ModelsEdge = {
  __typename?: 'ModelsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Model` at the end of the edge. */
  node?: Maybe<Model>;
};

/** Methods to use when ordering `Model`. */
export enum ModelsOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  InputPricePerMillionAsc = 'INPUT_PRICE_PER_MILLION_ASC',
  InputPricePerMillionDesc = 'INPUT_PRICE_PER_MILLION_DESC',
  IsActiveAsc = 'IS_ACTIVE_ASC',
  IsActiveDesc = 'IS_ACTIVE_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  OutputPricePerMillionAsc = 'OUTPUT_PRICE_PER_MILLION_ASC',
  OutputPricePerMillionDesc = 'OUTPUT_PRICE_PER_MILLION_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProviderAsc = 'PROVIDER_ASC',
  ProviderDesc = 'PROVIDER_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `Account`. */
  createAccount?: Maybe<CreateAccountPayload>;
  /** Creates a single `Chat`. */
  createChat?: Maybe<CreateChatPayload>;
  /** Creates a single `Message`. */
  createMessage?: Maybe<CreateMessagePayload>;
  /** Creates a single `MessageSource`. */
  createMessageSource?: Maybe<CreateMessageSourcePayload>;
  /** Creates a single `Model`. */
  createModel?: Maybe<CreateModelPayload>;
  /** Creates a single `Pgmigration`. */
  createPgmigration?: Maybe<CreatePgmigrationPayload>;
  /** Creates a single `Session`. */
  createSession?: Maybe<CreateSessionPayload>;
  /** Creates a single `StepRun`. */
  createStepRun?: Maybe<CreateStepRunPayload>;
  /** Creates a single `Tool`. */
  createTool?: Maybe<CreateToolPayload>;
  /** Creates a single `UsageRecord`. */
  createUsageRecord?: Maybe<CreateUsageRecordPayload>;
  /** Creates a single `User`. */
  createUser?: Maybe<CreateUserPayload>;
  /** Creates a single `Verification`. */
  createVerification?: Maybe<CreateVerificationPayload>;
  /** Creates a single `Workflow`. */
  createWorkflow?: Maybe<CreateWorkflowPayload>;
  /** Creates a single `WorkflowChatMessage`. */
  createWorkflowChatMessage?: Maybe<CreateWorkflowChatMessagePayload>;
  /** Creates a single `WorkflowRun`. */
  createWorkflowRun?: Maybe<CreateWorkflowRunPayload>;
  /** Creates a single `WorkflowVersion`. */
  createWorkflowVersion?: Maybe<CreateWorkflowVersionPayload>;
  /** Deletes a single `Account` using its globally unique id. */
  deleteAccount?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Account` using a unique key. */
  deleteAccountById?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Chat` using its globally unique id. */
  deleteChat?: Maybe<DeleteChatPayload>;
  /** Deletes a single `Chat` using a unique key. */
  deleteChatById?: Maybe<DeleteChatPayload>;
  /** Deletes a single `Message` using its globally unique id. */
  deleteMessage?: Maybe<DeleteMessagePayload>;
  /** Deletes a single `Message` using a unique key. */
  deleteMessageById?: Maybe<DeleteMessagePayload>;
  /** Deletes a single `MessageSource` using its globally unique id. */
  deleteMessageSource?: Maybe<DeleteMessageSourcePayload>;
  /** Deletes a single `MessageSource` using a unique key. */
  deleteMessageSourceById?: Maybe<DeleteMessageSourcePayload>;
  /** Deletes a single `MessageSource` using a unique key. */
  deleteMessageSourceByMessageIdAndPosition?: Maybe<DeleteMessageSourcePayload>;
  /** Deletes a single `Model` using its globally unique id. */
  deleteModel?: Maybe<DeleteModelPayload>;
  /** Deletes a single `Model` using a unique key. */
  deleteModelById?: Maybe<DeleteModelPayload>;
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
  /** Deletes a single `StepRun` using its globally unique id. */
  deleteStepRun?: Maybe<DeleteStepRunPayload>;
  /** Deletes a single `StepRun` using a unique key. */
  deleteStepRunById?: Maybe<DeleteStepRunPayload>;
  /** Deletes a single `StepRun` using a unique key. */
  deleteStepRunByWorkflowRunIdAndStepId?: Maybe<DeleteStepRunPayload>;
  /** Deletes a single `Tool` using its globally unique id. */
  deleteTool?: Maybe<DeleteToolPayload>;
  /** Deletes a single `Tool` using a unique key. */
  deleteToolById?: Maybe<DeleteToolPayload>;
  /** Deletes a single `UsageRecord` using its globally unique id. */
  deleteUsageRecord?: Maybe<DeleteUsageRecordPayload>;
  /** Deletes a single `UsageRecord` using a unique key. */
  deleteUsageRecordById?: Maybe<DeleteUsageRecordPayload>;
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
  /** Deletes a single `Workflow` using its globally unique id. */
  deleteWorkflow?: Maybe<DeleteWorkflowPayload>;
  /** Deletes a single `Workflow` using a unique key. */
  deleteWorkflowById?: Maybe<DeleteWorkflowPayload>;
  /** Deletes a single `WorkflowChatMessage` using its globally unique id. */
  deleteWorkflowChatMessage?: Maybe<DeleteWorkflowChatMessagePayload>;
  /** Deletes a single `WorkflowChatMessage` using a unique key. */
  deleteWorkflowChatMessageById?: Maybe<DeleteWorkflowChatMessagePayload>;
  /** Deletes a single `WorkflowRun` using its globally unique id. */
  deleteWorkflowRun?: Maybe<DeleteWorkflowRunPayload>;
  /** Deletes a single `WorkflowRun` using a unique key. */
  deleteWorkflowRunById?: Maybe<DeleteWorkflowRunPayload>;
  /** Deletes a single `WorkflowVersion` using its globally unique id. */
  deleteWorkflowVersion?: Maybe<DeleteWorkflowVersionPayload>;
  /** Deletes a single `WorkflowVersion` using a unique key. */
  deleteWorkflowVersionById?: Maybe<DeleteWorkflowVersionPayload>;
  /** Deletes a single `WorkflowVersion` using a unique key. */
  deleteWorkflowVersionByWorkflowIdAndVersionNumber?: Maybe<DeleteWorkflowVersionPayload>;
  /** Updates a single `Account` using its globally unique id and a patch. */
  updateAccount?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Account` using a unique key and a patch. */
  updateAccountById?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Chat` using its globally unique id and a patch. */
  updateChat?: Maybe<UpdateChatPayload>;
  /** Updates a single `Chat` using a unique key and a patch. */
  updateChatById?: Maybe<UpdateChatPayload>;
  /** Updates a single `Message` using its globally unique id and a patch. */
  updateMessage?: Maybe<UpdateMessagePayload>;
  /** Updates a single `Message` using a unique key and a patch. */
  updateMessageById?: Maybe<UpdateMessagePayload>;
  /** Updates a single `MessageSource` using its globally unique id and a patch. */
  updateMessageSource?: Maybe<UpdateMessageSourcePayload>;
  /** Updates a single `MessageSource` using a unique key and a patch. */
  updateMessageSourceById?: Maybe<UpdateMessageSourcePayload>;
  /** Updates a single `MessageSource` using a unique key and a patch. */
  updateMessageSourceByMessageIdAndPosition?: Maybe<UpdateMessageSourcePayload>;
  /** Updates a single `Model` using its globally unique id and a patch. */
  updateModel?: Maybe<UpdateModelPayload>;
  /** Updates a single `Model` using a unique key and a patch. */
  updateModelById?: Maybe<UpdateModelPayload>;
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
  /** Updates a single `StepRun` using its globally unique id and a patch. */
  updateStepRun?: Maybe<UpdateStepRunPayload>;
  /** Updates a single `StepRun` using a unique key and a patch. */
  updateStepRunById?: Maybe<UpdateStepRunPayload>;
  /** Updates a single `StepRun` using a unique key and a patch. */
  updateStepRunByWorkflowRunIdAndStepId?: Maybe<UpdateStepRunPayload>;
  /** Updates a single `Tool` using its globally unique id and a patch. */
  updateTool?: Maybe<UpdateToolPayload>;
  /** Updates a single `Tool` using a unique key and a patch. */
  updateToolById?: Maybe<UpdateToolPayload>;
  /** Updates a single `UsageRecord` using its globally unique id and a patch. */
  updateUsageRecord?: Maybe<UpdateUsageRecordPayload>;
  /** Updates a single `UsageRecord` using a unique key and a patch. */
  updateUsageRecordById?: Maybe<UpdateUsageRecordPayload>;
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
  /** Updates a single `Workflow` using its globally unique id and a patch. */
  updateWorkflow?: Maybe<UpdateWorkflowPayload>;
  /** Updates a single `Workflow` using a unique key and a patch. */
  updateWorkflowById?: Maybe<UpdateWorkflowPayload>;
  /** Updates a single `WorkflowChatMessage` using its globally unique id and a patch. */
  updateWorkflowChatMessage?: Maybe<UpdateWorkflowChatMessagePayload>;
  /** Updates a single `WorkflowChatMessage` using a unique key and a patch. */
  updateWorkflowChatMessageById?: Maybe<UpdateWorkflowChatMessagePayload>;
  /** Updates a single `WorkflowRun` using its globally unique id and a patch. */
  updateWorkflowRun?: Maybe<UpdateWorkflowRunPayload>;
  /** Updates a single `WorkflowRun` using a unique key and a patch. */
  updateWorkflowRunById?: Maybe<UpdateWorkflowRunPayload>;
  /** Updates a single `WorkflowVersion` using its globally unique id and a patch. */
  updateWorkflowVersion?: Maybe<UpdateWorkflowVersionPayload>;
  /** Updates a single `WorkflowVersion` using a unique key and a patch. */
  updateWorkflowVersionById?: Maybe<UpdateWorkflowVersionPayload>;
  /** Updates a single `WorkflowVersion` using a unique key and a patch. */
  updateWorkflowVersionByWorkflowIdAndVersionNumber?: Maybe<UpdateWorkflowVersionPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateChatArgs = {
  input: CreateChatInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMessageArgs = {
  input: CreateMessageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMessageSourceArgs = {
  input: CreateMessageSourceInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateModelArgs = {
  input: CreateModelInput;
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
export type MutationCreateStepRunArgs = {
  input: CreateStepRunInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateToolArgs = {
  input: CreateToolInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateUsageRecordArgs = {
  input: CreateUsageRecordInput;
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
export type MutationCreateWorkflowArgs = {
  input: CreateWorkflowInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateWorkflowChatMessageArgs = {
  input: CreateWorkflowChatMessageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateWorkflowRunArgs = {
  input: CreateWorkflowRunInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateWorkflowVersionArgs = {
  input: CreateWorkflowVersionInput;
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
export type MutationDeleteChatArgs = {
  input: DeleteChatInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteChatByIdArgs = {
  input: DeleteChatByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMessageArgs = {
  input: DeleteMessageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMessageByIdArgs = {
  input: DeleteMessageByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMessageSourceArgs = {
  input: DeleteMessageSourceInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMessageSourceByIdArgs = {
  input: DeleteMessageSourceByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMessageSourceByMessageIdAndPositionArgs = {
  input: DeleteMessageSourceByMessageIdAndPositionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteModelArgs = {
  input: DeleteModelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteModelByIdArgs = {
  input: DeleteModelByIdInput;
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
export type MutationDeleteStepRunArgs = {
  input: DeleteStepRunInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteStepRunByIdArgs = {
  input: DeleteStepRunByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteStepRunByWorkflowRunIdAndStepIdArgs = {
  input: DeleteStepRunByWorkflowRunIdAndStepIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteToolArgs = {
  input: DeleteToolInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteToolByIdArgs = {
  input: DeleteToolByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUsageRecordArgs = {
  input: DeleteUsageRecordInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUsageRecordByIdArgs = {
  input: DeleteUsageRecordByIdInput;
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
export type MutationDeleteWorkflowArgs = {
  input: DeleteWorkflowInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWorkflowByIdArgs = {
  input: DeleteWorkflowByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWorkflowChatMessageArgs = {
  input: DeleteWorkflowChatMessageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWorkflowChatMessageByIdArgs = {
  input: DeleteWorkflowChatMessageByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWorkflowRunArgs = {
  input: DeleteWorkflowRunInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWorkflowRunByIdArgs = {
  input: DeleteWorkflowRunByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWorkflowVersionArgs = {
  input: DeleteWorkflowVersionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWorkflowVersionByIdArgs = {
  input: DeleteWorkflowVersionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWorkflowVersionByWorkflowIdAndVersionNumberArgs = {
  input: DeleteWorkflowVersionByWorkflowIdAndVersionNumberInput;
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
export type MutationUpdateChatArgs = {
  input: UpdateChatInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateChatByIdArgs = {
  input: UpdateChatByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMessageArgs = {
  input: UpdateMessageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMessageByIdArgs = {
  input: UpdateMessageByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMessageSourceArgs = {
  input: UpdateMessageSourceInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMessageSourceByIdArgs = {
  input: UpdateMessageSourceByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMessageSourceByMessageIdAndPositionArgs = {
  input: UpdateMessageSourceByMessageIdAndPositionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateModelArgs = {
  input: UpdateModelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateModelByIdArgs = {
  input: UpdateModelByIdInput;
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
export type MutationUpdateStepRunArgs = {
  input: UpdateStepRunInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateStepRunByIdArgs = {
  input: UpdateStepRunByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateStepRunByWorkflowRunIdAndStepIdArgs = {
  input: UpdateStepRunByWorkflowRunIdAndStepIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateToolArgs = {
  input: UpdateToolInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateToolByIdArgs = {
  input: UpdateToolByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUsageRecordArgs = {
  input: UpdateUsageRecordInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUsageRecordByIdArgs = {
  input: UpdateUsageRecordByIdInput;
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


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWorkflowArgs = {
  input: UpdateWorkflowInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWorkflowByIdArgs = {
  input: UpdateWorkflowByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWorkflowChatMessageArgs = {
  input: UpdateWorkflowChatMessageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWorkflowChatMessageByIdArgs = {
  input: UpdateWorkflowChatMessageByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWorkflowRunArgs = {
  input: UpdateWorkflowRunInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWorkflowRunByIdArgs = {
  input: UpdateWorkflowRunByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWorkflowVersionArgs = {
  input: UpdateWorkflowVersionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWorkflowVersionByIdArgs = {
  input: UpdateWorkflowVersionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWorkflowVersionByWorkflowIdAndVersionNumberArgs = {
  input: UpdateWorkflowVersionByWorkflowIdAndVersionNumberInput;
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
  /** Reads and enables pagination through a set of `Chat`. */
  allChats?: Maybe<ChatsConnection>;
  /** Reads and enables pagination through a set of `MessageSource`. */
  allMessageSources?: Maybe<MessageSourcesConnection>;
  /** Reads and enables pagination through a set of `Message`. */
  allMessages?: Maybe<MessagesConnection>;
  /** Reads and enables pagination through a set of `Model`. */
  allModels?: Maybe<ModelsConnection>;
  /** Reads and enables pagination through a set of `Pgmigration`. */
  allPgmigrations?: Maybe<PgmigrationsConnection>;
  /** Reads and enables pagination through a set of `Session`. */
  allSessions?: Maybe<SessionsConnection>;
  /** Reads and enables pagination through a set of `StepRun`. */
  allStepRuns?: Maybe<StepRunsConnection>;
  /** Reads and enables pagination through a set of `Tool`. */
  allTools?: Maybe<ToolsConnection>;
  /** Reads and enables pagination through a set of `UsageRecord`. */
  allUsageRecords?: Maybe<UsageRecordsConnection>;
  /** Reads and enables pagination through a set of `User`. */
  allUsers?: Maybe<UsersConnection>;
  /** Reads and enables pagination through a set of `Verification`. */
  allVerifications?: Maybe<VerificationsConnection>;
  /** Reads and enables pagination through a set of `WorkflowChatMessage`. */
  allWorkflowChatMessages?: Maybe<WorkflowChatMessagesConnection>;
  /** Reads and enables pagination through a set of `WorkflowRun`. */
  allWorkflowRuns?: Maybe<WorkflowRunsConnection>;
  /** Reads and enables pagination through a set of `WorkflowVersion`. */
  allWorkflowVersions?: Maybe<WorkflowVersionsConnection>;
  /** Reads and enables pagination through a set of `Workflow`. */
  allWorkflows?: Maybe<WorkflowsConnection>;
  /** Reads a single `Chat` using its globally unique `ID`. */
  chat?: Maybe<Chat>;
  chatById?: Maybe<Chat>;
  /** Reads a single `Message` using its globally unique `ID`. */
  message?: Maybe<Message>;
  messageById?: Maybe<Message>;
  /** Reads a single `MessageSource` using its globally unique `ID`. */
  messageSource?: Maybe<MessageSource>;
  messageSourceById?: Maybe<MessageSource>;
  messageSourceByMessageIdAndPosition?: Maybe<MessageSource>;
  /** Reads a single `Model` using its globally unique `ID`. */
  model?: Maybe<Model>;
  modelById?: Maybe<Model>;
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
  /** Reads a single `StepRun` using its globally unique `ID`. */
  stepRun?: Maybe<StepRun>;
  stepRunById?: Maybe<StepRun>;
  stepRunByWorkflowRunIdAndStepId?: Maybe<StepRun>;
  /** Reads a single `Tool` using its globally unique `ID`. */
  tool?: Maybe<Tool>;
  toolById?: Maybe<Tool>;
  /** Reads a single `UsageRecord` using its globally unique `ID`. */
  usageRecord?: Maybe<UsageRecord>;
  usageRecordById?: Maybe<UsageRecord>;
  /** Reads a single `User` using its globally unique `ID`. */
  user?: Maybe<User>;
  userByEmail?: Maybe<User>;
  userById?: Maybe<User>;
  /** Reads a single `Verification` using its globally unique `ID`. */
  verification?: Maybe<Verification>;
  verificationById?: Maybe<Verification>;
  /** Reads a single `Workflow` using its globally unique `ID`. */
  workflow?: Maybe<Workflow>;
  workflowById?: Maybe<Workflow>;
  /** Reads a single `WorkflowChatMessage` using its globally unique `ID`. */
  workflowChatMessage?: Maybe<WorkflowChatMessage>;
  workflowChatMessageById?: Maybe<WorkflowChatMessage>;
  /** Reads a single `WorkflowRun` using its globally unique `ID`. */
  workflowRun?: Maybe<WorkflowRun>;
  workflowRunById?: Maybe<WorkflowRun>;
  /** Reads a single `WorkflowVersion` using its globally unique `ID`. */
  workflowVersion?: Maybe<WorkflowVersion>;
  workflowVersionById?: Maybe<WorkflowVersion>;
  workflowVersionByWorkflowIdAndVersionNumber?: Maybe<WorkflowVersion>;
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
export type QueryAllChatsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ChatCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllMessageSourcesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MessageSourceCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MessageSourcesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllMessagesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MessageCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MessagesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ModelCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ModelsOrderBy>>;
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
export type QueryAllStepRunsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<StepRunCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<StepRunsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllToolsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ToolCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ToolsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllUsageRecordsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UsageRecordCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsageRecordsOrderBy>>;
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
export type QueryAllWorkflowChatMessagesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<WorkflowChatMessageCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkflowChatMessagesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllWorkflowRunsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<WorkflowRunCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkflowRunsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllWorkflowVersionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<WorkflowVersionCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkflowVersionsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllWorkflowsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<WorkflowCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkflowsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryChatArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryChatByIdArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMessageArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMessageByIdArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMessageSourceArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMessageSourceByIdArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMessageSourceByMessageIdAndPositionArgs = {
  messageId: Scalars['UUID']['input'];
  position: Scalars['Int']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryModelArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryModelByIdArgs = {
  id: Scalars['String']['input'];
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
export type QueryStepRunArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryStepRunByIdArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryStepRunByWorkflowRunIdAndStepIdArgs = {
  stepId: Scalars['String']['input'];
  workflowRunId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryToolArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryToolByIdArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUsageRecordArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUsageRecordByIdArgs = {
  id: Scalars['UUID']['input'];
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


/** The root query type which gives access points into the data universe. */
export type QueryWorkflowArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkflowByIdArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkflowChatMessageArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkflowChatMessageByIdArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkflowRunArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkflowRunByIdArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkflowVersionArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkflowVersionByIdArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkflowVersionByWorkflowIdAndVersionNumberArgs = {
  versionNumber: Scalars['Int']['input'];
  workflowId: Scalars['UUID']['input'];
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

export type StepRun = Node & {
  __typename?: 'StepRun';
  completedAt?: Maybe<Scalars['Datetime']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  logs?: Maybe<Scalars['JSON']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  output?: Maybe<Scalars['String']['output']>;
  startedAt?: Maybe<Scalars['Datetime']['output']>;
  status: StepRunStatus;
  stepId: Scalars['String']['output'];
  toolCalls?: Maybe<Scalars['JSON']['output']>;
  /** Reads a single `WorkflowRun` that is related to this `StepRun`. */
  workflowRunByWorkflowRunId?: Maybe<WorkflowRun>;
  workflowRunId: Scalars['UUID']['output'];
};

/** A condition to be used against `StepRun` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type StepRunCondition = {
  /** Checks for equality with the object’s `completedAt` field. */
  completedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `error` field. */
  error?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `logs` field. */
  logs?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `output` field. */
  output?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `startedAt` field. */
  startedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `status` field. */
  status?: InputMaybe<StepRunStatus>;
  /** Checks for equality with the object’s `stepId` field. */
  stepId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `toolCalls` field. */
  toolCalls?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `workflowRunId` field. */
  workflowRunId?: InputMaybe<Scalars['UUID']['input']>;
};

/** An input for mutations affecting `StepRun` */
export type StepRunInput = {
  completedAt?: InputMaybe<Scalars['Datetime']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  logs?: InputMaybe<Scalars['JSON']['input']>;
  output?: InputMaybe<Scalars['String']['input']>;
  startedAt?: InputMaybe<Scalars['Datetime']['input']>;
  status?: InputMaybe<StepRunStatus>;
  stepId: Scalars['String']['input'];
  toolCalls?: InputMaybe<Scalars['JSON']['input']>;
  workflowRunId: Scalars['UUID']['input'];
};

/** Represents an update to a `StepRun`. Fields that are set will be updated. */
export type StepRunPatch = {
  completedAt?: InputMaybe<Scalars['Datetime']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  logs?: InputMaybe<Scalars['JSON']['input']>;
  output?: InputMaybe<Scalars['String']['input']>;
  startedAt?: InputMaybe<Scalars['Datetime']['input']>;
  status?: InputMaybe<StepRunStatus>;
  stepId?: InputMaybe<Scalars['String']['input']>;
  toolCalls?: InputMaybe<Scalars['JSON']['input']>;
  workflowRunId?: InputMaybe<Scalars['UUID']['input']>;
};

export enum StepRunStatus {
  Cancelled = 'CANCELLED',
  Failed = 'FAILED',
  Passed = 'PASSED',
  Queued = 'QUEUED',
  Running = 'RUNNING'
}

/** A connection to a list of `StepRun` values. */
export type StepRunsConnection = {
  __typename?: 'StepRunsConnection';
  /** A list of edges which contains the `StepRun` and cursor to aid in pagination. */
  edges: Array<StepRunsEdge>;
  /** A list of `StepRun` objects. */
  nodes: Array<Maybe<StepRun>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `StepRun` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `StepRun` edge in the connection. */
export type StepRunsEdge = {
  __typename?: 'StepRunsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `StepRun` at the end of the edge. */
  node?: Maybe<StepRun>;
};

/** Methods to use when ordering `StepRun`. */
export enum StepRunsOrderBy {
  CompletedAtAsc = 'COMPLETED_AT_ASC',
  CompletedAtDesc = 'COMPLETED_AT_DESC',
  ErrorAsc = 'ERROR_ASC',
  ErrorDesc = 'ERROR_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LogsAsc = 'LOGS_ASC',
  LogsDesc = 'LOGS_DESC',
  Natural = 'NATURAL',
  OutputAsc = 'OUTPUT_ASC',
  OutputDesc = 'OUTPUT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  StartedAtAsc = 'STARTED_AT_ASC',
  StartedAtDesc = 'STARTED_AT_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  StepIdAsc = 'STEP_ID_ASC',
  StepIdDesc = 'STEP_ID_DESC',
  ToolCallsAsc = 'TOOL_CALLS_ASC',
  ToolCallsDesc = 'TOOL_CALLS_DESC',
  WorkflowRunIdAsc = 'WORKFLOW_RUN_ID_ASC',
  WorkflowRunIdDesc = 'WORKFLOW_RUN_ID_DESC'
}

export type Tool = Node & {
  __typename?: 'Tool';
  createdAt: Scalars['Datetime']['output'];
  deletedAt?: Maybe<Scalars['Datetime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isSystem: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  schema?: Maybe<Scalars['JSON']['output']>;
  updatedAt: Scalars['Datetime']['output'];
  /** Reads a single `User` that is related to this `Tool`. */
  userByUserId?: Maybe<User>;
  userId?: Maybe<Scalars['String']['output']>;
};

/** A condition to be used against `Tool` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ToolCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `deletedAt` field. */
  deletedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `isSystem` field. */
  isSystem?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `schema` field. */
  schema?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['String']['input']>;
};

/** An input for mutations affecting `Tool` */
export type ToolInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  deletedAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isSystem?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  schema?: InputMaybe<Scalars['JSON']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

/** Represents an update to a `Tool`. Fields that are set will be updated. */
export type ToolPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  deletedAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isSystem?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  schema?: InputMaybe<Scalars['JSON']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Tool` values. */
export type ToolsConnection = {
  __typename?: 'ToolsConnection';
  /** A list of edges which contains the `Tool` and cursor to aid in pagination. */
  edges: Array<ToolsEdge>;
  /** A list of `Tool` objects. */
  nodes: Array<Maybe<Tool>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Tool` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Tool` edge in the connection. */
export type ToolsEdge = {
  __typename?: 'ToolsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Tool` at the end of the edge. */
  node?: Maybe<Tool>;
};

/** Methods to use when ordering `Tool`. */
export enum ToolsOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  DeletedAtAsc = 'DELETED_AT_ASC',
  DeletedAtDesc = 'DELETED_AT_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IsSystemAsc = 'IS_SYSTEM_ASC',
  IsSystemDesc = 'IS_SYSTEM_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SchemaAsc = 'SCHEMA_ASC',
  SchemaDesc = 'SCHEMA_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
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

/** All input for the `updateChatById` mutation. */
export type UpdateChatByIdInput = {
  /** An object where the defined keys will be set on the `Chat` being updated. */
  chatPatch: ChatPatch;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** All input for the `updateChat` mutation. */
export type UpdateChatInput = {
  /** An object where the defined keys will be set on the `Chat` being updated. */
  chatPatch: ChatPatch;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Chat` to be updated. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our update `Chat` mutation. */
export type UpdateChatPayload = {
  __typename?: 'UpdateChatPayload';
  /** The `Chat` that was updated by this mutation. */
  chat?: Maybe<Chat>;
  /** An edge for our `Chat`. May be used by Relay 1. */
  chatEdge?: Maybe<ChatsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Chat`. */
  userByUserId?: Maybe<User>;
};


/** The output of our update `Chat` mutation. */
export type UpdateChatPayloadChatEdgeArgs = {
  orderBy?: InputMaybe<Array<ChatsOrderBy>>;
};

/** All input for the `updateMessageById` mutation. */
export type UpdateMessageByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `Message` being updated. */
  messagePatch: MessagePatch;
};

/** All input for the `updateMessage` mutation. */
export type UpdateMessageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Message` being updated. */
  messagePatch: MessagePatch;
  /** The globally unique `ID` which will identify a single `Message` to be updated. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our update `Message` mutation. */
export type UpdateMessagePayload = {
  __typename?: 'UpdateMessagePayload';
  /** Reads a single `Chat` that is related to this `Message`. */
  chatByChatId?: Maybe<Chat>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Message` that was updated by this mutation. */
  message?: Maybe<Message>;
  /** An edge for our `Message`. May be used by Relay 1. */
  messageEdge?: Maybe<MessagesEdge>;
  /** Reads a single `Model` that is related to this `Message`. */
  modelByModelId?: Maybe<Model>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `WorkflowRun` that is related to this `Message`. */
  workflowRunByWorkflowRunId?: Maybe<WorkflowRun>;
};


/** The output of our update `Message` mutation. */
export type UpdateMessagePayloadMessageEdgeArgs = {
  orderBy?: InputMaybe<Array<MessagesOrderBy>>;
};

/** All input for the `updateMessageSourceById` mutation. */
export type UpdateMessageSourceByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `MessageSource` being updated. */
  messageSourcePatch: MessageSourcePatch;
};

/** All input for the `updateMessageSourceByMessageIdAndPosition` mutation. */
export type UpdateMessageSourceByMessageIdAndPositionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  messageId: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `MessageSource` being updated. */
  messageSourcePatch: MessageSourcePatch;
  position: Scalars['Int']['input'];
};

/** All input for the `updateMessageSource` mutation. */
export type UpdateMessageSourceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `MessageSource` being updated. */
  messageSourcePatch: MessageSourcePatch;
  /** The globally unique `ID` which will identify a single `MessageSource` to be updated. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our update `MessageSource` mutation. */
export type UpdateMessageSourcePayload = {
  __typename?: 'UpdateMessageSourcePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Message` that is related to this `MessageSource`. */
  messageByMessageId?: Maybe<Message>;
  /** The `MessageSource` that was updated by this mutation. */
  messageSource?: Maybe<MessageSource>;
  /** An edge for our `MessageSource`. May be used by Relay 1. */
  messageSourceEdge?: Maybe<MessageSourcesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `MessageSource` mutation. */
export type UpdateMessageSourcePayloadMessageSourceEdgeArgs = {
  orderBy?: InputMaybe<Array<MessageSourcesOrderBy>>;
};

/** All input for the `updateModelById` mutation. */
export type UpdateModelByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  /** An object where the defined keys will be set on the `Model` being updated. */
  modelPatch: ModelPatch;
};

/** All input for the `updateModel` mutation. */
export type UpdateModelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Model` being updated. */
  modelPatch: ModelPatch;
  /** The globally unique `ID` which will identify a single `Model` to be updated. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our update `Model` mutation. */
export type UpdateModelPayload = {
  __typename?: 'UpdateModelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Model` that was updated by this mutation. */
  model?: Maybe<Model>;
  /** An edge for our `Model`. May be used by Relay 1. */
  modelEdge?: Maybe<ModelsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Model` mutation. */
export type UpdateModelPayloadModelEdgeArgs = {
  orderBy?: InputMaybe<Array<ModelsOrderBy>>;
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

/** All input for the `updateStepRunById` mutation. */
export type UpdateStepRunByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `StepRun` being updated. */
  stepRunPatch: StepRunPatch;
};

/** All input for the `updateStepRunByWorkflowRunIdAndStepId` mutation. */
export type UpdateStepRunByWorkflowRunIdAndStepIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  stepId: Scalars['String']['input'];
  /** An object where the defined keys will be set on the `StepRun` being updated. */
  stepRunPatch: StepRunPatch;
  workflowRunId: Scalars['UUID']['input'];
};

/** All input for the `updateStepRun` mutation. */
export type UpdateStepRunInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `StepRun` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `StepRun` being updated. */
  stepRunPatch: StepRunPatch;
};

/** The output of our update `StepRun` mutation. */
export type UpdateStepRunPayload = {
  __typename?: 'UpdateStepRunPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `StepRun` that was updated by this mutation. */
  stepRun?: Maybe<StepRun>;
  /** An edge for our `StepRun`. May be used by Relay 1. */
  stepRunEdge?: Maybe<StepRunsEdge>;
  /** Reads a single `WorkflowRun` that is related to this `StepRun`. */
  workflowRunByWorkflowRunId?: Maybe<WorkflowRun>;
};


/** The output of our update `StepRun` mutation. */
export type UpdateStepRunPayloadStepRunEdgeArgs = {
  orderBy?: InputMaybe<Array<StepRunsOrderBy>>;
};

/** All input for the `updateToolById` mutation. */
export type UpdateToolByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `Tool` being updated. */
  toolPatch: ToolPatch;
};

/** All input for the `updateTool` mutation. */
export type UpdateToolInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Tool` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Tool` being updated. */
  toolPatch: ToolPatch;
};

/** The output of our update `Tool` mutation. */
export type UpdateToolPayload = {
  __typename?: 'UpdateToolPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Tool` that was updated by this mutation. */
  tool?: Maybe<Tool>;
  /** An edge for our `Tool`. May be used by Relay 1. */
  toolEdge?: Maybe<ToolsEdge>;
  /** Reads a single `User` that is related to this `Tool`. */
  userByUserId?: Maybe<User>;
};


/** The output of our update `Tool` mutation. */
export type UpdateToolPayloadToolEdgeArgs = {
  orderBy?: InputMaybe<Array<ToolsOrderBy>>;
};

/** All input for the `updateUsageRecordById` mutation. */
export type UpdateUsageRecordByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `UsageRecord` being updated. */
  usageRecordPatch: UsageRecordPatch;
};

/** All input for the `updateUsageRecord` mutation. */
export type UpdateUsageRecordInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `UsageRecord` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `UsageRecord` being updated. */
  usageRecordPatch: UsageRecordPatch;
};

/** The output of our update `UsageRecord` mutation. */
export type UpdateUsageRecordPayload = {
  __typename?: 'UpdateUsageRecordPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Message` that is related to this `UsageRecord`. */
  messageByMessageId?: Maybe<Message>;
  /** Reads a single `Model` that is related to this `UsageRecord`. */
  modelByModelId?: Maybe<Model>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `UsageRecord` that was updated by this mutation. */
  usageRecord?: Maybe<UsageRecord>;
  /** An edge for our `UsageRecord`. May be used by Relay 1. */
  usageRecordEdge?: Maybe<UsageRecordsEdge>;
  /** Reads a single `User` that is related to this `UsageRecord`. */
  userByUserId?: Maybe<User>;
  /** Reads a single `WorkflowChatMessage` that is related to this `UsageRecord`. */
  workflowChatMessageByWorkflowChatMessageId?: Maybe<WorkflowChatMessage>;
};


/** The output of our update `UsageRecord` mutation. */
export type UpdateUsageRecordPayloadUsageRecordEdgeArgs = {
  orderBy?: InputMaybe<Array<UsageRecordsOrderBy>>;
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

/** All input for the `updateWorkflowById` mutation. */
export type UpdateWorkflowByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `Workflow` being updated. */
  workflowPatch: WorkflowPatch;
};

/** All input for the `updateWorkflowChatMessageById` mutation. */
export type UpdateWorkflowChatMessageByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `WorkflowChatMessage` being updated. */
  workflowChatMessagePatch: WorkflowChatMessagePatch;
};

/** All input for the `updateWorkflowChatMessage` mutation. */
export type UpdateWorkflowChatMessageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `WorkflowChatMessage` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `WorkflowChatMessage` being updated. */
  workflowChatMessagePatch: WorkflowChatMessagePatch;
};

/** The output of our update `WorkflowChatMessage` mutation. */
export type UpdateWorkflowChatMessagePayload = {
  __typename?: 'UpdateWorkflowChatMessagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Model` that is related to this `WorkflowChatMessage`. */
  modelByModelId?: Maybe<Model>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Workflow` that is related to this `WorkflowChatMessage`. */
  workflowByWorkflowId?: Maybe<Workflow>;
  /** The `WorkflowChatMessage` that was updated by this mutation. */
  workflowChatMessage?: Maybe<WorkflowChatMessage>;
  /** An edge for our `WorkflowChatMessage`. May be used by Relay 1. */
  workflowChatMessageEdge?: Maybe<WorkflowChatMessagesEdge>;
};


/** The output of our update `WorkflowChatMessage` mutation. */
export type UpdateWorkflowChatMessagePayloadWorkflowChatMessageEdgeArgs = {
  orderBy?: InputMaybe<Array<WorkflowChatMessagesOrderBy>>;
};

/** All input for the `updateWorkflow` mutation. */
export type UpdateWorkflowInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Workflow` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Workflow` being updated. */
  workflowPatch: WorkflowPatch;
};

/** The output of our update `Workflow` mutation. */
export type UpdateWorkflowPayload = {
  __typename?: 'UpdateWorkflowPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Workflow`. */
  userByUserId?: Maybe<User>;
  /** The `Workflow` that was updated by this mutation. */
  workflow?: Maybe<Workflow>;
  /** An edge for our `Workflow`. May be used by Relay 1. */
  workflowEdge?: Maybe<WorkflowsEdge>;
};


/** The output of our update `Workflow` mutation. */
export type UpdateWorkflowPayloadWorkflowEdgeArgs = {
  orderBy?: InputMaybe<Array<WorkflowsOrderBy>>;
};

/** All input for the `updateWorkflowRunById` mutation. */
export type UpdateWorkflowRunByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `WorkflowRun` being updated. */
  workflowRunPatch: WorkflowRunPatch;
};

/** All input for the `updateWorkflowRun` mutation. */
export type UpdateWorkflowRunInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `WorkflowRun` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `WorkflowRun` being updated. */
  workflowRunPatch: WorkflowRunPatch;
};

/** The output of our update `WorkflowRun` mutation. */
export type UpdateWorkflowRunPayload = {
  __typename?: 'UpdateWorkflowRunPayload';
  /** Reads a single `Chat` that is related to this `WorkflowRun`. */
  chatByChatId?: Maybe<Chat>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Message` that is related to this `WorkflowRun`. */
  messageByTriggerMessageId?: Maybe<Message>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `WorkflowRun` that was updated by this mutation. */
  workflowRun?: Maybe<WorkflowRun>;
  /** An edge for our `WorkflowRun`. May be used by Relay 1. */
  workflowRunEdge?: Maybe<WorkflowRunsEdge>;
  /** Reads a single `WorkflowVersion` that is related to this `WorkflowRun`. */
  workflowVersionByWorkflowVersionId?: Maybe<WorkflowVersion>;
};


/** The output of our update `WorkflowRun` mutation. */
export type UpdateWorkflowRunPayloadWorkflowRunEdgeArgs = {
  orderBy?: InputMaybe<Array<WorkflowRunsOrderBy>>;
};

/** All input for the `updateWorkflowVersionById` mutation. */
export type UpdateWorkflowVersionByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `WorkflowVersion` being updated. */
  workflowVersionPatch: WorkflowVersionPatch;
};

/** All input for the `updateWorkflowVersionByWorkflowIdAndVersionNumber` mutation. */
export type UpdateWorkflowVersionByWorkflowIdAndVersionNumberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  versionNumber: Scalars['Int']['input'];
  workflowId: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `WorkflowVersion` being updated. */
  workflowVersionPatch: WorkflowVersionPatch;
};

/** All input for the `updateWorkflowVersion` mutation. */
export type UpdateWorkflowVersionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `WorkflowVersion` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `WorkflowVersion` being updated. */
  workflowVersionPatch: WorkflowVersionPatch;
};

/** The output of our update `WorkflowVersion` mutation. */
export type UpdateWorkflowVersionPayload = {
  __typename?: 'UpdateWorkflowVersionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Workflow` that is related to this `WorkflowVersion`. */
  workflowByWorkflowId?: Maybe<Workflow>;
  /** The `WorkflowVersion` that was updated by this mutation. */
  workflowVersion?: Maybe<WorkflowVersion>;
  /** An edge for our `WorkflowVersion`. May be used by Relay 1. */
  workflowVersionEdge?: Maybe<WorkflowVersionsEdge>;
};


/** The output of our update `WorkflowVersion` mutation. */
export type UpdateWorkflowVersionPayloadWorkflowVersionEdgeArgs = {
  orderBy?: InputMaybe<Array<WorkflowVersionsOrderBy>>;
};

export type UsageRecord = Node & {
  __typename?: 'UsageRecord';
  /** Describes usage when no message attached (e.g., workflow_compilation) */
  context?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Datetime']['output'];
  estimatedCostCents: Scalars['BigInt']['output'];
  id: Scalars['UUID']['output'];
  inputTokens: Scalars['BigInt']['output'];
  /** Reads a single `Message` that is related to this `UsageRecord`. */
  messageByMessageId?: Maybe<Message>;
  messageId?: Maybe<Scalars['UUID']['output']>;
  /** Reads a single `Model` that is related to this `UsageRecord`. */
  modelByModelId?: Maybe<Model>;
  modelId: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  outputTokens: Scalars['BigInt']['output'];
  /** Reads a single `User` that is related to this `UsageRecord`. */
  userByUserId?: Maybe<User>;
  userId: Scalars['String']['output'];
  /** Reads a single `WorkflowChatMessage` that is related to this `UsageRecord`. */
  workflowChatMessageByWorkflowChatMessageId?: Maybe<WorkflowChatMessage>;
  workflowChatMessageId?: Maybe<Scalars['UUID']['output']>;
};

/**
 * A condition to be used against `UsageRecord` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type UsageRecordCondition = {
  /** Checks for equality with the object’s `context` field. */
  context?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `estimatedCostCents` field. */
  estimatedCostCents?: InputMaybe<Scalars['BigInt']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `inputTokens` field. */
  inputTokens?: InputMaybe<Scalars['BigInt']['input']>;
  /** Checks for equality with the object’s `messageId` field. */
  messageId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `modelId` field. */
  modelId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `outputTokens` field. */
  outputTokens?: InputMaybe<Scalars['BigInt']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `workflowChatMessageId` field. */
  workflowChatMessageId?: InputMaybe<Scalars['UUID']['input']>;
};

/** An input for mutations affecting `UsageRecord` */
export type UsageRecordInput = {
  /** Describes usage when no message attached (e.g., workflow_compilation) */
  context?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  estimatedCostCents?: InputMaybe<Scalars['BigInt']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  inputTokens?: InputMaybe<Scalars['BigInt']['input']>;
  messageId?: InputMaybe<Scalars['UUID']['input']>;
  modelId: Scalars['String']['input'];
  outputTokens?: InputMaybe<Scalars['BigInt']['input']>;
  userId: Scalars['String']['input'];
  workflowChatMessageId?: InputMaybe<Scalars['UUID']['input']>;
};

/** Represents an update to a `UsageRecord`. Fields that are set will be updated. */
export type UsageRecordPatch = {
  /** Describes usage when no message attached (e.g., workflow_compilation) */
  context?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  estimatedCostCents?: InputMaybe<Scalars['BigInt']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  inputTokens?: InputMaybe<Scalars['BigInt']['input']>;
  messageId?: InputMaybe<Scalars['UUID']['input']>;
  modelId?: InputMaybe<Scalars['String']['input']>;
  outputTokens?: InputMaybe<Scalars['BigInt']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  workflowChatMessageId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `UsageRecord` values. */
export type UsageRecordsConnection = {
  __typename?: 'UsageRecordsConnection';
  /** A list of edges which contains the `UsageRecord` and cursor to aid in pagination. */
  edges: Array<UsageRecordsEdge>;
  /** A list of `UsageRecord` objects. */
  nodes: Array<Maybe<UsageRecord>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `UsageRecord` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `UsageRecord` edge in the connection. */
export type UsageRecordsEdge = {
  __typename?: 'UsageRecordsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `UsageRecord` at the end of the edge. */
  node?: Maybe<UsageRecord>;
};

/** Methods to use when ordering `UsageRecord`. */
export enum UsageRecordsOrderBy {
  ContextAsc = 'CONTEXT_ASC',
  ContextDesc = 'CONTEXT_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  EstimatedCostCentsAsc = 'ESTIMATED_COST_CENTS_ASC',
  EstimatedCostCentsDesc = 'ESTIMATED_COST_CENTS_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  InputTokensAsc = 'INPUT_TOKENS_ASC',
  InputTokensDesc = 'INPUT_TOKENS_DESC',
  MessageIdAsc = 'MESSAGE_ID_ASC',
  MessageIdDesc = 'MESSAGE_ID_DESC',
  ModelIdAsc = 'MODEL_ID_ASC',
  ModelIdDesc = 'MODEL_ID_DESC',
  Natural = 'NATURAL',
  OutputTokensAsc = 'OUTPUT_TOKENS_ASC',
  OutputTokensDesc = 'OUTPUT_TOKENS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  WorkflowChatMessageIdAsc = 'WORKFLOW_CHAT_MESSAGE_ID_ASC',
  WorkflowChatMessageIdDesc = 'WORKFLOW_CHAT_MESSAGE_ID_DESC'
}

export type User = Node & {
  __typename?: 'User';
  /** Reads and enables pagination through a set of `Account`. */
  accountsByUserId: AccountsConnection;
  /** Reads and enables pagination through a set of `Chat`. */
  chatsByUserId: ChatsConnection;
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
  /** Reads and enables pagination through a set of `Tool`. */
  toolsByUserId: ToolsConnection;
  updatedAt: Scalars['Datetime']['output'];
  /** Reads and enables pagination through a set of `UsageRecord`. */
  usageRecordsByUserId: UsageRecordsConnection;
  /** Reads and enables pagination through a set of `Workflow`. */
  workflowsByUserId: WorkflowsConnection;
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


export type UserChatsByUserIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ChatCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatsOrderBy>>;
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


export type UserToolsByUserIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ToolCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ToolsOrderBy>>;
};


export type UserUsageRecordsByUserIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UsageRecordCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsageRecordsOrderBy>>;
};


export type UserWorkflowsByUserIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<WorkflowCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkflowsOrderBy>>;
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

export type Workflow = Node & {
  __typename?: 'Workflow';
  createdAt: Scalars['Datetime']['output'];
  deletedAt?: Maybe<Scalars['Datetime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  updatedAt: Scalars['Datetime']['output'];
  /** Reads a single `User` that is related to this `Workflow`. */
  userByUserId?: Maybe<User>;
  userId: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `WorkflowChatMessage`. */
  workflowChatMessagesByWorkflowId: WorkflowChatMessagesConnection;
  /** Reads and enables pagination through a set of `WorkflowVersion`. */
  workflowVersionsByWorkflowId: WorkflowVersionsConnection;
};


export type WorkflowWorkflowChatMessagesByWorkflowIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<WorkflowChatMessageCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkflowChatMessagesOrderBy>>;
};


export type WorkflowWorkflowVersionsByWorkflowIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<WorkflowVersionCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkflowVersionsOrderBy>>;
};

export type WorkflowChatMessage = Node & {
  __typename?: 'WorkflowChatMessage';
  content: Scalars['String']['output'];
  createdAt: Scalars['Datetime']['output'];
  id: Scalars['UUID']['output'];
  /** Reads a single `Model` that is related to this `WorkflowChatMessage`. */
  modelByModelId?: Maybe<Model>;
  modelId?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  role: MessageRole;
  /** Reads and enables pagination through a set of `UsageRecord`. */
  usageRecordsByWorkflowChatMessageId: UsageRecordsConnection;
  /** Reads a single `Workflow` that is related to this `WorkflowChatMessage`. */
  workflowByWorkflowId?: Maybe<Workflow>;
  workflowId: Scalars['UUID']['output'];
};


export type WorkflowChatMessageUsageRecordsByWorkflowChatMessageIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UsageRecordCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsageRecordsOrderBy>>;
};

/**
 * A condition to be used against `WorkflowChatMessage` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type WorkflowChatMessageCondition = {
  /** Checks for equality with the object’s `content` field. */
  content?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `modelId` field. */
  modelId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `role` field. */
  role?: InputMaybe<MessageRole>;
  /** Checks for equality with the object’s `workflowId` field. */
  workflowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** An input for mutations affecting `WorkflowChatMessage` */
export type WorkflowChatMessageInput = {
  content: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  modelId?: InputMaybe<Scalars['String']['input']>;
  role: MessageRole;
  workflowId: Scalars['UUID']['input'];
};

/** Represents an update to a `WorkflowChatMessage`. Fields that are set will be updated. */
export type WorkflowChatMessagePatch = {
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  modelId?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<MessageRole>;
  workflowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `WorkflowChatMessage` values. */
export type WorkflowChatMessagesConnection = {
  __typename?: 'WorkflowChatMessagesConnection';
  /** A list of edges which contains the `WorkflowChatMessage` and cursor to aid in pagination. */
  edges: Array<WorkflowChatMessagesEdge>;
  /** A list of `WorkflowChatMessage` objects. */
  nodes: Array<Maybe<WorkflowChatMessage>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `WorkflowChatMessage` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `WorkflowChatMessage` edge in the connection. */
export type WorkflowChatMessagesEdge = {
  __typename?: 'WorkflowChatMessagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `WorkflowChatMessage` at the end of the edge. */
  node?: Maybe<WorkflowChatMessage>;
};

/** Methods to use when ordering `WorkflowChatMessage`. */
export enum WorkflowChatMessagesOrderBy {
  ContentAsc = 'CONTENT_ASC',
  ContentDesc = 'CONTENT_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ModelIdAsc = 'MODEL_ID_ASC',
  ModelIdDesc = 'MODEL_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RoleAsc = 'ROLE_ASC',
  RoleDesc = 'ROLE_DESC',
  WorkflowIdAsc = 'WORKFLOW_ID_ASC',
  WorkflowIdDesc = 'WORKFLOW_ID_DESC'
}

/**
 * A condition to be used against `Workflow` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type WorkflowCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `deletedAt` field. */
  deletedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['String']['input']>;
};

/** An input for mutations affecting `Workflow` */
export type WorkflowInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  deletedAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  name: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId: Scalars['String']['input'];
};

/** Represents an update to a `Workflow`. Fields that are set will be updated. */
export type WorkflowPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  deletedAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type WorkflowRun = Node & {
  __typename?: 'WorkflowRun';
  /** Reads a single `Chat` that is related to this `WorkflowRun`. */
  chatByChatId?: Maybe<Chat>;
  chatId: Scalars['UUID']['output'];
  completedAt?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['UUID']['output'];
  /** Reads a single `Message` that is related to this `WorkflowRun`. */
  messageByTriggerMessageId?: Maybe<Message>;
  /** Reads and enables pagination through a set of `Message`. */
  messagesByWorkflowRunId: MessagesConnection;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  startedAt: Scalars['Datetime']['output'];
  status: WorkflowRunStatus;
  /** Reads and enables pagination through a set of `StepRun`. */
  stepRunsByWorkflowRunId: StepRunsConnection;
  triggerMessageId: Scalars['UUID']['output'];
  /** Reads a single `WorkflowVersion` that is related to this `WorkflowRun`. */
  workflowVersionByWorkflowVersionId?: Maybe<WorkflowVersion>;
  workflowVersionId: Scalars['UUID']['output'];
};


export type WorkflowRunMessagesByWorkflowRunIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MessageCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MessagesOrderBy>>;
};


export type WorkflowRunStepRunsByWorkflowRunIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<StepRunCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<StepRunsOrderBy>>;
};

/**
 * A condition to be used against `WorkflowRun` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type WorkflowRunCondition = {
  /** Checks for equality with the object’s `chatId` field. */
  chatId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `completedAt` field. */
  completedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `startedAt` field. */
  startedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `status` field. */
  status?: InputMaybe<WorkflowRunStatus>;
  /** Checks for equality with the object’s `triggerMessageId` field. */
  triggerMessageId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `workflowVersionId` field. */
  workflowVersionId?: InputMaybe<Scalars['UUID']['input']>;
};

/** An input for mutations affecting `WorkflowRun` */
export type WorkflowRunInput = {
  chatId: Scalars['UUID']['input'];
  completedAt?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  startedAt?: InputMaybe<Scalars['Datetime']['input']>;
  status?: InputMaybe<WorkflowRunStatus>;
  triggerMessageId: Scalars['UUID']['input'];
  workflowVersionId: Scalars['UUID']['input'];
};

/** Represents an update to a `WorkflowRun`. Fields that are set will be updated. */
export type WorkflowRunPatch = {
  chatId?: InputMaybe<Scalars['UUID']['input']>;
  completedAt?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  startedAt?: InputMaybe<Scalars['Datetime']['input']>;
  status?: InputMaybe<WorkflowRunStatus>;
  triggerMessageId?: InputMaybe<Scalars['UUID']['input']>;
  workflowVersionId?: InputMaybe<Scalars['UUID']['input']>;
};

export enum WorkflowRunStatus {
  Cancelled = 'CANCELLED',
  Failed = 'FAILED',
  Passed = 'PASSED',
  Running = 'RUNNING'
}

/** A connection to a list of `WorkflowRun` values. */
export type WorkflowRunsConnection = {
  __typename?: 'WorkflowRunsConnection';
  /** A list of edges which contains the `WorkflowRun` and cursor to aid in pagination. */
  edges: Array<WorkflowRunsEdge>;
  /** A list of `WorkflowRun` objects. */
  nodes: Array<Maybe<WorkflowRun>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `WorkflowRun` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `WorkflowRun` edge in the connection. */
export type WorkflowRunsEdge = {
  __typename?: 'WorkflowRunsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `WorkflowRun` at the end of the edge. */
  node?: Maybe<WorkflowRun>;
};

/** Methods to use when ordering `WorkflowRun`. */
export enum WorkflowRunsOrderBy {
  ChatIdAsc = 'CHAT_ID_ASC',
  ChatIdDesc = 'CHAT_ID_DESC',
  CompletedAtAsc = 'COMPLETED_AT_ASC',
  CompletedAtDesc = 'COMPLETED_AT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  StartedAtAsc = 'STARTED_AT_ASC',
  StartedAtDesc = 'STARTED_AT_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  TriggerMessageIdAsc = 'TRIGGER_MESSAGE_ID_ASC',
  TriggerMessageIdDesc = 'TRIGGER_MESSAGE_ID_DESC',
  WorkflowVersionIdAsc = 'WORKFLOW_VERSION_ID_ASC',
  WorkflowVersionIdDesc = 'WORKFLOW_VERSION_ID_DESC'
}

export type WorkflowVersion = Node & {
  __typename?: 'WorkflowVersion';
  createdAt: Scalars['Datetime']['output'];
  /** JSONB structure: { steps: [{ id, name, instruction, tools: string[], dependsOn: string[] }] } */
  dag: Scalars['JSON']['output'];
  id: Scalars['UUID']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  sourceDescription?: Maybe<Scalars['String']['output']>;
  versionNumber: Scalars['Int']['output'];
  /** Reads a single `Workflow` that is related to this `WorkflowVersion`. */
  workflowByWorkflowId?: Maybe<Workflow>;
  workflowId: Scalars['UUID']['output'];
  /** Reads and enables pagination through a set of `WorkflowRun`. */
  workflowRunsByWorkflowVersionId: WorkflowRunsConnection;
};


export type WorkflowVersionWorkflowRunsByWorkflowVersionIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<WorkflowRunCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkflowRunsOrderBy>>;
};

/**
 * A condition to be used against `WorkflowVersion` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type WorkflowVersionCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `dag` field. */
  dag?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `sourceDescription` field. */
  sourceDescription?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `versionNumber` field. */
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `workflowId` field. */
  workflowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** An input for mutations affecting `WorkflowVersion` */
export type WorkflowVersionInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** JSONB structure: { steps: [{ id, name, instruction, tools: string[], dependsOn: string[] }] } */
  dag: Scalars['JSON']['input'];
  id?: InputMaybe<Scalars['UUID']['input']>;
  sourceDescription?: InputMaybe<Scalars['String']['input']>;
  versionNumber: Scalars['Int']['input'];
  workflowId: Scalars['UUID']['input'];
};

/** Represents an update to a `WorkflowVersion`. Fields that are set will be updated. */
export type WorkflowVersionPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** JSONB structure: { steps: [{ id, name, instruction, tools: string[], dependsOn: string[] }] } */
  dag?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  sourceDescription?: InputMaybe<Scalars['String']['input']>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
  workflowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `WorkflowVersion` values. */
export type WorkflowVersionsConnection = {
  __typename?: 'WorkflowVersionsConnection';
  /** A list of edges which contains the `WorkflowVersion` and cursor to aid in pagination. */
  edges: Array<WorkflowVersionsEdge>;
  /** A list of `WorkflowVersion` objects. */
  nodes: Array<Maybe<WorkflowVersion>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `WorkflowVersion` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `WorkflowVersion` edge in the connection. */
export type WorkflowVersionsEdge = {
  __typename?: 'WorkflowVersionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `WorkflowVersion` at the end of the edge. */
  node?: Maybe<WorkflowVersion>;
};

/** Methods to use when ordering `WorkflowVersion`. */
export enum WorkflowVersionsOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  DagAsc = 'DAG_ASC',
  DagDesc = 'DAG_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SourceDescriptionAsc = 'SOURCE_DESCRIPTION_ASC',
  SourceDescriptionDesc = 'SOURCE_DESCRIPTION_DESC',
  VersionNumberAsc = 'VERSION_NUMBER_ASC',
  VersionNumberDesc = 'VERSION_NUMBER_DESC',
  WorkflowIdAsc = 'WORKFLOW_ID_ASC',
  WorkflowIdDesc = 'WORKFLOW_ID_DESC'
}

/** A connection to a list of `Workflow` values. */
export type WorkflowsConnection = {
  __typename?: 'WorkflowsConnection';
  /** A list of edges which contains the `Workflow` and cursor to aid in pagination. */
  edges: Array<WorkflowsEdge>;
  /** A list of `Workflow` objects. */
  nodes: Array<Maybe<Workflow>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Workflow` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Workflow` edge in the connection. */
export type WorkflowsEdge = {
  __typename?: 'WorkflowsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Workflow` at the end of the edge. */
  node?: Maybe<Workflow>;
};

/** Methods to use when ordering `Workflow`. */
export enum WorkflowsOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  DeletedAtAsc = 'DELETED_AT_ASC',
  DeletedAtDesc = 'DELETED_AT_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}
