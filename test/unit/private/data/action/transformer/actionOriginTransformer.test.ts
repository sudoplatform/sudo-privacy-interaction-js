/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActionOriginTransformer } from '../../../../../../src/private/data/action/transformer/actionOriginTransformer'
import { ActionOriginEntity } from '../../../../../../src/private/domain/entities/action/actionEntity'
import { ActionOrigin } from '../../../../../../src/public'

describe('ActionOriginTransformer Test Suite', () => {
  const instanceUnderTest = new ActionOriginTransformer()

  describe('fromEntityToAPI', () => {
    it.each`
      input                           | expected
      ${ActionOriginEntity.Static}    | ${ActionOrigin.Static}
      ${ActionOriginEntity.Analysis}  | ${ActionOrigin.Analysis}
      ${ActionOriginEntity.Discovery} | ${ActionOrigin.Discovery}
      ${ActionOriginEntity.Unknown}   | ${ActionOrigin.Unknown}
    `(
      'transforms from entity $input to API $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromEntityToAPI(input)).toBe(expected)
      },
    )
  })

  describe('fromGraphQLToEntity', () => {
    it.each`
      input          | expected
      ${'STATIC'}    | ${ActionOriginEntity.Static}
      ${'ANALYSIS'}  | ${ActionOriginEntity.Analysis}
      ${'DISCOVERY'} | ${ActionOriginEntity.Discovery}
    `(
      'transforms from graphQL $input to entity $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromGraphQLToEntity(input)).toBe(expected)
      },
    )

    it('returns Unknown for unknown future value', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity('UNKNOWN_FUTURE_VALUE' as any),
      ).toBe(ActionOriginEntity.Unknown)
    })
  })
})
