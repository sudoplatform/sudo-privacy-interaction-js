/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ProviderTypeEntity,
  VirtualPresenceEntity,
  VirtualPresenceStateEntity,
} from '../../src/private/domain/entities/virtual-presence/virtualPresenceEntity'
import {
  DataHolderEntity,
  DataHolderProtectionStateEntity,
} from '../../src/private/domain/entities/data-holder/dataHolderEntity'
import {
  AnalysisResultDataEntity,
  AnalysisResultEntity,
  AnalysisResultStatusEntity,
  CapabilitySignalsEntity,
  CategorySignalsEntity,
  DataCategoryEntity,
  OrganizationCategoryEntity,
  OrganizationIdentityEntity,
  PrivacyScoreEntity,
  PrivacySummaryEntity,
  RetentionInfoEntity,
  RetentionStyleEntity,
  RiskIndicatorsEntity,
  ShareStyleEntity,
  SignalValueEntity,
} from '../../src/private/domain/entities/analysis-result/analysisResultEntity'

export class EntityDataFactory {
  private static readonly commonProps = {
    id: 'testId',
    owner: 'testOwner',
    version: 1,
    createdAt: new Date(1.0),
    updatedAt: new Date(2.0),
  }

  static readonly virtualPresence: VirtualPresenceEntity = {
    ...EntityDataFactory.commonProps,
    providerType: ProviderTypeEntity.Email,
    identifier: 'test@example.com',
    state: VirtualPresenceStateEntity.Connected,
    lastScannedAt: new Date(2.0),
  }

  static readonly dataHolder: DataHolderEntity = {
    ...EntityDataFactory.commonProps,
    virtualPresenceId: 'testVirtualPresenceId',
    domainName: 'example.com',
    name: 'Foobar Corp',
    protectionState: DataHolderProtectionStateEntity.Monitored,
    complianceConcern: false,
    mostRecentInteractionAt: new Date(3.0),
  }

  static readonly retentionInfo: RetentionInfoEntity = {
    style: RetentionStyleEntity.Indefinite,
    timeInDays: 30,
    additionalInfo: 'Some info',
  }

  static readonly privacyScore: PrivacyScoreEntity = {
    score: 67,
    breakdown: [{ aspect: 'dataCollection', contribution: -10 }],
  }

  static readonly privacySummary: PrivacySummaryEntity = {
    bulletPoints: ['Collects email addresses'],
    sourceUrl: 'https://example.com/privacy',
    sourceLastUpdated: '2026-01-01',
  }

  static readonly categorySignals: CategorySignalsEntity = {
    category: DataCategoryEntity.Pii,
    collected: SignalValueEntity.Yes,
    dataLabels: ['email address', 'full name'],
    sharedWithThirdParties: ShareStyleEntity.None,
    usedForAdvertising: SignalValueEntity.Unknown,
    retained: SignalValueEntity.Yes,
    retention: EntityDataFactory.retentionInfo,
    userCanOptOut: SignalValueEntity.Yes,
    requiredForService: SignalValueEntity.Yes,
    requiredForLaw: SignalValueEntity.No,
  }

  static readonly capabilitySignals: CapabilitySignalsEntity = {
    supportsAccountCreation: SignalValueEntity.Yes,
    supportsAccountDeletion: SignalValueEntity.Yes,
    supportsDataDeletionRequests: SignalValueEntity.Yes,
    supportsDataExport: SignalValueEntity.Unknown,
    supportsSubscriptions: SignalValueEntity.No,
    sellsPersonalInformation: SignalValueEntity.No,
    usesCookiesOrTracking: SignalValueEntity.Yes,
  }

  static readonly riskIndicators: RiskIndicatorsEntity = {
    dataCollectionBreadth: 3,
    collectsSensitiveDataForNonEssentialPurposes: SignalValueEntity.No,
    sellsPersonalInformation: SignalValueEntity.No,
    maxRetentionDays: 90,
    hasIndefiniteRetention: SignalValueEntity.Yes,
    encryptionPractices: SignalValueEntity.Unknown,
    breachRisk: SignalValueEntity.Unknown,
  }

  static readonly organizationIdentity: OrganizationIdentityEntity = {
    brandName: 'Foobar',
    companyName: 'Foobar Corp',
    primaryCategory: OrganizationCategoryEntity.Technology,
    categories: [
      OrganizationCategoryEntity.Technology,
      OrganizationCategoryEntity.Shopping,
    ],
  }

  static readonly analysisResultData: AnalysisResultDataEntity = {
    privacyScore: EntityDataFactory.privacyScore,
    privacySummary: EntityDataFactory.privacySummary,
    categories: [EntityDataFactory.categorySignals],
    capabilities: EntityDataFactory.capabilitySignals,
    riskIndicators: EntityDataFactory.riskIndicators,
    organizationIdentity: EntityDataFactory.organizationIdentity,
  }

  static readonly analysisResult: AnalysisResultEntity = {
    ...EntityDataFactory.commonProps,
    virtualPresenceId: 'testVirtualPresenceId',
    dataHolderIdentifier: 'example.com',
    status: AnalysisResultStatusEntity.Complete,
    lastAnalyzedAt: new Date(4.0),
    data: EntityDataFactory.analysisResultData,
  }

  static readonly analysisResultPending: AnalysisResultEntity = {
    ...EntityDataFactory.commonProps,
    virtualPresenceId: 'testVirtualPresenceId',
    dataHolderIdentifier: 'example.com',
    status: AnalysisResultStatusEntity.Pending,
    lastAnalyzedAt: new Date(4.0),
    data: undefined,
  }
}
