/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CategorySignalsTransformer } from '../../../../../../src/private/data/analysis-result/transformer/categorySignalsTransformer'
import { APIDataFactory } from '../../../../../data-factory/api'
import { EntityDataFactory } from '../../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../../data-factory/graphQL'

describe('CategorySignalsTransformer Test Suite', () => {
  const instanceUnderTest = new CategorySignalsTransformer()

  describe('fromGraphQLToEntity', () => {
    it('transforms GraphQL category signals to entity correctly', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity(
          GraphQLDataFactory.categorySignals,
        ),
      ).toStrictEqual(EntityDataFactory.categorySignals)
    })
  })

  describe('fromEntityToAPI', () => {
    it('transforms entity category signals to API correctly', () => {
      expect(
        instanceUnderTest.fromEntityToAPI(EntityDataFactory.categorySignals),
      ).toStrictEqual(APIDataFactory.categorySignals)
    })
  })
})
