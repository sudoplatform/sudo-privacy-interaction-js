/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { PrivacySummaryTransformer } from '../../../../../../src/private/data/analysis-result/transformer/privacySummaryTransformer'
import { APIDataFactory } from '../../../../../data-factory/api'
import { EntityDataFactory } from '../../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../../data-factory/graphQL'

describe('PrivacySummaryTransformer Test Suite', () => {
  const instanceUnderTest = new PrivacySummaryTransformer()

  describe('fromGraphQLToEntity', () => {
    it('transforms GraphQL privacy summary to entity correctly', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity(
          GraphQLDataFactory.privacySummary,
        ),
      ).toStrictEqual(EntityDataFactory.privacySummary)
    })
  })

  describe('fromEntityToAPI', () => {
    it('transforms entity privacy summary to API correctly', () => {
      expect(
        instanceUnderTest.fromEntityToAPI(EntityDataFactory.privacySummary),
      ).toStrictEqual(APIDataFactory.privacySummary)
    })
  })
})
