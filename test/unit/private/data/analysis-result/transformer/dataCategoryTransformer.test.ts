/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataCategoryTransformer } from '../../../../../../src/private/data/analysis-result/transformer/dataCategoryTransformer'
import { DataCategoryEntity } from '../../../../../../src/private/domain/entities/analysis-result/analysisResultEntity'
import { DataCategory } from '../../../../../../src/public/typings/analysisResult'

describe('DataCategoryTransformer Test Suite', () => {
  const instanceUnderTest = new DataCategoryTransformer()

  describe('fromEntityToAPI', () => {
    it.each`
      input                                  | expected
      ${DataCategoryEntity.AccountProfile}   | ${DataCategory.AccountProfile}
      ${DataCategoryEntity.Authentication}   | ${DataCategory.Authentication}
      ${DataCategoryEntity.Background}       | ${DataCategory.Background}
      ${DataCategoryEntity.Biometric}        | ${DataCategory.Biometric}
      ${DataCategoryEntity.Communication}    | ${DataCategory.Communication}
      ${DataCategoryEntity.Contacts}         | ${DataCategory.Contacts}
      ${DataCategoryEntity.Demographic}      | ${DataCategory.Demographic}
      ${DataCategoryEntity.DeviceIdentifier} | ${DataCategory.DeviceIdentifier}
      ${DataCategoryEntity.Financial}        | ${DataCategory.Financial}
      ${DataCategoryEntity.GovernmentIssued} | ${DataCategory.GovernmentIssued}
      ${DataCategoryEntity.Health}           | ${DataCategory.Health}
      ${DataCategoryEntity.Inferences}       | ${DataCategory.Inferences}
      ${DataCategoryEntity.Location}         | ${DataCategory.Location}
      ${DataCategoryEntity.Other}            | ${DataCategory.Other}
      ${DataCategoryEntity.Pii}              | ${DataCategory.Pii}
      ${DataCategoryEntity.ThirdPartyData}   | ${DataCategory.ThirdPartyData}
      ${DataCategoryEntity.Usage}            | ${DataCategory.Usage}
    `(
      'transforms from entity $input to API $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromEntityToAPI(input)).toBe(expected)
      },
    )
  })

  describe('fromGraphQLToEntity', () => {
    it.each`
      input                  | expected
      ${'ACCOUNT_PROFILE'}   | ${DataCategoryEntity.AccountProfile}
      ${'AUTHENTICATION'}    | ${DataCategoryEntity.Authentication}
      ${'BACKGROUND'}        | ${DataCategoryEntity.Background}
      ${'BIOMETRIC'}         | ${DataCategoryEntity.Biometric}
      ${'COMMUNICATION'}     | ${DataCategoryEntity.Communication}
      ${'CONTACTS'}          | ${DataCategoryEntity.Contacts}
      ${'DEMOGRAPHIC'}       | ${DataCategoryEntity.Demographic}
      ${'DEVICE_IDENTIFIER'} | ${DataCategoryEntity.DeviceIdentifier}
      ${'FINANCIAL'}         | ${DataCategoryEntity.Financial}
      ${'GOVERNMENT_ISSUED'} | ${DataCategoryEntity.GovernmentIssued}
      ${'HEALTH'}            | ${DataCategoryEntity.Health}
      ${'INFERENCES'}        | ${DataCategoryEntity.Inferences}
      ${'LOCATION'}          | ${DataCategoryEntity.Location}
      ${'OTHER'}             | ${DataCategoryEntity.Other}
      ${'PII'}               | ${DataCategoryEntity.Pii}
      ${'THIRD_PARTY_DATA'}  | ${DataCategoryEntity.ThirdPartyData}
      ${'USAGE'}             | ${DataCategoryEntity.Usage}
    `(
      'transforms from graphQL $input to entity $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromGraphQLToEntity(input)).toBe(expected)
      },
    )

    it('returns fallback for unknown enum value', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity('UNKNOWN_FUTURE_VALUE' as any),
      ).toBe(DataCategoryEntity.Other)
    })
  })
})
