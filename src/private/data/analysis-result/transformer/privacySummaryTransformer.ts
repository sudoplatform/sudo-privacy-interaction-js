/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { PrivacySummary as PrivacySummaryGraphQL } from '../../../../gen/graphqlTypes'
import { PrivacySummary } from '../../../../public/typings/analysisResult'
import { PrivacySummaryEntity } from '../../../domain/entities/analysis-result/analysisResultEntity'

export class PrivacySummaryTransformer {
  fromGraphQLToEntity(data: PrivacySummaryGraphQL): PrivacySummaryEntity {
    return {
      bulletPoints: [...data.bulletPoints],
      sourceUrl: data.sourceUrl,
      sourceLastUpdated: data.sourceLastUpdated ?? undefined,
    }
  }

  fromEntityToAPI(entity: PrivacySummaryEntity): PrivacySummary {
    return {
      bulletPoints: [...entity.bulletPoints],
      sourceUrl: entity.sourceUrl,
      sourceLastUpdated: entity.sourceLastUpdated,
    }
  }
}
