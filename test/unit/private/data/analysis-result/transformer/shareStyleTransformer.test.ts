/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShareStyleTransformer } from '../../../../../../src/private/data/analysis-result/transformer/shareStyleTransformer'
import { ShareStyleEntity } from '../../../../../../src/private/domain/entities/analysis-result/analysisResultEntity'
import { ShareStyle } from '../../../../../../src/public/typings/analysisResult'

describe('ShareStyleTransformer Test Suite', () => {
  const instanceUnderTest = new ShareStyleTransformer()

  describe('fromEntityToAPI', () => {
    it.each`
      input                                 | expected
      ${ShareStyleEntity.Shared}            | ${ShareStyle.Shared}
      ${ShareStyleEntity.SharedWithConsent} | ${ShareStyle.SharedWithConsent}
      ${ShareStyleEntity.InferenceShared}   | ${ShareStyle.InferenceShared}
      ${ShareStyleEntity.None}              | ${ShareStyle.None}
      ${ShareStyleEntity.Unknown}           | ${ShareStyle.Unknown}
    `(
      'transforms from entity $input to API $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromEntityToAPI(input)).toBe(expected)
      },
    )
  })

  describe('fromGraphQLToEntity', () => {
    it.each`
      input                    | expected
      ${'SHARED'}              | ${ShareStyleEntity.Shared}
      ${'SHARED_WITH_CONSENT'} | ${ShareStyleEntity.SharedWithConsent}
      ${'INFERENCE_SHARED'}    | ${ShareStyleEntity.InferenceShared}
      ${'NONE'}                | ${ShareStyleEntity.None}
    `(
      'transforms from graphQL $input to entity $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromGraphQLToEntity(input)).toBe(expected)
      },
    )

    it('returns fallback for unknown enum value', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity('UNKNOWN_FUTURE_VALUE' as any),
      ).toBe(ShareStyleEntity.Unknown)
    })
  })
})
