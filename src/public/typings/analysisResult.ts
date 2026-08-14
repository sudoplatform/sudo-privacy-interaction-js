/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The Sudo Platform SDK representation of an analysis result.
 *
 * @interface AnalysisResult
 * @property {string} id Unique identifier associated with the analysis result.
 * @property {string} owner Unique identifier of the user.
 * @property {string} virtualPresenceId The virtual presence this analysis is associated with.
 * @property {string} dataHolderIdentifier The data holder domain that this analysis is about.
 * @property {AnalysisResultStatus} status Current status of the analysis.
 * @property {Date} lastAnalyzedAt Date for when the analysis was last performed.
 * @property {AnalysisResultData} data Structured analysis data. Populated when status is COMPLETE or PARTIAL.
 * @property {number} version Version of this entity. Increments on update.
 * @property {Date} createdAt Date for when the analysis result was created.
 * @property {Date} updatedAt Date for when the analysis result was last updated.
 */
export interface AnalysisResult {
  id: string
  virtualPresenceId: string
  dataHolderIdentifier: string
  status: AnalysisResultStatus
  lastAnalyzedAt: Date
  data?: AnalysisResultData
  owner: string
  version: number
  createdAt: Date
  updatedAt: Date
}

/**
 * The Sudo Platform SDK representation of a lightweight notification of an analysis result update.
 *
 * @interface AnalysisResultUpdate
 * @property {string} id Unique identifier of the analysis result.
 * @property {string} owner Unique identifier of the user.
 * @property {string} virtualPresenceId The virtual presence this analysis is associated with.
 * @property {string} dataHolderIdentifier The data holder domain that this analysis is about.
 * @property {AnalysisResultStatus} status Current status of the analysis.
 * @property {Date} lastAnalyzedAt Date for when the analysis was last performed.
 * @property {number} version Version of this entity. Increments on update.
 * @property {Date} createdAt Date for when the analysis result was created.
 * @property {Date} updatedAt Date for when the analysis result was last updated.
 */
