/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { VirtualPresenceStateTransformer } from '../../../../../../src/private/data/virtual-presence/transformer/virtualPresenceStateTransformer'
import { VirtualPresenceStateEntity } from '../../../../../../src/private/domain/entities/virtual-presence/virtualPresenceEntity'
import { VirtualPresenceState } from '../../../../../../src/public'

describe('VirtualPresenceStateTransformer Test Suite', () => {
  const instanceUnderTest = new VirtualPresenceStateTransformer()

  describe('fromEntityToAPI', () => {
    it.each`
      input                                     | expected
      ${VirtualPresenceStateEntity.Connected}   | ${VirtualPresenceState.Connected}
      ${VirtualPresenceStateEntity.Scanning}    | ${VirtualPresenceState.Scanning}
      ${VirtualPresenceStateEntity.NeedsReauth} | ${VirtualPresenceState.NeedsReauth}
      ${VirtualPresenceStateEntity.Inactive}    | ${VirtualPresenceState.Inactive}
      ${VirtualPresenceStateEntity.Error}       | ${VirtualPresenceState.Error}
      ${VirtualPresenceStateEntity.Unknown}     | ${VirtualPresenceState.Unknown}
    `(
      'transforms from entity $input to API $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromEntityToAPI(input)).toStrictEqual(expected)
      },
    )
  })

  describe('fromGraphQLToEntity', () => {
    it.each`
      input             | expected
      ${'CONNECTED'}    | ${VirtualPresenceStateEntity.Connected}
      ${'SCANNING'}     | ${VirtualPresenceStateEntity.Scanning}
      ${'NEEDS_REAUTH'} | ${VirtualPresenceStateEntity.NeedsReauth}
      ${'INACTIVE'}     | ${VirtualPresenceStateEntity.Inactive}
      ${'ERROR'}        | ${VirtualPresenceStateEntity.Error}
    `(
      'transforms from graphQL $input to entity $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromGraphQLToEntity(input)).toStrictEqual(
          expected,
        )
      },
    )

    it('returns fallback for unknown enum value', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity('UNKNOWN_FUTURE_VALUE' as any),
      ).toBe(VirtualPresenceStateEntity.Unknown)
    })
  })
})
