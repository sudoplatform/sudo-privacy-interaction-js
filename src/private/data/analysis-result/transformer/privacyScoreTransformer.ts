/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { PrivacyScore as PrivacyScoreGraphQL } from '../../../../gen/graphqlTypes'
import { PrivacyScore } from '../../../../public/typings/analysisResult'
import { PrivacyScoreEntity } from '../../../domain/entities/analysis-result/analysisResultEntity'

export class PrivacyScoreTransformer {
  fromGraphQLToEntity(data: PrivacyScoreGraphQL): PrivacyScoreEntity {
    return {
      score: data.score,
      breakdown: data.breakdown.map((b) => ({
        aspect: b.aspect,
        contribution: b.contribution,
      })),
    }
  }

  fromEntityToAPI(entity: PrivacyScoreEntity): PrivacyScore {
    return {
      score: entity.score,
      breakdown: entity.breakdown.map((b) => ({
        aspect: b.aspect,
        contribution: b.contribution,
      })),
    }
  }
}
