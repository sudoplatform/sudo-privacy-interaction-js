/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrganizationCategoryTransformer } from '../../../../../../src/private/data/analysis-result/transformer/organizationCategoryTransformer'
import { OrganizationCategoryEntity } from '../../../../../../src/private/domain/entities/analysis-result/analysisResultEntity'
import { OrganizationCategory } from '../../../../../../src/public/typings/analysisResult'

describe('OrganizationCategoryTransformer Test Suite', () => {
  const instanceUnderTest = new OrganizationCategoryTransformer()

  describe('fromEntityToAPI', () => {
    it.each`
      input                                             | expected
      ${OrganizationCategoryEntity.Automotive}          | ${OrganizationCategory.Automotive}
      ${OrganizationCategoryEntity.Communications}      | ${OrganizationCategory.Communications}
      ${OrganizationCategoryEntity.CommunityAndCharity} | ${OrganizationCategory.CommunityAndCharity}
      ${OrganizationCategoryEntity.Cryptocurrency}      | ${OrganizationCategory.Cryptocurrency}
      ${OrganizationCategoryEntity.Dating}              | ${OrganizationCategory.Dating}
      ${OrganizationCategoryEntity.Education}           | ${OrganizationCategory.Education}
      ${OrganizationCategoryEntity.Employment}          | ${OrganizationCategory.Employment}
      ${OrganizationCategoryEntity.EnergyAndUtilities}  | ${OrganizationCategory.EnergyAndUtilities}
      ${OrganizationCategoryEntity.Entertainment}       | ${OrganizationCategory.Entertainment}
      ${OrganizationCategoryEntity.Finance}             | ${OrganizationCategory.Finance}
      ${OrganizationCategoryEntity.FoodAndDining}       | ${OrganizationCategory.FoodAndDining}
      ${OrganizationCategoryEntity.Gambling}            | ${OrganizationCategory.Gambling}
      ${OrganizationCategoryEntity.Government}          | ${OrganizationCategory.Government}
      ${OrganizationCategoryEntity.Health}              | ${OrganizationCategory.Health}
      ${OrganizationCategoryEntity.Insurance}           | ${OrganizationCategory.Insurance}
      ${OrganizationCategoryEntity.Military}            | ${OrganizationCategory.Military}
      ${OrganizationCategoryEntity.News}                | ${OrganizationCategory.News}
      ${OrganizationCategoryEntity.Other}               | ${OrganizationCategory.Other}
      ${OrganizationCategoryEntity.PersonalEmail}       | ${OrganizationCategory.PersonalEmail}
      ${OrganizationCategoryEntity.PrivacyAndSecurity}  | ${OrganizationCategory.PrivacyAndSecurity}
      ${OrganizationCategoryEntity.RealEstate}          | ${OrganizationCategory.RealEstate}
      ${OrganizationCategoryEntity.ShippingAndDelivery} | ${OrganizationCategory.ShippingAndDelivery}
      ${OrganizationCategoryEntity.Shopping}            | ${OrganizationCategory.Shopping}
      ${OrganizationCategoryEntity.SocialMedia}         | ${OrganizationCategory.SocialMedia}
      ${OrganizationCategoryEntity.SportsAndFitness}    | ${OrganizationCategory.SportsAndFitness}
      ${OrganizationCategoryEntity.Technology}          | ${OrganizationCategory.Technology}
      ${OrganizationCategoryEntity.Transportation}      | ${OrganizationCategory.Transportation}
      ${OrganizationCategoryEntity.Travel}              | ${OrganizationCategory.Travel}
      ${OrganizationCategoryEntity.VideoGames}          | ${OrganizationCategory.VideoGames}
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
      ${'Automotive'}          | ${OrganizationCategoryEntity.Automotive}
      ${'Communications'}      | ${OrganizationCategoryEntity.Communications}
      ${'CommunityAndCharity'} | ${OrganizationCategoryEntity.CommunityAndCharity}
      ${'Cryptocurrency'}      | ${OrganizationCategoryEntity.Cryptocurrency}
      ${'Dating'}              | ${OrganizationCategoryEntity.Dating}
      ${'Education'}           | ${OrganizationCategoryEntity.Education}
      ${'Employment'}          | ${OrganizationCategoryEntity.Employment}
      ${'EnergyAndUtilities'}  | ${OrganizationCategoryEntity.EnergyAndUtilities}
      ${'Entertainment'}       | ${OrganizationCategoryEntity.Entertainment}
      ${'Finance'}             | ${OrganizationCategoryEntity.Finance}
      ${'FoodAndDining'}       | ${OrganizationCategoryEntity.FoodAndDining}
      ${'Gambling'}            | ${OrganizationCategoryEntity.Gambling}
      ${'Government'}          | ${OrganizationCategoryEntity.Government}
      ${'Health'}              | ${OrganizationCategoryEntity.Health}
      ${'Insurance'}           | ${OrganizationCategoryEntity.Insurance}
      ${'Military'}            | ${OrganizationCategoryEntity.Military}
      ${'News'}                | ${OrganizationCategoryEntity.News}
      ${'Other'}               | ${OrganizationCategoryEntity.Other}
      ${'PersonalEmail'}       | ${OrganizationCategoryEntity.PersonalEmail}
      ${'PrivacyAndSecurity'}  | ${OrganizationCategoryEntity.PrivacyAndSecurity}
      ${'RealEstate'}          | ${OrganizationCategoryEntity.RealEstate}
      ${'ShippingAndDelivery'} | ${OrganizationCategoryEntity.ShippingAndDelivery}
      ${'Shopping'}            | ${OrganizationCategoryEntity.Shopping}
      ${'SocialMedia'}         | ${OrganizationCategoryEntity.SocialMedia}
      ${'SportsAndFitness'}    | ${OrganizationCategoryEntity.SportsAndFitness}
      ${'Technology'}          | ${OrganizationCategoryEntity.Technology}
      ${'Transportation'}      | ${OrganizationCategoryEntity.Transportation}
      ${'Travel'}              | ${OrganizationCategoryEntity.Travel}
      ${'VideoGames'}          | ${OrganizationCategoryEntity.VideoGames}
    `(
      'transforms from graphQL $input to entity $expected successfully',
      ({ input, expected }) => {
        expect(instanceUnderTest.fromGraphQLToEntity(input)).toBe(expected)
      },
    )

    it('returns fallback for unknown enum value', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity('UNKNOWN_FUTURE_VALUE' as any),
      ).toBe(OrganizationCategoryEntity.Other)
    })
  })
})
