/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { RetentionInfo as RetentionInfoGraphQL } from '../../../../gen/graphqlTypes'
import { RetentionInfo } from '../../../../public/typings/analysisResult'
import { RetentionInfoEntity } from '../../../domain/entities/analysis-result/analysisResultEntity'
import { RetentionStyleTransformer } from './retentionStyleTransformer'

export class RetentionInfoTransformer {
  private readonly retentionStyleTransformer = new RetentionStyleTransformer()

  fromGraphQLToEntity(data: RetentionInfoGraphQL): RetentionInfoEntity {
    return {
      style: this.retentionStyleTransformer.fromGraphQLToEntity(data.style),
      timeInDays: data.timeInDays ?? undefined,
      additionalInfo: data.additionalInfo ?? undefined,
    }
  }

  fromEntityToAPI(entity: RetentionInfoEntity): RetentionInfo {
    return {
      style: this.retentionStyleTransformer.fromEntityToAPI(entity.style),
      timeInDays: entity.timeInDays,
      additionalInfo: entity.additionalInfo,
    }
  }
}
