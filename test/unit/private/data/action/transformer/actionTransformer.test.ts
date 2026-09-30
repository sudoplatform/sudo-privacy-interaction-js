/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActionTransformer } from '../../../../../../src/private/data/action/transformer/actionTransformer'
import { APIDataFactory } from '../../../../../data-factory/api'
import { EntityDataFactory } from '../../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../../data-factory/graphQL'

describe('ActionTransformer Test Suite', () => {
  const instanceUnderTest = new ActionTransformer()

  describe('fromGraphQLToEntity', () => {
    it('transforms GraphQL action to entity correctly', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity(GraphQLDataFactory.action),
      ).toStrictEqual(EntityDataFactory.action)
    })

    it('maps a delegated action without assistedPayload to undefined', () => {
      const result = instanceUnderTest.fromGraphQLToEntity({
        ...GraphQLDataFactory.action,
        fulfilmentMethod: 'DELEGATED',
        assistedPayload: undefined,
      })
      expect(result.assistedPayload).toBeUndefined()
    })
  })

  describe('fromEntityToAPI', () => {
    it('transforms entity action to API correctly', () => {
      expect(
        instanceUnderTest.fromEntityToAPI(EntityDataFactory.action),
      ).toStrictEqual(APIDataFactory.action)
    })
  })
})
