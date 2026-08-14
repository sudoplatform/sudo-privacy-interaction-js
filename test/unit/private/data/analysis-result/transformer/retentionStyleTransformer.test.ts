/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { RetentionStyleTransformer } from '../../../../../../src/private/data/analysis-result/transformer/retentionStyleTransformer'
import { RetentionStyleEntity } from '../../../../../../src/private/domain/entities/analysis-result/analysisResultEntity'
import { RetentionStyle } from '../../../../../../src/public/typings/analysisResult'

describe('RetentionStyleTransformer Test Suite', () => {
  const instanceUnderTest = new RetentionStyleTransformer()

  describe('fromEntityToAPI', () => {
    it.each`
      input                                                | expected
      ${RetentionStyleEntity.Indefinite}                   | ${RetentionStyle.Indefinite}
      ${RetentionStyleEntity.RelativeToAccountClosureTime} | ${RetentionStyle.RelativeToAccountClosureTime}
      ${RetentionStyleEntity.RelativeToDataStorageTime}    | ${RetentionStyle.RelativeToDataStorageTime}
      ${RetentionStyleEntity.Other}                        | ${RetentionStyle.Other}
    `(
      'transforms from entity $input to API $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromEntityToAPI(input)).toBe(expected)
      },
    )
  })

  describe('fromGraphQLToEntity', () => {
    it.each`
      input                                 | expected
      ${'INDEFINITE'}                       | ${RetentionStyleEntity.Indefinite}
      ${'RELATIVE_TO_ACCOUNT_CLOSURE_TIME'} | ${RetentionStyleEntity.RelativeToAccountClosureTime}
      ${'RELATIVE_TO_DATA_STORAGE_TIME'}    | ${RetentionStyleEntity.RelativeToDataStorageTime}
      ${'OTHER'}                            | ${RetentionStyleEntity.Other}
    `(
      'transforms from graphQL $input to entity $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromGraphQLToEntity(input)).toBe(expected)
      },
    )

    it('returns fallback for unknown enum value', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity('UNKNOWN_FUTURE_VALUE' as any),
      ).toBe(RetentionStyleEntity.Other)
    })
  })
})
