/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActionIntentTransformer } from '../../../../../../src/private/data/action/transformer/actionIntentTransformer'
import { ActionIntentEntity } from '../../../../../../src/private/domain/entities/action/actionEntity'
import { ActionIntent } from '../../../../../../src/public'

describe('ActionIntentTransformer Test Suite', () => {
  const instanceUnderTest = new ActionIntentTransformer()

  describe('fromEntityToAPI', () => {
    it.each`
      input                              | expected
      ${ActionIntentEntity.StopContact}  | ${ActionIntent.StopContact}
      ${ActionIntentEntity.AccessMyData} | ${ActionIntent.AccessMyData}
      ${ActionIntentEntity.DeleteMyData} | ${ActionIntent.DeleteMyData}
      ${ActionIntentEntity.LimitDataUse} | ${ActionIntent.LimitDataUse}
      ${ActionIntentEntity.Other}        | ${ActionIntent.Other}
    `(
      'transforms from entity $input to API $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromEntityToAPI(input)).toBe(expected)
      },
    )
  })

  describe('fromAPIToEntity', () => {
    it.each`
      input                        | expected
      ${ActionIntent.StopContact}  | ${ActionIntentEntity.StopContact}
      ${ActionIntent.AccessMyData} | ${ActionIntentEntity.AccessMyData}
      ${ActionIntent.DeleteMyData} | ${ActionIntentEntity.DeleteMyData}
      ${ActionIntent.LimitDataUse} | ${ActionIntentEntity.LimitDataUse}
      ${ActionIntent.Other}        | ${ActionIntentEntity.Other}
    `(
      'transforms from API $input to entity $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromAPIToEntity(input)).toBe(expected)
      },
    )
  })

  describe('fromGraphQLToEntity', () => {
    it.each`
      input               | expected
      ${'STOP_CONTACT'}   | ${ActionIntentEntity.StopContact}
      ${'ACCESS_MY_DATA'} | ${ActionIntentEntity.AccessMyData}
      ${'DELETE_MY_DATA'} | ${ActionIntentEntity.DeleteMyData}
      ${'LIMIT_DATA_USE'} | ${ActionIntentEntity.LimitDataUse}
      ${'OTHER'}          | ${ActionIntentEntity.Other}
    `(
      'transforms from graphQL $input to entity $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromGraphQLToEntity(input)).toBe(expected)
      },
    )

    it('returns Other for unknown future value', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity('UNKNOWN_FUTURE_VALUE' as any),
      ).toBe(ActionIntentEntity.Other)
    })
  })

  describe('fromEntityToGraphQL', () => {
    it.each`
      input                              | expected
      ${ActionIntentEntity.StopContact}  | ${'STOP_CONTACT'}
      ${ActionIntentEntity.AccessMyData} | ${'ACCESS_MY_DATA'}
      ${ActionIntentEntity.DeleteMyData} | ${'DELETE_MY_DATA'}
      ${ActionIntentEntity.LimitDataUse} | ${'LIMIT_DATA_USE'}
      ${ActionIntentEntity.Other}        | ${'OTHER'}
    `(
      'transforms from entity $input to graphQL $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromEntityToGraphQL(input)).toBe(expected)
      },
    )
  })
})
