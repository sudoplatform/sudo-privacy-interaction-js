/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProviderTypeTransformer } from '../../../../../../src/private/data/virtual-presence/transformer/providerTypeTransformer'
import { ProviderTypeEntity } from '../../../../../../src/private/domain/entities/virtual-presence/virtualPresenceEntity'
import { ProviderType } from '../../../../../../src/public'

describe('ProviderTypeTransformer Test Suite', () => {
  const instanceUnderTest = new ProviderTypeTransformer()

  describe('fromEntityToAPI', () => {
    it.each`
      input                         | expected
      ${ProviderTypeEntity.Email}   | ${ProviderType.Email}
      ${ProviderTypeEntity.Unknown} | ${ProviderType.Unknown}
    `(
      'transforms from entity $input to API $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromEntityToAPI(input)).toBe(expected)
      },
    )
  })

  describe('fromGraphQLToEntity', () => {
    it.each`
      input      | expected
      ${'EMAIL'} | ${ProviderTypeEntity.Email}
    `(
      'transforms from graphQL $input to entity $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromGraphQLToEntity(input)).toBe(expected)
      },
    )

    it('returns fallback for unknown enum value', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity('UNKNOWN_FUTURE_VALUE' as any),
      ).toBe(ProviderTypeEntity.Unknown)
    })
  })
})
