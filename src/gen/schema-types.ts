export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  AWSDate: { input: unknown; output: unknown }
  AWSDateTime: { input: unknown; output: unknown }
  AWSEmail: { input: unknown; output: unknown }
  AWSIPAddress: { input: unknown; output: unknown }
  AWSJSON: { input: unknown; output: unknown }
  AWSPhone: { input: unknown; output: unknown }
  AWSTime: { input: unknown; output: unknown }
  AWSTimestamp: { input: unknown; output: unknown }
  AWSURL: { input: unknown; output: unknown }
}

export type Action = {
  additionalInfo?: Maybe<Scalars['String']['output']>
  assistedPayload?: Maybe<AssistedPayload>
  completedAtEpochMs?: Maybe<Scalars['Float']['output']>
  createdAtEpochMs: Scalars['Float']['output']
  dataHolderId?: Maybe<Scalars['ID']['output']>
  fulfilmentMethod: ActionFulfilmentMethod
  id: Scalars['ID']['output']
  initiatedAtEpochMs?: Maybe<Scalars['Float']['output']>
  intent: ActionIntent
  owner: Scalars['ID']['output']
  status: ActionStatus
  updatedAtEpochMs: Scalars['Float']['output']
  version: Scalars['Int']['output']
  virtualPresenceId: Scalars['ID']['output']
}

export type ActionContact = {
  address?: Maybe<Scalars['String']['output']>
  email?: Maybe<Scalars['String']['output']>
  phone?: Maybe<Scalars['String']['output']>
}

export type ActionFulfilmentMethod =
  'ASSISTED' | 'DELEGATED' | '%future added value'

export type ActionIntent =
  | 'ACCESS_MY_DATA'
  | 'DELETE_MY_DATA'
  | 'LIMIT_DATA_USE'
  | 'OTHER'
  | 'STOP_CONTACT'
  | '%future added value'

export type ActionOrigin =
  'ANALYSIS' | 'DISCOVERY' | 'STATIC' | '%future added value'

export type ActionStatus =
  | 'COMPLETED_UNVERIFIED'
  | 'COMPLETED_VERIFIED'
  | 'CONTRADICTED'
  | 'FAILED'
  | 'IN_PROGRESS'
  | 'PENDING'
  | 'REQUIRES_USER_INPUT'
  | '%future added value'

export type AnalysisResult = {
  createdAtEpochMs: Scalars['Float']['output']
  data?: Maybe<AnalysisResultData>
  dataHolderIdentifier: Scalars['String']['output']
  id: Scalars['ID']['output']
  lastAnalyzedAtEpochMs: Scalars['Float']['output']
  owner: Scalars['ID']['output']
  status: AnalysisResultStatus
  statusReason?: Maybe<AnalysisResultStatusReason>
  updatedAtEpochMs: Scalars['Float']['output']
  version: Scalars['Int']['output']
  virtualPresenceId: Scalars['ID']['output']
}

export type AnalysisResultConnection = {
  items: Array<AnalysisResult>
  nextToken?: Maybe<Scalars['String']['output']>
}

export type AnalysisResultData = {
  attribution: Array<Scalars['String']['output']>
  capabilities: CapabilitySignals
  categories: Array<CategorySignals>
  organizationIdentity?: Maybe<OrganizationIdentity>
  privacyScore?: Maybe<PrivacyScore>
  privacySummary: PrivacySummary
  riskIndicators: RiskIndicators
}

export type AnalysisResultStatus =
  | 'COMPLETE'
  | 'FAILED'
  | 'PARTIAL'
  | 'PENDING'
  | 'UNAVAILABLE'
  | '%future added value'

export type AnalysisResultStatusReason =
  | 'INVALID_DOMAIN'
  | 'MALICIOUS'
  | 'NOT_ATTEMPTED'
  | 'OTHER'
  | 'POLICY_UNAVAILABLE'
  | '%future added value'

