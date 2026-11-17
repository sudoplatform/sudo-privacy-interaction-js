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

    it('falls back to the first inbound contact when the most recent is absent', () => {
      const result = instanceUnderTest.fromGraphQLToEntity({
        ...GraphQLDataFactory.dataHolder,
        mostRecentInboundContactEpochMs: null,
      })
      expect(result.mostRecentInboundContactAt).toStrictEqual(new Date(2.0))
      expect(result.mostRecentInteractionAt).toStrictEqual(new Date(2.0))
      expect(result.firstInboundContactAt).toStrictEqual(new Date(2.0))
    })

    it('falls back to the creation date when no inbound contact is recorded', () => {
      const result = instanceUnderTest.fromGraphQLToEntity({
        ...GraphQLDataFactory.dataHolder,
        mostRecentInboundContactEpochMs: null,
        firstInboundContactEpochMs: null,
      })
      const createdAt = new Date(GraphQLDataFactory.dataHolder.createdAtEpochMs)
      expect(result.mostRecentInboundContactAt).toStrictEqual(createdAt)
      expect(result.mostRecentInteractionAt).toStrictEqual(createdAt)
      expect(result.firstInboundContactAt).toStrictEqual(createdAt)
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
