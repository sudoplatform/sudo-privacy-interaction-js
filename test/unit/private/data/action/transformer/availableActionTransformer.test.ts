/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { AvailableActionTransformer } from '../../../../../../src/private/data/action/transformer/availableActionTransformer'
import { APIDataFactory } from '../../../../../data-factory/api'
import { EntityDataFactory } from '../../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../../data-factory/graphQL'

describe('AvailableActionTransformer Test Suite', () => {
  const instanceUnderTest = new AvailableActionTransformer()

  describe('fromGraphQLToEntity', () => {
    it('transforms GraphQL available action to entity correctly', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity(
          GraphQLDataFactory.availableAction,
        ),
      ).toStrictEqual(EntityDataFactory.availableAction)
    })
  })

  describe('fromEntityToAPI', () => {
    it('transforms entity available action to API correctly', () => {
      expect(
        instanceUnderTest.fromEntityToAPI(EntityDataFactory.availableAction),
      ).toStrictEqual(APIDataFactory.availableAction)
    })
  })
})