export type AnalysisResultUpdate = {
  createdAtEpochMs: Scalars['Float']['output']
  dataHolderIdentifier: Scalars['String']['output']
  id: Scalars['ID']['output']
  lastAnalyzedAtEpochMs: Scalars['Float']['output']
  owner: Scalars['ID']['output']
  status: AnalysisResultStatus
  statusReason?: Maybe<AnalysisResultStatusReason>
  updatedAtEpochMs: Scalars['Float']['output']
  version: Scalars['Int']['output']
  virtualPresenceId: Scalars['ID']['output']
}

export type AssistedEmailTemplate = {
  body: Scalars['String']['output']
  subject?: Maybe<Scalars['String']['output']>
}

export type AssistedPayload = {
  contact?: Maybe<ActionContact>
  emailTemplate?: Maybe<AssistedEmailTemplate>
  instructions?: Maybe<Scalars['String']['output']>
  jurisdiction?: Maybe<Scalars['String']['output']>
  toAddress?: Maybe<Scalars['String']['output']>
  unsubscribeMailto?: Maybe<Scalars['String']['output']>
  unsubscribeUrl?: Maybe<Scalars['String']['output']>
}

export type AuthCodeInput = {
  authCode: Scalars['String']['input']
  redirectUri?: InputMaybe<Scalars['String']['input']>
}

export type AvailableAction = {
  additionalInfo?: Maybe<Scalars['String']['output']>
  description?: Maybe<Scalars['String']['output']>
  fulfilmentMethod: ActionFulfilmentMethod
  intent: ActionIntent
  origin: ActionOrigin
  title?: Maybe<Scalars['String']['output']>
}

export type AvailableActionConnection = {
  items: Array<AvailableAction>
  nextToken?: Maybe<Scalars['String']['output']>
}

export type CapabilitySignals = {
  supportsAccountCreation: SignalValue
  supportsAccountDeletion: SignalValue
  supportsDataDeletionRequests: SignalValue
  supportsDataExport: SignalValue
  supportsOptOutOfSale: SignalValue
  supportsSubscriptions: SignalValue
  supportsTwoFactorAuth: SignalValue
  usesCookiesOrTracking: SignalValue
}

export type CategorySignals = {
  category: DataCategory
  collected: SignalValue
  dataLabels: Array<Scalars['String']['output']>
  monetized: SignalValue
  requiredForLaw?: Maybe<SignalValue>
  requiredForService?: Maybe<SignalValue>
  retained: SignalValue
  retention?: Maybe<RetentionInfo>
  sharedWithThirdParties: ShareStyle
  userCanOptOut: SignalValue
}

export type ConnectVirtualPresenceInput = {
  authCode?: InputMaybe<AuthCodeInput>
  refreshToken?: InputMaybe<RefreshTokenInput>
  relationshipProvider?: InputMaybe<RelationshipProvider>
}

export type DataCategory =
  | 'ACCOUNT_PROFILE'
  | 'AUTHENTICATION'
  | 'BACKGROUND'
  | 'BIOMETRIC'
  | 'COMMUNICATION'
  | 'CONTACTS'
  | 'DEMOGRAPHIC'
  | 'DEVICE_IDENTIFIER'
  | 'FINANCIAL'
  | 'GOVERNMENT_ISSUED'
  | 'HEALTH'
  | 'INFERENCES'
  | 'LOCATION'
  | 'OTHER'
  | 'PII'
  | 'THIRD_PARTY_DATA'
  | 'USAGE'
  | '%future added value'

export type DataHolder = {
  complianceConcern: Scalars['Boolean']['output']
  createdAtEpochMs: Scalars['Float']['output']
  domainName: Scalars['String']['output']
  id: Scalars['ID']['output']
  mostRecentInteractionEpochMs: Scalars['Float']['output']
  name: Scalars['String']['output']
  owner: Scalars['ID']['output']
  protectionState: DataHolderProtectionState
  updatedAtEpochMs: Scalars['Float']['output']
  version: Scalars['Int']['output']
  virtualPresenceId: Scalars['ID']['output']
}

