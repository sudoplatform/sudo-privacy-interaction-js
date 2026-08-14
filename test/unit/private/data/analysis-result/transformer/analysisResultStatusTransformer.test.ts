/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResultStatusTransformer } from '../../../../../../src/private/data/analysis-result/transformer/analysisResultStatusTransformer'
import { AnalysisResultStatusEntity } from '../../../../../../src/private/domain/entities/analysis-result/analysisResultEntity'
import { AnalysisResultStatus } from '../../../../../../src/public/typings/analysisResult'

describe('AnalysisResultStatusTransformer Test Suite', () => {
  const instanceUnderTest = new AnalysisResultStatusTransformer()

  describe('fromEntityToAPI', () => {
    it.each`
      input                                     | expected
      ${AnalysisResultStatusEntity.Pending}     | ${AnalysisResultStatus.Pending}
      ${AnalysisResultStatusEntity.Complete}    | ${AnalysisResultStatus.Complete}
      ${AnalysisResultStatusEntity.Partial}     | ${AnalysisResultStatus.Partial}
      ${AnalysisResultStatusEntity.Failed}      | ${AnalysisResultStatus.Failed}
      ${AnalysisResultStatusEntity.Unavailable} | ${AnalysisResultStatus.Unavailable}
    `(
      'transforms from entity $input to API $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromEntityToAPI(input)).toBe(expected)
      },
    )
  })

  describe('fromGraphQLToEntity', () => {
    it.each`
      input            | expected
      ${'PENDING'}     | ${AnalysisResultStatusEntity.Pending}
      ${'COMPLETE'}    | ${AnalysisResultStatusEntity.Complete}
      ${'PARTIAL'}     | ${AnalysisResultStatusEntity.Partial}
      ${'FAILED'}      | ${AnalysisResultStatusEntity.Failed}
      ${'UNAVAILABLE'} | ${AnalysisResultStatusEntity.Unavailable}
    `(
      'transforms from graphQL $input to entity $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromGraphQLToEntity(input)).toBe(expected)
      },
    )

    it('returns fallback for unknown enum value', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity('UNKNOWN_FUTURE_VALUE' as any),
      ).toBe(AnalysisResultStatusEntity.Unavailable)
    })
  })
})
