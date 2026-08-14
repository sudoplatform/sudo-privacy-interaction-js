/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { VirtualPresenceTransformer } from '../../../../../../src/private/data/virtual-presence/transformer/virtualPresenceTransformer'
import { APIDataFactory } from '../../../../../data-factory/api'
import { EntityDataFactory } from '../../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../../data-factory/graphQL'

describe('VirtualPresenceTransformer Test Suite', () => {
  const instanceUnderTest = new VirtualPresenceTransformer()

  describe('fromEntityToAPI', () => {
    it('transforms from entity to API type successfully', () => {
      expect(
        instanceUnderTest.fromEntityToAPI(EntityDataFactory.virtualPresence),
      ).toStrictEqual(APIDataFactory.virtualPresence)
    })
  })

  describe('fromGraphQLToEntity', () => {
    it('transforms from graphQL to entity type successfully', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity(
          GraphQLDataFactory.virtualPresence,
        ),
      ).toStrictEqual(EntityDataFactory.virtualPresence)
    })
  })
})
