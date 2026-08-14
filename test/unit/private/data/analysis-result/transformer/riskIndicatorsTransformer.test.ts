/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { RiskIndicatorsTransformer } from '../../../../../../src/private/data/analysis-result/transformer/riskIndicatorsTransformer'
import { APIDataFactory } from '../../../../../data-factory/api'
import { EntityDataFactory } from '../../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../../data-factory/graphQL'

describe('RiskIndicatorsTransformer Test Suite', () => {
  const instanceUnderTest = new RiskIndicatorsTransformer()

  describe('fromGraphQLToEntity', () => {
    it('transforms GraphQL risk indicators to entity correctly', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity(
          GraphQLDataFactory.riskIndicators,
        ),
      ).toStrictEqual(EntityDataFactory.riskIndicators)
    })
  })

  describe('fromEntityToAPI', () => {
    it('transforms entity risk indicators to API correctly', () => {
      expect(
        instanceUnderTest.fromEntityToAPI(EntityDataFactory.riskIndicators),
      ).toStrictEqual(APIDataFactory.riskIndicators)
    })
  })
})
