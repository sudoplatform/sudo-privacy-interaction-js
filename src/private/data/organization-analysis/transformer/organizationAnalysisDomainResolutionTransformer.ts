/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrganizationAnalysisDomainResolution as OrganizationAnalysisDomainResolutionGraphQL } from '../../../../gen/graphqlTypes'
import { OrganizationAnalysisDomainResolution } from '../../../../public/typings/organizationAnalysis'
import { OrganizationAnalysisDomainResolutionEntity } from '../../../domain/entities/organization-analysis/organizationAnalysisEntity'

export class OrganizationAnalysisDomainResolutionTransformer {
  fromAPIToEntity(
    resolution: OrganizationAnalysisDomainResolution,
  ): OrganizationAnalysisDomainResolutionEntity {
    switch (resolution) {
      case OrganizationAnalysisDomainResolution.Registrable:
        return OrganizationAnalysisDomainResolutionEntity.Registrable
      case OrganizationAnalysisDomainResolution.Exact:
        return OrganizationAnalysisDomainResolutionEntity.Exact
    }
  }

  fromEntityToGraphQL(
    resolution: OrganizationAnalysisDomainResolutionEntity,
  ): OrganizationAnalysisDomainResolutionGraphQL {
    switch (resolution) {
      case OrganizationAnalysisDomainResolutionEntity.Registrable:
        return 'REGISTRABLE'
      case OrganizationAnalysisDomainResolutionEntity.Exact:
        return 'EXACT'
    }
  }
}
