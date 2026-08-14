/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShareStyle as ShareStyleGraphQL } from '../../../../gen/graphqlTypes'
import { ShareStyle } from '../../../../public/typings/analysisResult'
import { ShareStyleEntity } from '../../../domain/entities/analysis-result/analysisResultEntity'

export class ShareStyleTransformer {
  fromGraphQLToEntity(data: ShareStyleGraphQL): ShareStyleEntity {
    switch (data) {
      case 'SHARED':
        return ShareStyleEntity.Shared
      case 'SHARED_WITH_CONSENT':
        return ShareStyleEntity.SharedWithConsent
      case 'INFERENCE_SHARED':
        return ShareStyleEntity.InferenceShared
      case 'NONE':
        return ShareStyleEntity.None
      default:
        return ShareStyleEntity.Unknown
    }
  }

  fromEntityToAPI(entity: ShareStyleEntity): ShareStyle {
    switch (entity) {
      case ShareStyleEntity.Shared:
        return ShareStyle.Shared
      case ShareStyleEntity.SharedWithConsent:
        return ShareStyle.SharedWithConsent
      case ShareStyleEntity.InferenceShared:
        return ShareStyle.InferenceShared
      case ShareStyleEntity.None:
        return ShareStyle.None
      case ShareStyleEntity.Unknown:
        return ShareStyle.Unknown
    }
  }
}
