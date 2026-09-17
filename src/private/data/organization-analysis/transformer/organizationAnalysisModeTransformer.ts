/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrganizationAnalysisMode as OrganizationAnalysisModeGraphQL } from '../../../../gen/graphqlTypes'
import { OrganizationAnalysisMode } from '../../../../public/typings/organizationAnalysis'
import { OrganizationAnalysisModeEntity } from '../../../domain/entities/organization-analysis/organizationAnalysisEntity'

export class OrganizationAnalysisModeTransformer {
  fromAPIToEntity(
    mode: OrganizationAnalysisMode,
  ): OrganizationAnalysisModeEntity {
    switch (mode) {
      case OrganizationAnalysisMode.Analyze:
        return OrganizationAnalysisModeEntity.Analyze
      case OrganizationAnalysisMode.Fetch:
        return OrganizationAnalysisModeEntity.Fetch
    }
  }

  fromEntityToGraphQL(
    mode: OrganizationAnalysisModeEntity,
  ): OrganizationAnalysisModeGraphQL {
    switch (mode) {
      case OrganizationAnalysisModeEntity.Analyze:
        return 'ANALYZE'
      case OrganizationAnalysisModeEntity.Fetch:
        return 'FETCH'
    }
  }
}
