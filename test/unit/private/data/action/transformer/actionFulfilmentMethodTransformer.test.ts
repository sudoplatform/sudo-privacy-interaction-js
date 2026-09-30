/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActionFulfilmentMethodTransformer } from '../../../../../../src/private/data/action/transformer/actionFulfilmentMethodTransformer'
import { ActionFulfilmentMethodEntity } from '../../../../../../src/private/domain/entities/action/actionEntity'
import { ActionFulfilmentMethod } from '../../../../../../src/public'

describe('ActionFulfilmentMethodTransformer Test Suite', () => {
  const instanceUnderTest = new ActionFulfilmentMethodTransformer()

  describe('fromEntityToAPI', () => {
    it.each`
      input                                     | expected
      ${ActionFulfilmentMethodEntity.Assisted}  | ${ActionFulfilmentMethod.Assisted}
      ${ActionFulfilmentMethodEntity.Delegated} | ${ActionFulfilmentMethod.Delegated}
    `(
      'transforms from entity $input to API $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromEntityToAPI(input)).toBe(expected)
      },
    )
  })

  describe('fromAPIToEntity', () => {
    it.each`
      input                               | expected
      ${ActionFulfilmentMethod.Assisted}  | ${ActionFulfilmentMethodEntity.Assisted}
      ${ActionFulfilmentMethod.Delegated} | ${ActionFulfilmentMethodEntity.Delegated}
    `(
      'transforms from API $input to entity $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromAPIToEntity(input)).toBe(expected)
      },
    )
  })

  describe('fromGraphQLToEntity', () => {
    it.each`
      input          | expected
      ${'ASSISTED'}  | ${ActionFulfilmentMethodEntity.Assisted}
      ${'DELEGATED'} | ${ActionFulfilmentMethodEntity.Delegated}
    `(
      'transforms from graphQL $input to entity $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromGraphQLToEntity(input)).toBe(expected)
      },
    )

    it('returns Assisted for unknown future value', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity('UNKNOWN_FUTURE_VALUE' as any),
      ).toBe(ActionFulfilmentMethodEntity.Assisted)
    })
  })

  describe('fromEntityToGraphQL', () => {
    it.each`
      input                                     | expected
      ${ActionFulfilmentMethodEntity.Assisted}  | ${'ASSISTED'}
      ${ActionFulfilmentMethodEntity.Delegated} | ${'DELEGATED'}
    `(
      'transforms from entity $input to graphQL $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromEntityToGraphQL(input)).toBe(expected)
      },
    )
  })
})
