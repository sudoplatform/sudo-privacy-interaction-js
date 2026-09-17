/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResultData, AnalysisResultStatus } from './analysisResult'

/**
 * The Sudo Platform SDK representation of a shared, domain-keyed privacy analysis
 * of an organization.
 *
 * The same underlying analysis is returned to every caller asking about the same
 * domain; it carries only organization-generic signals. `id` equals the analyzed
 * domain and `owner` is the requesting caller.
 *
 * @interface OrganizationAnalysis
 * @property {string} id Identifies the shared analysis. Equal to the analyzed domain.
 * @property {string} domain The analyzed domain (equal to id).
 * @property {AnalysisResultStatus} status Aggregate status. Pending while an asynchronous
 *  source is still resolving; re-query for the terminal result.
 * @property {Date} lastAnalyzedAt When the aggregate was last derived.
 * @property {AnalysisResultData} data Structured analysis payload. Populated when status is
 *  Complete or Partial.
 * @property {string} owner The caller who requested this view. The underlying analysis is shared.
 * @property {number} version Version of this entity. Increments on update.
 * @property {Date} createdAt Date for when the analysis was created.
 * @property {Date} updatedAt Date for when the analysis was last updated.
 */
export interface OrganizationAnalysis {
  id: string
  domain: string
  status: AnalysisResultStatus
  lastAnalyzedAt: Date
  data?: AnalysisResultData
  owner: string
  version: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Controls how `getOrganizationAnalysis` obtains source results when the stored
 * analysis is stale or absent.
 *
 * @property Analyze Read-through: request analysis from the sources, which may compute and
 *  leave the result pending until asynchronous work completes.
 * @property Fetch Pull only the sources' existing values; never request new work. A stale
 *  domain with no existing source value is not moved to pending.
 *
 * @enum
 */
export enum OrganizationAnalysisMode {
  Analyze = 'ANALYZE',
  Fetch = 'FETCH',
}
