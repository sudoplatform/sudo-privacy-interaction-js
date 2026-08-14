/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataHolderTransformer } from '../../../../../../src/private/data/data-holder/transformer/dataHolderTransformer'
import { APIDataFactory } from '../../../../../data-factory/api'
import { EntityDataFactory } from '../../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../../data-factory/graphQL'

describe('DataHolderTransformer Test Suite', () => {
  const instanceUnderTest = new DataHolderTransformer()

  describe('fromGraphQLToEntity', () => {
    it('transforms GraphQL data holder to entity correctly', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity(GraphQLDataFactory.dataHolder),
      ).toStrictEqual(EntityDataFactory.dataHolder)
    })
  })

  describe('fromEntityToAPI', () => {
    it('transforms entity to API data holder correctly', () => {
      expect(
        instanceUnderTest.fromEntityToAPI(EntityDataFactory.dataHolder),
      ).toStrictEqual(APIDataFactory.dataHolder)
    })
  })
})
