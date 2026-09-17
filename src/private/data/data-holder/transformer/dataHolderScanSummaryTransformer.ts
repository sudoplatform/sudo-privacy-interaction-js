/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataHolderScanSummary as DataHolderScanSummaryGraphQL } from '../../../../gen/graphqlTypes'
import { DataHolderScanSummary } from '../../../../public/typings/dataHolder'
import { DataHolderScanSummaryEntity } from '../../../domain/entities/data-holder/dataHolderEntity'

export class DataHolderScanSummaryTransformer {
  fromGraphQLToEntity(
    data: DataHolderScanSummaryGraphQL,
  ): DataHolderScanSummaryEntity {
    return {
      dataHolderId: data.dataHolderId,
      owner: data.owner,
      scannedAt: new Date(data.scannedAtEpochMs),
      scanRangeFrom: new Date(data.scanRangeFromEpochMs),
      scanRangeTo: new Date(data.scanRangeToEpochMs),
      emailCount: data.emailCount,
      readCount: data.readCount,
      readRate: data.readRate,
      marketingEmailCount: data.marketingEmailCount,
      marketingEmailOpened: data.marketingEmailOpened,
      marketingOpenRate: data.marketingOpenRate,
      categoryBreakdown: this.parseCategoryBreakdown(data.categoryBreakdown),
      uncategorizedCount: data.uncategorizedCount,
    }
  }

  fromEntityToAPI(entity: DataHolderScanSummaryEntity): DataHolderScanSummary {
    return {
      dataHolderId: entity.dataHolderId,
      owner: entity.owner,
      scannedAt: entity.scannedAt,
      scanRangeFrom: entity.scanRangeFrom,
      scanRangeTo: entity.scanRangeTo,
      emailCount: entity.emailCount,
      readCount: entity.readCount,
      readRate: entity.readRate,
      marketingEmailCount: entity.marketingEmailCount,
      marketingEmailOpened: entity.marketingEmailOpened,
      marketingOpenRate: entity.marketingOpenRate,
      categoryBreakdown: { ...entity.categoryBreakdown },
      uncategorizedCount: entity.uncategorizedCount,
    }
  }

  /**
   * The `categoryBreakdown` field is an AWSJSON scalar, which is delivered as a
   * JSON-encoded string. Parse it into a category-to-count map. Accepts an
   * already-parsed object for resilience.
   */
  private parseCategoryBreakdown(value: unknown): Record<string, number> {
    if (typeof value === 'string') {
      return JSON.parse(value) as Record<string, number>
    }
    return (value as Record<string, number>) ?? {}
  }
}
