/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResultStatusReason as AnalysisResultStatusReasonGraphQL } from '../../../../gen/graphqlTypes'
import { AnalysisResultStatusReason } from '../../../../public/typings/analysisResult'
import { AnalysisResultStatusReasonEntity } from '../../../domain/entities/analysis-result/analysisResultEntity'

export class AnalysisResultStatusReasonTransformer {
  fromGraphQLToEntity(
    data: AnalysisResultStatusReasonGraphQL | null | undefined,
  ): AnalysisResultStatusReasonEntity | undefined {
    switch (data) {
      case 'INVALID_DOMAIN':
        return AnalysisResultStatusReasonEntity.InvalidDomain
      case 'POLICY_UNAVAILABLE':
        return AnalysisResultStatusReasonEntity.PolicyUnavailable
      case 'MALICIOUS':
        return AnalysisResultStatusReasonEntity.Malicious
      case 'NOT_ATTEMPTED':
        return AnalysisResultStatusReasonEntity.NotAttempted
      case 'OTHER':
        return AnalysisResultStatusReasonEntity.Other
      default:
        return undefined
    }
  }

  fromEntityToAPI(
    entity: AnalysisResultStatusReasonEntity | undefined,
  ): AnalysisResultStatusReason | undefined {
    switch (entity) {
      case AnalysisResultStatusReasonEntity.InvalidDomain:
        return AnalysisResultStatusReason.InvalidDomain
      case AnalysisResultStatusReasonEntity.PolicyUnavailable:
        return AnalysisResultStatusReason.PolicyUnavailable
      case AnalysisResultStatusReasonEntity.Malicious:
        return AnalysisResultStatusReason.Malicious
      case AnalysisResultStatusReasonEntity.NotAttempted:
        return AnalysisResultStatusReason.NotAttempted
      case AnalysisResultStatusReasonEntity.Other:
        return AnalysisResultStatusReason.Other
      default:
        return undefined
    }
  }
}
