/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  OrganizationAnalysisEntity,
  OrganizationAnalysisModeEntity,
} from './organizationAnalysisEntity'

/**
 * Input for `OrganizationAnalysisService.getOrganizationAnalysis` method.
 *
 * @interface GetOrganizationAnalysisInput
 * @property {string} domain The domain to analyze.
 * @property {OrganizationAnalysisModeEntity} mode How to obtain source results. When omitted,
 *  the backend behaves as ANALYZE.
 */
export interface GetOrganizationAnalysisInput {
  domain: string
  mode?: OrganizationAnalysisModeEntity
}

/**
 * Core entity representation of an organization analysis service used in business logic.
 *
 * @interface OrganizationAnalysisService
 */
export interface OrganizationAnalysisService {
  /**
   * Analyze (read-through) and return the shared, organization-generic analysis for a domain.
   * Returns a result with PENDING status when an asynchronous source is still resolving;
   * re-query for the terminal result.
   *
   * @param {GetOrganizationAnalysisInput} input Parameters used to obtain the analysis.
   * @returns {OrganizationAnalysisEntity | undefined} The organization analysis, or undefined
   *  if not found.
   */
  getOrganizationAnalysis(
    input: GetOrganizationAnalysisInput,
  ): Promise<OrganizationAnalysisEntity | undefined>
}
