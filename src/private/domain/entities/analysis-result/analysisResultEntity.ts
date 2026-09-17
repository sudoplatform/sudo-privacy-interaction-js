/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Core entity representation of an analysis result.
 *
 * @interface AnalysisResultEntity
 * @property {string} id Unique identifier associated with the analysis result.
 * @property {string} owner Unique identifier of the user.
 * @property {string} virtualPresenceId The virtual presence this analysis is associated with.
 * @property {string} dataHolderIdentifier The data holder domain that this analysis is about.
 * @property {AnalysisResultStatusEntity} status Current status of the analysis.
 * @property {Date} lastAnalyzedAt Date for when the analysis was last performed.
 * @property {AnalysisResultDataEntity} data Structured analysis data. Populated when status is COMPLETE or PARTIAL.
 * @property {number} version Version of this entity. Increments on update.
 * @property {Date} createdAt Date for when the analysis result was created.
 * @property {Date} updatedAt Date for when the analysis result was last updated.
 */
export interface AnalysisResultEntity {
  id: string
  virtualPresenceId: string
  dataHolderIdentifier: string
  status: AnalysisResultStatusEntity
  lastAnalyzedAt: Date
  data?: AnalysisResultDataEntity
  owner: string
  version: number
  createdAt: Date
  updatedAt: Date
}

/**
 * The status of an analysis result.
 *
 * @property PENDING The analysis is queued but has not yet started.
 * @property COMPLETE The analysis has completed successfully with full data.
 * @property PARTIAL The analysis has completed with partial data available.
 * @property FAILED The analysis encountered an error and could not complete.
 * @property UNAVAILABLE The analysis data is not available for this data holder.
 *
 * @enum
 */
export enum AnalysisResultStatusEntity {
  Pending = 'PENDING',
  Complete = 'COMPLETE',
  Partial = 'PARTIAL',
  Failed = 'FAILED',
  Unavailable = 'UNAVAILABLE',
}

/**
 * The structured data payload for an analysis result.
 *
 * @interface AnalysisResultDataEntity
 * @property {PrivacyScoreEntity} privacyScore Overall privacy score.
 *  Undefined when scoring is disabled.
 * @property {PrivacySummaryEntity} privacySummary Concise human-readable summary of privacy findings.
 * @property {CategorySignalsEntity[]} categories Per-category signal breakdown.
 * @property {CapabilitySignalsEntity} capabilities Action-derived capability signals.
 * @property {RiskIndicatorsEntity} riskIndicators Aggregated risk indicators.
 * @property {OrganizationIdentityEntity} organizationIdentity Organization identity (brand, company, business categories).
 * @property {string[]} attribution Information describing where the analysis result is derived from.
 */
export interface AnalysisResultDataEntity {
  privacyScore?: PrivacyScoreEntity
  privacySummary: PrivacySummaryEntity
  categories: CategorySignalsEntity[]
  capabilities: CapabilitySignalsEntity
  riskIndicators: RiskIndicatorsEntity
  organizationIdentity?: OrganizationIdentityEntity
  attribution: string[]
}

/**
 * Overall privacy score for an organization.
 *
 * @interface PrivacyScoreEntity
 * @property {number} score Numeric score (0-100). Higher is better.
 * @property {ScoreContributionEntity[]} breakdown Breakdown of how each aspect contributed to the score.
 * @property {ScoreCoverageEntity} coverage How much of the scoring-relevant input had a known value.
 */
export interface PrivacyScoreEntity {
  score: number
  breakdown: ScoreContributionEntity[]
  coverage: ScoreCoverageEntity
}

/**
 * How much of the scoring-relevant input had a known value. A low ratio means the
 * score rests on few known signals and should be treated as lower-confidence.
 *
 * @interface ScoreCoverageEntity
 * @property {number} evaluated Scoring aspects with a known value.
 * @property {number} total Total scoring aspects the calculator considers.
 */
export interface ScoreCoverageEntity {
  evaluated: number
  total: number
}

/**
 * A single scoring aspect and its contribution to the overall score.
 *
 * @interface ScoreContributionEntity
 * @property {string} aspect Identifier for the scoring aspect (e.g. 'dataCollection', 'dataSharing').
 * @property {number} contribution Numeric contribution to the score (negative = penalty, positive = bonus).
 */
export interface ScoreContributionEntity {
  aspect: string
  contribution: number
}

