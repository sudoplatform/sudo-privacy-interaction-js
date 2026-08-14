/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { RetentionStyle as RetentionStyleGraphQL } from '../../../../gen/graphqlTypes'
import { RetentionStyle } from '../../../../public/typings/analysisResult'
import { RetentionStyleEntity } from '../../../domain/entities/analysis-result/analysisResultEntity'

export class RetentionStyleTransformer {
  fromGraphQLToEntity(data: RetentionStyleGraphQL): RetentionStyleEntity {
    switch (data) {
      case 'INDEFINITE':
        return RetentionStyleEntity.Indefinite
      case 'RELATIVE_TO_ACCOUNT_CLOSURE_TIME':
        return RetentionStyleEntity.RelativeToAccountClosureTime
      case 'RELATIVE_TO_DATA_STORAGE_TIME':
        return RetentionStyleEntity.RelativeToDataStorageTime
      case 'OTHER':
        return RetentionStyleEntity.Other
      default:
        return RetentionStyleEntity.Other
    }
  }

  fromEntityToAPI(entity: RetentionStyleEntity): RetentionStyle {
    switch (entity) {
      case RetentionStyleEntity.Indefinite:
        return RetentionStyle.Indefinite
      case RetentionStyleEntity.RelativeToAccountClosureTime:
        return RetentionStyle.RelativeToAccountClosureTime
      case RetentionStyleEntity.RelativeToDataStorageTime:
        return RetentionStyle.RelativeToDataStorageTime
      case RetentionStyleEntity.Other:
        return RetentionStyle.Other
    }
  }
}
