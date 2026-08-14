/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { RetentionInfoTransformer } from '../../../../../../src/private/data/analysis-result/transformer/retentionInfoTransformer'
import { APIDataFactory } from '../../../../../data-factory/api'
import { EntityDataFactory } from '../../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../../data-factory/graphQL'

describe('RetentionInfoTransformer Test Suite', () => {
  const instanceUnderTest = new RetentionInfoTransformer()

  describe('fromGraphQLToEntity', () => {
    it('transforms with all fields populated', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity(GraphQLDataFactory.retentionInfo),
      ).toStrictEqual(EntityDataFactory.retentionInfo)
    })
  })

  describe('fromEntityToAPI', () => {
    it('transforms with all fields populated', () => {
      expect(
        instanceUnderTest.fromEntityToAPI(EntityDataFactory.retentionInfo),
      ).toStrictEqual(APIDataFactory.retentionInfo)
    })
  })
})
