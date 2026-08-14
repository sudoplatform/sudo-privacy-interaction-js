/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResultData as AnalysisResultDataGraphQL } from '../../../../gen/graphqlTypes'
import { AnalysisResultData } from '../../../../public/typings/analysisResult'
import {
  AnalysisResultDataEntity,
  OrganizationCategoryEntity,
} from '../../../domain/entities/analysis-result/analysisResultEntity'
import { CapabilitySignalsTransformer } from './capabilitySignalsTransformer'
import { CategorySignalsTransformer } from './categorySignalsTransformer'
import { OrganizationIdentityTransformer } from './organizationIdentityTransformer'
import { PrivacyScoreTransformer } from './privacyScoreTransformer'
import { PrivacySummaryTransformer } from './privacySummaryTransformer'
import { RiskIndicatorsTransformer } from './riskIndicatorsTransformer'

export class AnalysisResultDataTransformer {
  private readonly privacyScoreTransformer = new PrivacyScoreTransformer()
  private readonly privacySummaryTransformer = new PrivacySummaryTransformer()
  private readonly categorySignalsTransformer = new CategorySignalsTransformer()
  private readonly capabilitySignalsTransformer =
    new CapabilitySignalsTransformer()
  private readonly riskIndicatorsTransformer = new RiskIndicatorsTransformer()
  private readonly organizationIdentityTransformer =
    new OrganizationIdentityTransformer()

  fromGraphQLToEntity(
    data: AnalysisResultDataGraphQL,
  ): AnalysisResultDataEntity {
    return {
      privacyScore: data.privacyScore
        ? this.privacyScoreTransformer.fromGraphQLToEntity(data.privacyScore)
        : undefined,
      privacySummary: this.privacySummaryTransformer.fromGraphQLToEntity(
        data.privacySummary,
      ),
      categories: data.categories.map((c) =>
        this.categorySignalsTransformer.fromGraphQLToEntity(c),
      ),
      capabilities: this.capabilitySignalsTransformer.fromGraphQLToEntity(
        data.capabilities,
      ),
      riskIndicators: this.riskIndicatorsTransformer.fromGraphQLToEntity(
        data.riskIndicators,
      ),
      organizationIdentity: data.organizationIdentity
        ? this.organizationIdentityTransformer.fromGraphQLToEntity(
            data.organizationIdentity,
          )
        : {
            brandName: '',
            companyName: '',
            primaryCategory: OrganizationCategoryEntity.Other,
            categories: [],
          },
    }
  }

  fromEntityToAPI(entity: AnalysisResultDataEntity): AnalysisResultData {
    return {
      privacyScore: entity.privacyScore
        ? this.privacyScoreTransformer.fromEntityToAPI(entity.privacyScore)
        : undefined,
      privacySummary: this.privacySummaryTransformer.fromEntityToAPI(
        entity.privacySummary,
      ),
      categories: entity.categories.map((c) =>
        this.categorySignalsTransformer.fromEntityToAPI(c),
      ),
      capabilities: this.capabilitySignalsTransformer.fromEntityToAPI(
        entity.capabilities,
      ),
      riskIndicators: this.riskIndicatorsTransformer.fromEntityToAPI(
        entity.riskIndicators,
      ),
      organizationIdentity: entity.organizationIdentity
        ? this.organizationIdentityTransformer.fromEntityToAPI(
            entity.organizationIdentity,
          )
        : undefined,
    }
  }
}
