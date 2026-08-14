/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { PrivacyScoreTransformer } from '../../../../../../src/private/data/analysis-result/transformer/privacyScoreTransformer'
import { APIDataFactory } from '../../../../../data-factory/api'
import { EntityDataFactory } from '../../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../../data-factory/graphQL'

describe('PrivacyScoreTransformer Test Suite', () => {
  const instanceUnderTest = new PrivacyScoreTransformer()

  describe('fromGraphQLToEntity', () => {
    it('transforms GraphQL privacy score to entity correctly', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity(GraphQLDataFactory.privacyScore),
      ).toStrictEqual(EntityDataFactory.privacyScore)
    })
  })

  describe('fromEntityToAPI', () => {
    it('transforms entity privacy score to API correctly', () => {
      expect(
        instanceUnderTest.fromEntityToAPI(EntityDataFactory.privacyScore),
      ).toStrictEqual(APIDataFactory.privacyScore)
    })
  })
})
