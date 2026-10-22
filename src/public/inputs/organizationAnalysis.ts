/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  OrganizationAnalysisDomainResolution,
  OrganizationAnalysisMode,
} from '../typings/organizationAnalysis'

/**
 * Properties required to obtain an organization analysis.
 *
 * @interface GetOrganizationAnalysisInput
 * @property {string} domain The domain to analyze.
 * @property {string} name Organization name to analyze (e.g. "amazon", "stripe"). When it resolves
 *  to a domain it takes precedence over `domain`; `domain` remains required and is used as the
 *  fallback when the name cannot be resolved.
 * @property {OrganizationAnalysisMode} mode How to obtain source results. When omitted, the
 *  backend behaves as `Analyze` (read-through).
 * @property {OrganizationAnalysisDomainResolution} resolution How the requested domain is treated
 *  before analysis. When omitted, defaults to `Exact` (the domain is analyzed verbatim).
 */
export interface GetOrganizationAnalysisInput {
  domain: string
  name?: string
  mode?: OrganizationAnalysisMode
  resolution?: OrganizationAnalysisDomainResolution
}
