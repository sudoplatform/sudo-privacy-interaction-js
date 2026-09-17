/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrganizationAnalysis as OrganizationAnalysisGraphQL } from '../../../../gen/graphqlTypes'
import { OrganizationAnalysis } from '../../../../public/typings/organizationAnalysis'
import { OrganizationAnalysisEntity } from '../../../domain/entities/organization-analysis/organizationAnalysisEntity'
import { AnalysisResultDataTransformer } from '../../analysis-result/transformer/analysisResultDataTransformer'
import { AnalysisResultStatusTransformer } from '../../analysis-result/transformer/analysisResultStatusTransformer'

export class OrganizationAnalysisTransformer {
  private readonly statusTransformer = new AnalysisResultStatusTransformer()
  private readonly dataTransformer = new AnalysisResultDataTransformer()

  fromGraphQLToEntity(
    data: OrganizationAnalysisGraphQL,
  ): OrganizationAnalysisEntity {
    return {
      id: data.id,
      domain: data.domain,
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

  fromEntityToAPI(entity: OrganizationAnalysisEntity): OrganizationAnalysis {
    return {
      id: entity.id,
      domain: entity.domain,
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