export type DataHolderChangeType =
  'METADATA_UPDATE' | 'NEW' | 'SIGNIFICANT_UPDATE' | '%future added value'

export type DataHolderConnection = {
  items: Array<DataHolder>
  nextToken?: Maybe<Scalars['String']['output']>
}

export type DataHolderCount = {
  archived: Scalars['Int']['output']
  completedActions: Scalars['Int']['output']
  count: Scalars['Int']['output']
  initiatedActions: Scalars['Int']['output']
  monitored: Scalars['Int']['output']
}

export type DataHolderProtectionState =
  | 'ACTION_REQUESTED'
  | 'ARCHIVED'
  | 'MONITORED'
  | 'RESOLVED'
  | '%future added value'

export type DataHolderScanSummary = {
  categoryBreakdown: Scalars['AWSJSON']['output']
  dataHolderId: Scalars['ID']['output']
  emailCount: Scalars['Int']['output']
  marketingEmailCount: Scalars['Int']['output']
  marketingEmailOpened: Scalars['Int']['output']
  marketingOpenRate: Scalars['Float']['output']
  owner: Scalars['ID']['output']
  readCount: Scalars['Int']['output']
  readRate: Scalars['Float']['output']
  scanRangeFromEpochMs: Scalars['Float']['output']
  scanRangeToEpochMs: Scalars['Float']['output']
  scannedAtEpochMs: Scalars['Float']['output']
  uncategorizedCount: Scalars['Int']['output']
}

export type DataHolderScanSummaryConnection = {
  items: Array<DataHolderScanSummary>
  nextToken?: Maybe<Scalars['String']['output']>
}

export type DataHolderUpdateItem = {
  complianceConcern: Scalars['Boolean']['output']
  createdAtEpochMs: Scalars['Float']['output']
  domainName: Scalars['String']['output']
  id: Scalars['ID']['output']
  mostRecentInteractionEpochMs: Scalars['Float']['output']
  name: Scalars['String']['output']
  owner: Scalars['ID']['output']
  protectionState: DataHolderProtectionState
  updatedAtEpochMs: Scalars['Float']['output']
  version: Scalars['Int']['output']
  virtualPresenceId: Scalars['ID']['output']
}

/**
 * A batch of data holder updates emitted during discovery.
 * Contains all data holders discovered in a single page with their change types.
 */
export type DataHoldersUpdate = {
  items: Array<DataHolderUpdateItem>
  owner: Scalars['ID']['output']
}

export type InitiateActionInput = {
  dataHolderId: Scalars['ID']['input']
  fulfilmentMethod: ActionFulfilmentMethod
  intent: ActionIntent
}

export type ListVirtualPresencesInput = {
  limit?: InputMaybe<Scalars['Int']['input']>
  nextToken?: InputMaybe<Scalars['String']['input']>
}

export type Mutation = {
  /** Archive a data holder, removing it from the user's active list. */
  archiveDataHolder: DataHolder
  /**
   * Confirm that an assisted or delegated action was completed, transitioning it
   * from COMPLETED_UNVERIFIED to COMPLETED_VERIFIED.
   */
  confirmActionOutcome: Action
  /** Connect a virtual presence. */
  connectVirtualPresence: VirtualPresence
  /** Disconnect a virtual presence. */
  disconnectVirtualPresence: VirtualPresence
  /**
   * Initiate an action against a data holder relationship. Delegated actions are
   * performed on the user's behalf; assisted actions return structured materials
   * for the client to complete.
   */
  initiateAction: Action
  /**
   * Rescan an existing virtual presence for new data holders.
   * Scans from the last scan date forward.
   */
  rescanVirtualPresence: VirtualPresence
  /**
   * Unarchive a previously archived data holder, clearing the user's archive
   * setting and returning it to the MONITORED state. Only a data holder in the
   * ARCHIVED state may be unarchived.
   */
  unarchiveDataHolder: DataHolder
}

