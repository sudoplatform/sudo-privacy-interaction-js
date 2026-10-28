/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResultStatusReasonTransformer } from '../../../../../../src/private/data/analysis-result/transformer/analysisResultStatusReasonTransformer'
import { AnalysisResultStatusReasonEntity } from '../../../../../../src/private/domain/entities/analysis-result/analysisResultEntity'
import { AnalysisResultStatusReason } from '../../../../../../src/public/typings/analysisResult'

describe('AnalysisResultStatusReasonTransformer Test Suite', () => {
  const instanceUnderTest = new AnalysisResultStatusReasonTransformer()

  describe('fromGraphQLToEntity', () => {
    it.each`
      input                   | expected
      ${'INVALID_DOMAIN'}     | ${AnalysisResultStatusReasonEntity.InvalidDomain}
      ${'POLICY_UNAVAILABLE'} | ${AnalysisResultStatusReasonEntity.PolicyUnavailable}
      ${'MALICIOUS'}          | ${AnalysisResultStatusReasonEntity.Malicious}
      ${'NOT_ATTEMPTED'}      | ${AnalysisResultStatusReasonEntity.NotAttempted}
      ${'OTHER'}              | ${AnalysisResultStatusReasonEntity.Other}
    `(
      'transforms from graphQL $input to entity $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromGraphQLToEntity(input)).toBe(expected)
      },
    )

    it.each`
      input
      ${null}
      ${undefined}
    `('returns undefined for $input', ({ input }) => {
      expect(instanceUnderTest.fromGraphQLToEntity(input)).toBeUndefined()
    })

    it('returns undefined for unknown enum value', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity('UNKNOWN_FUTURE_VALUE' as any),
      ).toBeUndefined()
    })
  })

  describe('fromEntityToAPI', () => {
    it.each`
      input                                                 | expected
      ${AnalysisResultStatusReasonEntity.InvalidDomain}     | ${AnalysisResultStatusReason.InvalidDomain}
      ${AnalysisResultStatusReasonEntity.PolicyUnavailable} | ${AnalysisResultStatusReason.PolicyUnavailable}
      ${AnalysisResultStatusReasonEntity.Malicious}         | ${AnalysisResultStatusReason.Malicious}
      ${AnalysisResultStatusReasonEntity.NotAttempted}      | ${AnalysisResultStatusReason.NotAttempted}
      ${AnalysisResultStatusReasonEntity.Other}             | ${AnalysisResultStatusReason.Other}
    `(
      'transforms from entity $input to API $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromEntityToAPI(input)).toBe(expected)
      },
    )

    it('returns undefined for undefined entity', () => {
      expect(instanceUnderTest.fromEntityToAPI(undefined)).toBeUndefined()
    })
  })
})
