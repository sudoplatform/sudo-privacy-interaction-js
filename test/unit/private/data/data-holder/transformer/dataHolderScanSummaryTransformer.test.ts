/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataHolderScanSummaryTransformer } from '../../../../../../src/private/data/data-holder/transformer/dataHolderScanSummaryTransformer'
import { APIDataFactory } from '../../../../../data-factory/api'
import { EntityDataFactory } from '../../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../../data-factory/graphQL'

describe('DataHolderScanSummaryTransformer Test Suite', () => {
  const instanceUnderTest = new DataHolderScanSummaryTransformer()

  describe('fromGraphQLToEntity', () => {
    it('transforms GraphQL scan summary to entity correctly', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity(
          GraphQLDataFactory.dataHolderScanSummary,
        ),
      ).toStrictEqual(EntityDataFactory.dataHolderScanSummary)
    })

    it('parses categoryBreakdown when delivered as an object', () => {
      const result = instanceUnderTest.fromGraphQLToEntity({
        ...GraphQLDataFactory.dataHolderScanSummary,
        categoryBreakdown: { promotions: 30, updates: 10 },
      })

      expect(result.categoryBreakdown).toStrictEqual({
        promotions: 30,
        updates: 10,
      })
    })
  })

  describe('fromEntityToAPI', () => {
    it('transforms entity scan summary to API correctly', () => {
      expect(
        instanceUnderTest.fromEntityToAPI(
          EntityDataFactory.dataHolderScanSummary,
        ),
      ).toStrictEqual(APIDataFactory.dataHolderScanSummary)
    })
  })
})
