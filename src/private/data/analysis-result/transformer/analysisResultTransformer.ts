/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResult as AnalysisResultGraphQL } from '../../../../gen/graphqlTypes'
import { AnalysisResult } from '../../../../public/typings/analysisResult'
import { AnalysisResultEntity } from '../../../domain/entities/analysis-result/analysisResultEntity'
import { AnalysisResultDataTransformer } from './analysisResultDataTransformer'
import { AnalysisResultStatusTransformer } from './analysisResultStatusTransformer'

export class AnalysisResultTransformer {
  private readonly statusTransformer = new AnalysisResultStatusTransformer()
  private readonly dataTransformer = new AnalysisResultDataTransformer()

  fromGraphQLToEntity(data: AnalysisResultGraphQL): AnalysisResultEntity {
    return {
      id: data.id,
      virtualPresenceId: data.virtualPresenceId,
      dataHolderIdentifier: data.dataHolderIdentifier,
      status: this.statusTransformer.fromGraphQLToEntity(data.status),
      lastAnalyzedAt: new Date(data.lastAnalyzedAtEpochMs),
      data: data.data
        ? this.dataTransformer.fromGraphQLToEntity(data.data)
        : undefined,
      owner: data.owner,
      version: data.version,
      createdAt: new Date(data.createdAtEpochMs),
      updatedAt: new Date(data.updatedAtEpochMs),
    }
  }

  fromEntityToAPI(entity: AnalysisResultEntity): AnalysisResult {
    return {
      id: entity.id,
      virtualPresenceId: entity.virtualPresenceId,
      dataHolderIdentifier: entity.dataHolderIdentifier,
      status: this.statusTransformer.fromEntityToAPI(entity.status),
      lastAnalyzedAt: entity.lastAnalyzedAt,
      data: entity.data
        ? this.dataTransformer.fromEntityToAPI(entity.data)
        : undefined,
      owner: entity.owner,
      version: entity.version,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}
