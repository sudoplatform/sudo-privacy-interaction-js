/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Options to control a rescan operation.
 *
 * @interface ScanOptionsEntity
 * @property {number} maximumItemsProcessed Maximum number of items to process during the scan.
 * @property {string} earliestScanDate Earliest date boundary for the scan (ISO 8601 string).
 * @property {string} latestScanDate Latest date boundary for the scan (ISO 8601 string).
 * @property {string[]} excludeDomains Domains to exclude from the scan.
 * @property {string[]} excludeCategories Categories to exclude from the scan.
 */
export interface ScanOptionsEntity {
  maximumItemsProcessed?: number
  earliestScanDate?: string
  latestScanDate?: string
  excludeDomains?: string[]
  excludeCategories?: string[]
}