export type MutationArchiveDataHolderArgs = {
  id: Scalars['ID']['input']
}

export type MutationConfirmActionOutcomeArgs = {
  id: Scalars['ID']['input']
}

export type MutationConnectVirtualPresenceArgs = {
  input?: InputMaybe<ConnectVirtualPresenceInput>
}

export type MutationDisconnectVirtualPresenceArgs = {
  id: Scalars['String']['input']
}

export type MutationInitiateActionArgs = {
  input: InitiateActionInput
}

export type MutationRescanVirtualPresenceArgs = {
  id: Scalars['String']['input']
  options?: InputMaybe<ScanOptionsInput>
}

export type MutationUnarchiveDataHolderArgs = {
  id: Scalars['ID']['input']
}

export type OrganizationAnalysis = {
  createdAtEpochMs: Scalars['Float']['output']
  data?: Maybe<AnalysisResultData>
  domain: Scalars['String']['output']
  id: Scalars['ID']['output']
  lastAnalyzedAtEpochMs: Scalars['Float']['output']
  owner: Scalars['ID']['output']
  status: AnalysisResultStatus
  statusReason?: Maybe<AnalysisResultStatusReason>
  updatedAtEpochMs: Scalars['Float']['output']
  version: Scalars['Int']['output']
}

export type OrganizationAnalysisDomainResolution =
  'EXACT' | 'REGISTRABLE' | '%future added value'

export type OrganizationAnalysisMode =
  'ANALYZE' | 'FETCH' | '%future added value'

export type OrganizationAnalysisOptions = {
  mode?: InputMaybe<OrganizationAnalysisMode>
  resolution?: InputMaybe<OrganizationAnalysisDomainResolution>
}

export type OrganizationCategory =
  | 'AdTechAndMarketing'
  | 'AdultEntertainment'
  | 'Automotive'
  | 'Communications'
  | 'CommunityAndCharity'
  | 'Cryptocurrency'
  | 'DataBroker'
  | 'Dating'
  | 'Education'
  | 'Employment'
  | 'EnergyAndUtilities'
  | 'Entertainment'
  | 'Finance'
  | 'FoodAndDining'
  | 'Gambling'
  | 'Government'
  | 'Health'
  | 'Insurance'
  | 'Military'
  | 'News'
  | 'Other'
  | 'PersonalEmail'
  | 'PrivacyAndSecurity'
  | 'RealEstate'
  | 'ShippingAndDelivery'
  | 'Shopping'
  | 'SocialMedia'
  | 'SportsAndFitness'
  | 'Technology'
  | 'Transportation'
  | 'Travel'
  | 'VideoGames'
  | '%future added value'

export type OrganizationIdentity = {
  brandName?: Maybe<Scalars['String']['output']>
  categories: Array<OrganizationCategory>
  companyName?: Maybe<Scalars['String']['output']>
  primaryCategory?: Maybe<OrganizationCategory>
}

export type PrivacyScore = {
  breakdown: Array<ScoreContribution>
  coverage: ScoreCoverage
  score: Scalars['Float']['output']
}

export type PrivacySummary = {
  bulletPoints: Array<Scalars['String']['output']>
  sourceLastUpdated?: Maybe<Scalars['String']['output']>
  sourceUrl: Scalars['String']['output']
}

export type ProviderConfiguration = {
  data: Scalars['ID']['output']
}

export type ProviderType = 'EMAIL' | '%future added value'