/**
 * Concise human-readable summary of privacy-related findings.
 *
 * @interface PrivacySummaryEntity
 * @property {string[]} bulletPoints Up to 5 key takeaways, deterministically generated.
 * @property {string} sourceUrl URL of the source material that was analyzed.
 * @property {string} sourceLastUpdated When the source material was last updated (as reported by the organization).
 */
export interface PrivacySummaryEntity {
  bulletPoints: string[]
  sourceUrl: string
  sourceLastUpdated?: string
}

/**
 * Tri-state signal value representing confidence in a determination.
 *
 * @enum
 */
export enum SignalValueEntity {
  Yes = 'YES',
  No = 'NO',
  Unknown = 'UNKNOWN',
}

/**
 * Describes how data in a category is shared with third parties.
 *
 * @property Shared Data is shared with third parties.
 * @property SharedWithConsent Data is shared with third parties only with user consent.
 * @property InferenceShared Inferred data is shared with third parties.
 * @property None Data is not shared with third parties.
 *
 * @enum
 */
export enum ShareStyleEntity {
  Shared = 'SHARED',
  SharedWithConsent = 'SHARED_WITH_CONSENT',
  InferenceShared = 'INFERENCE_SHARED',
  None = 'NONE',
  Unknown = 'UNKNOWN',
}

/**
 * Categories of personal data as identified in a privacy policy.
 *
 * @enum
 */
export enum DataCategoryEntity {
  AccountProfile = 'ACCOUNT_PROFILE',
  Authentication = 'AUTHENTICATION',
  Background = 'BACKGROUND',
  Biometric = 'BIOMETRIC',
  Communication = 'COMMUNICATION',
  Contacts = 'CONTACTS',
  Demographic = 'DEMOGRAPHIC',
  DeviceIdentifier = 'DEVICE_IDENTIFIER',
  Financial = 'FINANCIAL',
  GovernmentIssued = 'GOVERNMENT_ISSUED',
  Health = 'HEALTH',
  Inferences = 'INFERENCES',
  Location = 'LOCATION',
  Other = 'OTHER',
  Pii = 'PII',
  ThirdPartyData = 'THIRD_PARTY_DATA',
  Usage = 'USAGE',
}

/**
 * Enumeration depicting how the data retention period is measured.
 *
 * @property INDEFINITE Data is retained indefinitely with no defined end date.
 * @property RELATIVE_TO_ACCOUNT_CLOSURE_TIME Retention period starts when the account is closed.
 * @property RELATIVE_TO_DATA_STORAGE_TIME Retention period starts when the data is stored.
 * @property OTHER Retention policy does not fit standard categories.
 *
 * @enum
 */
export enum RetentionStyleEntity {
  Indefinite = 'INDEFINITE',
  RelativeToAccountClosureTime = 'RELATIVE_TO_ACCOUNT_CLOSURE_TIME',
  RelativeToDataStorageTime = 'RELATIVE_TO_DATA_STORAGE_TIME',
  Other = 'OTHER',
}

/**
 * Retention details for a specific data category.
 *
 * @interface RetentionInfoEntity
 * @property {RetentionStyleEntity} style How the retention period is expressed.
 * @property {number} timeInDays Retention period in days, when specified.
 * @property {string} additionalInfo Free-text clarification from the policy.
 */
export interface RetentionInfoEntity {
  style: RetentionStyleEntity
  timeInDays?: number
  additionalInfo?: string
}

/**
 * Privacy signals specific to a single data category.
 *
 * @interface CategorySignalsEntity
 * @property {DataCategoryEntity} category The data category these signals apply to.
 * @property {SignalValueEntity} collected Whether this category of data is collected.
 * @property {string[]} dataLabels Descriptive labels for the collected data within this category.
 * @property {ShareStyleEntity} sharedWithThirdParties How this category is shared with third parties.
 * @property {SignalValueEntity} monetized Whether this category is used for monetization.
 * @property {SignalValueEntity} retained Whether this category is retained.
 * @property {RetentionInfoEntity} retention Retention details when data is retained.
 * @property {SignalValueEntity} userCanOptOut Whether the user can opt out of this category's collection.
 * @property {SignalValueEntity} requiredForService Whether this data is required for the core service to function.
 * @property {SignalValueEntity} requiredForLaw Whether this data is collected to comply with legal requirements.
 */
export interface CategorySignalsEntity {
  category: DataCategoryEntity
  collected: SignalValueEntity
  dataLabels: string[]
  sharedWithThirdParties: ShareStyleEntity
  monetized: SignalValueEntity
  retained: SignalValueEntity
  retention?: RetentionInfoEntity
  userCanOptOut: SignalValueEntity
  requiredForService: SignalValueEntity
  requiredForLaw: SignalValueEntity
}

