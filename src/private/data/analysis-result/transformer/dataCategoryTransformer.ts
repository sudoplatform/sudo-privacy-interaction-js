/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataCategory as DataCategoryGraphQL } from '../../../../gen/graphqlTypes'
import { DataCategory } from '../../../../public/typings/analysisResult'
import { DataCategoryEntity } from '../../../domain/entities/analysis-result/analysisResultEntity'

export class DataCategoryTransformer {
  fromGraphQLToEntity(data: DataCategoryGraphQL): DataCategoryEntity {
    switch (data) {
      case 'ACCOUNT_PROFILE':
        return DataCategoryEntity.AccountProfile
      case 'AUTHENTICATION':
        return DataCategoryEntity.Authentication
      case 'BACKGROUND':
        return DataCategoryEntity.Background
      case 'BIOMETRIC':
        return DataCategoryEntity.Biometric
      case 'COMMUNICATION':
        return DataCategoryEntity.Communication
      case 'CONTACTS':
        return DataCategoryEntity.Contacts
      case 'DEMOGRAPHIC':
        return DataCategoryEntity.Demographic
      case 'DEVICE_IDENTIFIER':
        return DataCategoryEntity.DeviceIdentifier
      case 'FINANCIAL':
        return DataCategoryEntity.Financial
      case 'GOVERNMENT_ISSUED':
        return DataCategoryEntity.GovernmentIssued
      case 'HEALTH':
        return DataCategoryEntity.Health
      case 'INFERENCES':
        return DataCategoryEntity.Inferences
      case 'LOCATION':
        return DataCategoryEntity.Location
      case 'OTHER':
        return DataCategoryEntity.Other
      case 'PII':
        return DataCategoryEntity.Pii
      case 'THIRD_PARTY_DATA':
        return DataCategoryEntity.ThirdPartyData
      case 'USAGE':
        return DataCategoryEntity.Usage
      default:
        return DataCategoryEntity.Other
    }
  }

  fromEntityToAPI(entity: DataCategoryEntity): DataCategory {
    switch (entity) {
      case DataCategoryEntity.AccountProfile:
        return DataCategory.AccountProfile
      case DataCategoryEntity.Authentication:
        return DataCategory.Authentication
      case DataCategoryEntity.Background:
        return DataCategory.Background
      case DataCategoryEntity.Biometric:
        return DataCategory.Biometric
      case DataCategoryEntity.Communication:
        return DataCategory.Communication
      case DataCategoryEntity.Contacts:
        return DataCategory.Contacts
      case DataCategoryEntity.Demographic:
        return DataCategory.Demographic
      case DataCategoryEntity.DeviceIdentifier:
        return DataCategory.DeviceIdentifier
      case DataCategoryEntity.Financial:
        return DataCategory.Financial
      case DataCategoryEntity.GovernmentIssued:
        return DataCategory.GovernmentIssued
      case DataCategoryEntity.Health:
        return DataCategory.Health
      case DataCategoryEntity.Inferences:
        return DataCategory.Inferences
      case DataCategoryEntity.Location:
        return DataCategory.Location
      case DataCategoryEntity.Other:
        return DataCategory.Other
      case DataCategoryEntity.Pii:
        return DataCategory.Pii
      case DataCategoryEntity.ThirdPartyData:
        return DataCategory.ThirdPartyData
      case DataCategoryEntity.Usage:
        return DataCategory.Usage
    }
  }
}
