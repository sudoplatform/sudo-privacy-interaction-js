/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResultStatus as AnalysisResultStatusGraphQL } from '../../../../gen/graphqlTypes'
import { AnalysisResultStatus } from '../../../../public/typings/analysisResult'
import { AnalysisResultStatusEntity } from '../../../domain/entities/analysis-result/analysisResultEntity'

export class AnalysisResultStatusTransformer {
  fromGraphQLToEntity(
    data: AnalysisResultStatusGraphQL,
  ): AnalysisResultStatusEntity {
    switch (data) {
      case 'PENDING':
        return AnalysisResultStatusEntity.Pending
      case 'COMPLETE':
        return AnalysisResultStatusEntity.Complete
      case 'PARTIAL':
        return AnalysisResultStatusEntity.Partial
      case 'FAILED':
        return AnalysisResultStatusEntity.Failed
      case 'UNAVAILABLE':
        return AnalysisResultStatusEntity.Unavailable
      default:
        return AnalysisResultStatusEntity.Unavailable
    }
  }

  fromEntityToAPI(entity: AnalysisResultStatusEntity): AnalysisResultStatus {
    switch (entity) {
      case AnalysisResultStatusEntity.Pending:
        return AnalysisResultStatus.Pending
      case AnalysisResultStatusEntity.Complete:
        return AnalysisResultStatus.Complete
      case AnalysisResultStatusEntity.Partial:
        return AnalysisResultStatus.Partial
      case AnalysisResultStatusEntity.Failed:
        return AnalysisResultStatus.Failed
      case AnalysisResultStatusEntity.Unavailable:
        return AnalysisResultStatus.Unavailable
    }
  }
}
