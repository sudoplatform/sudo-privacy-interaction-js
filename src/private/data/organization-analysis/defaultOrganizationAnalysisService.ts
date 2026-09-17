/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrganizationAnalysisEntity } from '../../domain/entities/organization-analysis/organizationAnalysisEntity'
import {
  GetOrganizationAnalysisInput,
  OrganizationAnalysisService,
} from '../../domain/entities/organization-analysis/organizationAnalysisService'
import { ApiClient } from '../common/apiClient'
import { OrganizationAnalysisModeTransformer } from './transformer/organizationAnalysisModeTransformer'
import { OrganizationAnalysisTransformer } from './transformer/organizationAnalysisTransformer'

export class DefaultOrganizationAnalysisService implements OrganizationAnalysisService {
  private readonly organizationAnalysisTransformer =
    new OrganizationAnalysisTransformer()
  private readonly modeTransformer = new OrganizationAnalysisModeTransformer()

  constructor(private readonly appSync: ApiClient) {}

  async getOrganizationAnalysis(
    input: GetOrganizationAnalysisInput,
  ): Promise<OrganizationAnalysisEntity | undefined> {
    const result = await this.appSync.getOrganizationAnalysis({
      domain: input.domain,
      mode: input.mode
        ? this.modeTransformer.fromEntityToGraphQL(input.mode)
        : undefined,
    })
    if (!result) {
      return undefined
    }
    return this.organizationAnalysisTransformer.fromGraphQLToEntity(result)
  }
}
