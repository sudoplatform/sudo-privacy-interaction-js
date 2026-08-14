/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CapabilitySignalsTransformer } from '../../../../../../src/private/data/analysis-result/transformer/capabilitySignalsTransformer'
import { APIDataFactory } from '../../../../../data-factory/api'
import { EntityDataFactory } from '../../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../../data-factory/graphQL'

describe('CapabilitySignalsTransformer Test Suite', () => {
  const instanceUnderTest = new CapabilitySignalsTransformer()

  describe('fromGraphQLToEntity', () => {
    it('transforms GraphQL capability signals to entity correctly', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity(
          GraphQLDataFactory.capabilitySignals,
        ),
      ).toStrictEqual(EntityDataFactory.capabilitySignals)
    })
  })

  describe('fromEntityToAPI', () => {
    it('transforms entity capability signals to API correctly', () => {
      expect(
        instanceUnderTest.fromEntityToAPI(EntityDataFactory.capabilitySignals),
      ).toStrictEqual(APIDataFactory.capabilitySignals)
    })
  })
})
