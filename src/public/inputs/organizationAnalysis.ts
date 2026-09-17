/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrganizationAnalysisMode } from '../typings/organizationAnalysis'

/**
 * Properties required to obtain an organization analysis.
 *
 * @interface GetOrganizationAnalysisInput
 * @property {string} domain The domain to analyze.
 * @property {OrganizationAnalysisMode} mode How to obtain source results. When omitted, the
 *  backend behaves as `Analyze` (read-through).
 */
export interface GetOrganizationAnalysisInput {
  domain: string
  mode?: OrganizationAnalysisMode
}
