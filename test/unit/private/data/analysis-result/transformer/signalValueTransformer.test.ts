/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { SignalValueTransformer } from '../../../../../../src/private/data/analysis-result/transformer/signalValueTransformer'
import { SignalValueEntity } from '../../../../../../src/private/domain/entities/analysis-result/analysisResultEntity'
import { SignalValue } from '../../../../../../src/public/typings/analysisResult'

describe('SignalValueTransformer Test Suite', () => {
  const instanceUnderTest = new SignalValueTransformer()

  describe('fromEntityToAPI', () => {
    it.each`
      input                        | expected
      ${SignalValueEntity.Yes}     | ${SignalValue.Yes}
      ${SignalValueEntity.No}      | ${SignalValue.No}
      ${SignalValueEntity.Unknown} | ${SignalValue.Unknown}
    `(
      'transforms from entity $input to API $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromEntityToAPI(input)).toBe(expected)
      },
    )
  })

  describe('fromGraphQLToEntity', () => {
    it.each`
      input        | expected
      ${'YES'}     | ${SignalValueEntity.Yes}
      ${'NO'}      | ${SignalValueEntity.No}
      ${'UNKNOWN'} | ${SignalValueEntity.Unknown}
    `(
      'transforms from graphQL $input to entity $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromGraphQLToEntity(input)).toBe(expected)
      },
    )

    it('returns fallback for unknown enum value', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity('UNKNOWN_FUTURE_VALUE' as any),
      ).toBe(SignalValueEntity.Unknown)
    })
  })
})