export type Query = {
  /**
   * Read a single initiated action by id. Resolves an in-flight delegated action
   * on read: if the action is still in progress, its outcome is polled and, once
   * terminal, the action is updated to its verified result before being returned.
   * Returns null when no action with the given id exists for the user.
   */
  getAction?: Maybe<Action>
  /** Get a full analysis result by ID, including typed data. */
  getAnalysisResult?: Maybe<AnalysisResult>
  /** Get a single data holder by ID */
  getDataHolder?: Maybe<DataHolder>
  /**
   * Analyze (read-through) and return the shared, organization-generic analysis
   * for a domain. Returns PENDING when an asynchronous source is still resolving;
   * re-query for the terminal result.
   *
   * Pass `options` to control the analysis mode and domain resolution. When no
   * mode is supplied the behaviour is ANALYZE, and resolution defaults to
   * REGISTRABLE.
   *
   * Pass `name` to analyze by organization name (e.g. "amazon", "stripe"). The
   * name is resolved to a domain and takes precedence over `domain` when it
   * resolves; `domain` remains required and is used as the fallback when the name
   * cannot be resolved (including when name resolution is unavailable).
   */
  getOrganizationAnalysis?: Maybe<OrganizationAnalysis>
  /**
   * Get the opaque provider configuration required by consumers to support
   * the provider OAuth flow.
   */
  getProviderConfiguration: ProviderConfiguration
  /** List analysis results for a virtual presence. */
  listAnalysisResults: AnalysisResultConnection
  /**
   * List the actions currently available for a data holder relationship. Derived
   * at query time by merging static, analysis, and discovery sources; not
   * persisted. The owning virtual presence is derived from the data holder.
   */
  listAvailableActions: AvailableActionConnection
  /** List scan summaries for a data holder (most recent first) */
  listDataHolderScanSummaries: DataHolderScanSummaryConnection
  /** List data holders by virtual presence */
  listDataHolders: DataHolderConnection
  /** List virtual presences for the authenticated user */
  listVirtualPresences: VirtualPresenceConnection
}

export type QueryGetActionArgs = {
  id: Scalars['ID']['input']
}

export type QueryGetAnalysisResultArgs = {
  id: Scalars['ID']['input']
}

export type QueryGetDataHolderArgs = {
  id: Scalars['ID']['input']
}

export type QueryGetOrganizationAnalysisArgs = {
  domain: Scalars['String']['input']
  name?: InputMaybe<Scalars['String']['input']>
  options?: InputMaybe<OrganizationAnalysisOptions>
}

export type QueryListAnalysisResultsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  nextToken?: InputMaybe<Scalars['String']['input']>
  virtualPresenceId: Scalars['ID']['input']
}

export type QueryListAvailableActionsArgs = {
  dataHolderId: Scalars['ID']['input']
}

export type QueryListDataHolderScanSummariesArgs = {
  dataHolderId: Scalars['ID']['input']
  limit?: InputMaybe<Scalars['Int']['input']>
  nextToken?: InputMaybe<Scalars['String']['input']>
}

export type QueryListDataHoldersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  nextToken?: InputMaybe<Scalars['String']['input']>
  virtualPresenceId: Scalars['ID']['input']
}

export type QueryListVirtualPresencesArgs = {
  input?: InputMaybe<ListVirtualPresencesInput>
}

export type RefreshTokenInput = {
  expiresInEpochMs?: InputMaybe<Scalars['Float']['input']>
  providerIdentity: Scalars['String']['input']
  refreshToken: Scalars['String']['input']
  scopes?: InputMaybe<Array<Scalars['String']['input']>>
}

export type RelationshipProvider =
  'GMAIL_PROVIDER' | 'TEST_PROVIDER' | '%future added value'

export type RetentionInfo = {
  additionalInfo?: Maybe<Scalars['String']['output']>
  style: RetentionStyle
  timeInDays?: Maybe<Scalars['Int']['output']>
}

export type RetentionStyle =
  | 'INDEFINITE'
  | 'OTHER'
  | 'RELATIVE_TO_ACCOUNT_CLOSURE_TIME'
  | 'RELATIVE_TO_DATA_STORAGE_TIME'
  | '%future added value'