export interface AnalysisResultUpdate {
  id: string
  virtualPresenceId: string
  dataHolderIdentifier: string
  status: AnalysisResultStatus
  lastAnalyzedAt: Date
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
export enum AnalysisResultStatus {
  Pending = 'PENDING',
  Complete = 'COMPLETE',
  Partial = 'PARTIAL',
  Failed = 'FAILED',
  Unavailable = 'UNAVAILABLE',
}

/**
 * The structured data payload for an analysis result.
 *
 * @interface AnalysisResultData
 * @property {PrivacyScore} privacyScore Overall privacy score for the organization.
 *  Undefined when scoring is disabled.
 * @property {PrivacySummary} privacySummary Concise human-readable summary of privacy findings.
 * @property {CategorySignals[]} categories Per-category signal breakdown.
 * @property {CapabilitySignals} capabilities Action-derived capability signals.
 * @property {RiskIndicators} riskIndicators Aggregated risk indicators.
 * @property {OrganizationIdentity} organizationIdentity Organization identity (brand, company, business categories).
 */
export interface AnalysisResultData {
  privacyScore?: PrivacyScore
  privacySummary: PrivacySummary
  categories: CategorySignals[]
  capabilities: CapabilitySignals
  riskIndicators: RiskIndicators
  organizationIdentity?: OrganizationIdentity
}

/**
 * Overall privacy score for an organization.
 *
 * @interface PrivacyScore
 * @property {number} score Numeric score (0-100). Higher is better.
 * @property {ScoreContribution[]} breakdown Breakdown of how each aspect contributed to the score.
 */
export interface PrivacyScore {
  score: number
  breakdown: ScoreContribution[]
}

/**
 * A single scoring aspect and its contribution to the overall score.
 *
 * @interface ScoreContribution
 * @property {string} aspect Identifier for the scoring aspect (e.g. 'dataCollection', 'dataSharing').
 * @property {number} contribution Numeric contribution to the score (negative = penalty, positive = bonus).
 */
export interface ScoreContribution {
  aspect: string
  contribution: number
}

/**
 * Concise human-readable summary of privacy-related findings.
 *
 * @interface PrivacySummary
 * @property {string[]} bulletPoints Up to 5 key takeaways, deterministically generated.
 * @property {string} sourceUrl URL of the source material that was analyzed.
 * @property {string} sourceLastUpdated When the source material was last updated (as reported by the organization).
 */
export interface PrivacySummary {
  bulletPoints: string[]
  sourceUrl: string
  sourceLastUpdated?: string
}

/**
 * Tri-state signal value representing confidence in a determination.
 *
 * @enum
 */
export enum SignalValue {
  Yes = 'YES',
  No = 'NO',
  Unknown = 'UNKNOWN',
}

/**
 * Describes how data in a category is shared with third parties.
 *
 * @property SHARED Data is shared with third parties.
 * @property SHARED_WITH_CONSENT Data is shared with third parties only with user consent.
 * @property INFERENCE_SHARED Inferred data is shared with third parties.
 * @property NONE Data is not shared with third parties.
 *
 * @enum
 */
export enum ShareStyle {
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
export enum DataCategory {
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
export enum RetentionStyle {
  Indefinite = 'INDEFINITE',
  RelativeToAccountClosureTime = 'RELATIVE_TO_ACCOUNT_CLOSURE_TIME',
  RelativeToDataStorageTime = 'RELATIVE_TO_DATA_STORAGE_TIME',
  Other = 'OTHER',
}

/**
 * Retention details for a specific data category.
 *
 * @interface RetentionInfo
 * @property {RetentionStyle} style How the retention period is expressed.
 * @property {number} timeInDays Retention period in days, when specified.
 * @property {string} additionalInfo Free-text clarification from the policy.
 */
export interface RetentionInfo {
  style: RetentionStyle
  timeInDays?: number
  additionalInfo?: string
}

/**
 * Privacy signals specific to a single data category.
 *
 * @interface CategorySignals
 * @property {DataCategory} category The data category these signals apply to.
 * @property {SignalValue} collected Whether this category of data is collected.
 * @property {string[]} dataLabels Descriptive labels for the collected data within this category.
 * @property {ShareStyle} sharedWithThirdParties How this category is shared with third parties.
 * @property {SignalValue} usedForAdvertising Whether this category is used for advertising or monetization.
 * @property {SignalValue} retained Whether this category is retained.
 * @property {RetentionInfo} retention Retention details when data is retained.
 * @property {SignalValue} userCanOptOut Whether the user can opt out of this category's collection.
 * @property {SignalValue} requiredForService Whether this data is required for the core service to function.
 * @property {SignalValue} requiredForLaw Whether this data is collected to comply with legal requirements.
 */
export interface CategorySignals {
  category: DataCategory
  collected: SignalValue
  dataLabels: string[]
  sharedWithThirdParties: ShareStyle
  usedForAdvertising: SignalValue
  retained: SignalValue
  retention?: RetentionInfo
  userCanOptOut: SignalValue
  requiredForService: SignalValue
  requiredForLaw: SignalValue
}

/**
 * Signals derived from privacy actions and capabilities.
 *
 * @interface CapabilitySignals
 * @property {SignalValue} supportsAccountCreation Whether the organization supports creating an account.
 * @property {SignalValue} supportsAccountDeletion Whether the organization supports account deletion.
 * @property {SignalValue} supportsDataDeletionRequests Whether the organization supports data deletion requests.
 * @property {SignalValue} supportsDataExport Whether the organization supports data export.
 * @property {SignalValue} supportsSubscriptions Whether the organization supports subscription management.
 * @property {SignalValue} sellsPersonalInformation Whether the organization sells personal information.
 * @property {SignalValue} usesCookiesOrTracking Whether the organization uses cookies or tracking.
 */
export interface CapabilitySignals {
  supportsAccountCreation: SignalValue
  supportsAccountDeletion: SignalValue
  supportsDataDeletionRequests: SignalValue
  supportsDataExport: SignalValue
  supportsSubscriptions: SignalValue
  sellsPersonalInformation: SignalValue
  usesCookiesOrTracking: SignalValue
}

/**
 * Aggregated risk indicators derived from categories and capabilities.
 *
 * @interface RiskIndicators
 * @property {number} dataCollectionBreadth Total number of data categories collected.
 * @property {SignalValue} collectsSensitiveDataForNonEssentialPurposes Whether sensitive categories
 *  are collected for non-essential purposes.
 * @property {SignalValue} sellsPersonalInformation Whether data selling is indicated.
 * @property {number} maxRetentionDays Longest known retention period in days across all categories.
 * @property {SignalValue} hasIndefiniteRetention Whether any category has indefinite retention.
 * @property {SignalValue} encryptionPractices Whether strong encryption practices are in place.
 * @property {SignalValue} breachRisk Whether there is an elevated risk of data breach.
 */
export interface RiskIndicators {
  dataCollectionBreadth: number
  collectsSensitiveDataForNonEssentialPurposes: SignalValue
  sellsPersonalInformation: SignalValue
  maxRetentionDays?: number
  hasIndefiniteRetention: SignalValue
  encryptionPractices: SignalValue
  breachRisk: SignalValue
}

/**
 * The business category of an organization as classified by the analysis.
 *
 * @enum
 */
export enum OrganizationCategory {
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
 * @interface OrganizationIdentity
 * @property {string} brandName The consumer-facing brand name of the organization.
 * @property {string} companyName The legal or corporate name of the organization.
 * @property {OrganizationCategory} primaryCategory The primary business category of the organization.
 * @property {OrganizationCategory[]} categories All business categories the organization belongs to.
 */
export interface OrganizationIdentity {
  brandName: string
  companyName: string
  primaryCategory: OrganizationCategory
  categories: OrganizationCategory[]
}
