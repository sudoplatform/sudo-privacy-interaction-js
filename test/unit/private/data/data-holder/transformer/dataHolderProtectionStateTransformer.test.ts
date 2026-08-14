/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataHolderProtectionStateTransformer } from '../../../../../../src/private/data/data-holder/transformer/dataHolderProtectionStateTransformer'
import { DataHolderProtectionStateEntity } from '../../../../../../src/private/domain/entities/data-holder/dataHolderEntity'
import { DataHolderProtectionState } from '../../../../../../src/public'

describe('DataHolderProtectionStateTransformer Test Suite', () => {
  const instanceUnderTest = new DataHolderProtectionStateTransformer()

  describe('fromEntityToAPI', () => {
    it.each`
      input                                              | expected
      ${DataHolderProtectionStateEntity.Monitored}       | ${DataHolderProtectionState.Monitored}
      ${DataHolderProtectionStateEntity.ActionRequested} | ${DataHolderProtectionState.ActionRequested}
      ${DataHolderProtectionStateEntity.Resolved}        | ${DataHolderProtectionState.Resolved}
      ${DataHolderProtectionStateEntity.Unknown}         | ${DataHolderProtectionState.Unknown}
    `(
      'transforms from entity $input to API $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromEntityToAPI(input)).toBe(expected)
      },
    )
  })

  describe('fromGraphQLToEntity', () => {
    it.each`
      input                 | expected
      ${'MONITORED'}        | ${DataHolderProtectionStateEntity.Monitored}
      ${'ACTION_REQUESTED'} | ${DataHolderProtectionStateEntity.ActionRequested}
      ${'RESOLVED'}         | ${DataHolderProtectionStateEntity.Resolved}
    `(
      'transforms from graphQL $input to entity $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromGraphQLToEntity(input)).toBe(expected)
      },
    )

    it('returns fallback for unknown enum value', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity('UNKNOWN_FUTURE_VALUE' as any),
      ).toBe(DataHolderProtectionStateEntity.Unknown)
    })
  })
})