export type RiskIndicators = {
  breachRisk: SignalValue
  collectsSensitiveDataForNonEssentialPurposes: SignalValue
  dataCollectionBreadth: Scalars['Int']['output']
  encryptionPractices: SignalValue
  hasIndefiniteRetention: SignalValue
  maxRetentionDays?: Maybe<Scalars['Int']['output']>
  sellsPersonalInformation: SignalValue
}

export type ScanOptionsInput = {
  earliestScanDate?: InputMaybe<Scalars['String']['input']>
  excludeCategories?: InputMaybe<Array<Scalars['String']['input']>>
  excludeDomains?: InputMaybe<Array<Scalars['String']['input']>>
  latestScanDate?: InputMaybe<Scalars['String']['input']>
  maximumItemsProcessed?: InputMaybe<Scalars['Int']['input']>
}

export type ScoreContribution = {
  aspect: Scalars['String']['output']
  contribution: Scalars['Float']['output']
}

export type ScoreCoverage = {
  evaluated: Scalars['Int']['output']
  total: Scalars['Int']['output']
}

export type ShareStyle =
  | 'INFERENCE_SHARED'
  | 'NONE'
  | 'SHARED'
  | 'SHARED_WITH_CONSENT'
  | '%future added value'

export type SignalValue = 'NO' | 'UNKNOWN' | 'YES' | '%future added value'

export type Subscription = {
  /**
   * Subscribe to action status updates for the authenticated user.
   * Emitted each time an action's status changes. Carries the scalar fields of the
   * action; re-query the action to fetch the full assistedPayload.
   */
  onActionStatusUpdate?: Maybe<Action>
  /**
   * Subscribe to analysis result updates for the authenticated user.
   * Emitted each time an analysis result is created or updated.
   * Use getAnalysisResult to fetch the full typed data.
   */
  onAnalysisResultUpdate?: Maybe<AnalysisResultUpdate>
  /**
   * Subscribe to batch data holder updates during discovery.
   * Emitted once per discovery page with all data holders found in that page.
   */
  onDataHoldersUpdate?: Maybe<DataHoldersUpdate>
  /**
   * Subscribe to virtual presence state updates for the authenticated user.
   * Emitted when a virtual presence changes state (e.g. to NEEDS_REAUTH).
   */
  onVirtualPresenceUpdate?: Maybe<VirtualPresence>
}

export type SubscriptionOnActionStatusUpdateArgs = {
  owner: Scalars['ID']['input']
}

export type SubscriptionOnAnalysisResultUpdateArgs = {
  owner: Scalars['ID']['input']
}

export type SubscriptionOnDataHoldersUpdateArgs = {
  owner: Scalars['ID']['input']
}

export type SubscriptionOnVirtualPresenceUpdateArgs = {
  owner: Scalars['ID']['input']
}

export type VirtualPresence = {
  createdAtEpochMs: Scalars['Float']['output']
  dataHolderCount: DataHolderCount
  id: Scalars['ID']['output']
  identifier: Scalars['String']['output']
  lastScanFailureReason?: Maybe<Scalars['String']['output']>
  lastScannedAtEpochMs: Scalars['Float']['output']
  owner: Scalars['ID']['output']
  providerType: ProviderType
  relationshipProvider?: Maybe<RelationshipProvider>
  state: VirtualPresenceState
  updatedAtEpochMs: Scalars['Float']['output']
  version: Scalars['Int']['output']
}

export type VirtualPresenceConnection = {
  items: Array<VirtualPresence>
  nextToken?: Maybe<Scalars['String']['output']>
}

export type VirtualPresenceState =
  | 'CONNECTED'
  | 'ERROR'
  | 'INACTIVE'
  | 'NEEDS_REAUTH'
  | 'SCANNING'
  | '%future added value'