/**
 * Signals derived from privacy actions and capabilities offered by the organization.
 *
 * @interface CapabilitySignalsEntity
 * @property {SignalValueEntity} supportsAccountCreation Whether the organization supports creating an account.
 * @property {SignalValueEntity} supportsAccountDeletion Whether the organization supports account deletion.
 * @property {SignalValueEntity} supportsDataDeletionRequests Whether the organization supports data deletion requests.
 * @property {SignalValueEntity} supportsDataExport Whether the organization supports data export.
 * @property {SignalValueEntity} supportsSubscriptions Whether the organization supports subscription management.
 * @property {SignalValueEntity} sellsPersonalInformation Whether the organization sells personal information.
 * @property {SignalValueEntity} usesCookiesOrTracking Whether the organization uses cookies or tracking.
 * @property {SignalValueEntity} supportsTwoFactorAuth Whether the organization supports two-factor auth for logins.
 */
export interface CapabilitySignalsEntity {
  supportsAccountCreation: SignalValueEntity
  supportsAccountDeletion: SignalValueEntity
  supportsDataDeletionRequests: SignalValueEntity
  supportsDataExport: SignalValueEntity
  supportsSubscriptions: SignalValueEntity
  sellsPersonalInformation: SignalValueEntity
  usesCookiesOrTracking: SignalValueEntity
  supportsTwoFactorAuth: SignalValueEntity
}

/**
 * Aggregated risk indicators derived from categories and capabilities.
 *
 * @interface RiskIndicatorsEntity
 * @property {number} dataCollectionBreadth Total number of data categories collected.
 * @property {SignalValueEntity} collectsSensitiveDataForNonEssentialPurposes Whether sensitive categories
 *  are collected for non-essential purposes.
 * @property {SignalValueEntity} sellsPersonalInformation Whether data selling is indicated.
 * @property {number} maxRetentionDays Longest known retention period in days across all categories.
 * @property {SignalValueEntity} hasIndefiniteRetention Whether any category has indefinite retention.
 * @property {SignalValueEntity} encryptionPractices Whether strong encryption practices are in place.
 * @property {SignalValueEntity} breachRisk Whether there is an elevated risk of data breach.
 */
export interface RiskIndicatorsEntity {
  dataCollectionBreadth: number
  collectsSensitiveDataForNonEssentialPurposes: SignalValueEntity
  sellsPersonalInformation: SignalValueEntity
  maxRetentionDays?: number
  hasIndefiniteRetention: SignalValueEntity
  encryptionPractices: SignalValueEntity
  breachRisk: SignalValueEntity
}

/**
 * The business category of an organization as classified by the analysis.
 *
 * @enum
 */
export enum OrganizationCategoryEntity {
  Automotive = 'Automotive',
  Communications = 'Communications',
  CommunityAndCharity = 'CommunityAndCharity',
  Cryptocurrency = 'Cryptocurrency',
  Dating = 'Dating',
  Education = 'Education',
  Employment = 'Employment',
  EnergyAndUtilities = 'EnergyAndUtilities',
  Entertainment = 'Entertainment',
  Finance = 'Finance',
  FoodAndDining = 'FoodAndDining',
  Gambling = 'Gambling',
  Government = 'Government',
  Health = 'Health',
  Insurance = 'Insurance',
  Military = 'Military',
  News = 'News',
  Other = 'Other',
  PersonalEmail = 'PersonalEmail',
  PrivacyAndSecurity = 'PrivacyAndSecurity',
  RealEstate = 'RealEstate',
  ShippingAndDelivery = 'ShippingAndDelivery',
  Shopping = 'Shopping',
  SocialMedia = 'SocialMedia',
  SportsAndFitness = 'SportsAndFitness',
  Technology = 'Technology',
  Transportation = 'Transportation',
  Travel = 'Travel',
  VideoGames = 'VideoGames',
}

/**
 * Identifies the organization behind a data holder.
 *
 * @interface OrganizationIdentityEntity
 * @property {string} brandName The consumer-facing brand name of the organization.
 * @property {string} companyName The legal or corporate name of the organization.
 * @property {OrganizationCategoryEntity} primaryCategory The primary business category of the organization.
 * @property {OrganizationCategoryEntity[]} categories All business categories the organization belongs to.
 */
export interface OrganizationIdentityEntity {
  brandName: string
  companyName: string
  primaryCategory: OrganizationCategoryEntity
  categories: OrganizationCategoryEntity[]
}
