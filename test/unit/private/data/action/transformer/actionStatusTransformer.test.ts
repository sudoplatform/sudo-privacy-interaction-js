/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActionStatusTransformer } from '../../../../../../src/private/data/action/transformer/actionStatusTransformer'
import { ActionStatusEntity } from '../../../../../../src/private/domain/entities/action/actionEntity'
import { ActionStatus } from '../../../../../../src/public'

describe('ActionStatusTransformer Test Suite', () => {
  const instanceUnderTest = new ActionStatusTransformer()

  describe('fromEntityToAPI', () => {
    it.each`
      input                                     | expected
      ${ActionStatusEntity.Pending}             | ${ActionStatus.Pending}
      ${ActionStatusEntity.InProgress}          | ${ActionStatus.InProgress}
      ${ActionStatusEntity.CompletedUnverified} | ${ActionStatus.CompletedUnverified}
      ${ActionStatusEntity.CompletedVerified}   | ${ActionStatus.CompletedVerified}
      ${ActionStatusEntity.Failed}              | ${ActionStatus.Failed}
      ${ActionStatusEntity.RequiresUserInput}   | ${ActionStatus.RequiresUserInput}
      ${ActionStatusEntity.Contradicted}        | ${ActionStatus.Contradicted}
      ${ActionStatusEntity.Unknown}             | ${ActionStatus.Unknown}
    `(
      'transforms from entity $input to API $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromEntityToAPI(input)).toBe(expected)
      },
    )
  })

  describe('fromGraphQLToEntity', () => {
    it.each`
      input                     | expected
      ${'PENDING'}              | ${ActionStatusEntity.Pending}
      ${'IN_PROGRESS'}          | ${ActionStatusEntity.InProgress}
      ${'COMPLETED_UNVERIFIED'} | ${ActionStatusEntity.CompletedUnverified}
      ${'COMPLETED_VERIFIED'}   | ${ActionStatusEntity.CompletedVerified}
      ${'FAILED'}               | ${ActionStatusEntity.Failed}
      ${'REQUIRES_USER_INPUT'}  | ${ActionStatusEntity.RequiresUserInput}
      ${'CONTRADICTED'}         | ${ActionStatusEntity.Contradicted}
    `(
      'transforms from graphQL $input to entity $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromGraphQLToEntity(input)).toBe(expected)
      },
    )

    it('returns Unknown for unknown future value', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity('UNKNOWN_FUTURE_VALUE' as any),
      ).toBe(ActionStatusEntity.Unknown)
    })
  })
})
