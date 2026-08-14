/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrganizationCategory as OrganizationCategoryGraphQL } from '../../../../gen/graphqlTypes'
import { OrganizationCategory } from '../../../../public/typings/analysisResult'
import { OrganizationCategoryEntity } from '../../../domain/entities/analysis-result/analysisResultEntity'

export class OrganizationCategoryTransformer {
  fromGraphQLToEntity(
    data: OrganizationCategoryGraphQL,
  ): OrganizationCategoryEntity {
    switch (data) {
      case 'Automotive':
        return OrganizationCategoryEntity.Automotive
      case 'Communications':
        return OrganizationCategoryEntity.Communications
      case 'CommunityAndCharity':
        return OrganizationCategoryEntity.CommunityAndCharity
      case 'Cryptocurrency':
        return OrganizationCategoryEntity.Cryptocurrency
      case 'Dating':
        return OrganizationCategoryEntity.Dating
      case 'Education':
        return OrganizationCategoryEntity.Education
      case 'Employment':
        return OrganizationCategoryEntity.Employment
      case 'EnergyAndUtilities':
        return OrganizationCategoryEntity.EnergyAndUtilities
      case 'Entertainment':
        return OrganizationCategoryEntity.Entertainment
      case 'Finance':
        return OrganizationCategoryEntity.Finance
      case 'FoodAndDining':
        return OrganizationCategoryEntity.FoodAndDining
      case 'Gambling':
        return OrganizationCategoryEntity.Gambling
      case 'Government':
        return OrganizationCategoryEntity.Government
      case 'Health':
        return OrganizationCategoryEntity.Health
      case 'Insurance':
        return OrganizationCategoryEntity.Insurance
      case 'Military':
        return OrganizationCategoryEntity.Military
      case 'News':
        return OrganizationCategoryEntity.News
      case 'Other':
        return OrganizationCategoryEntity.Other
      case 'PersonalEmail':
        return OrganizationCategoryEntity.PersonalEmail
      case 'PrivacyAndSecurity':
        return OrganizationCategoryEntity.PrivacyAndSecurity
      case 'RealEstate':
        return OrganizationCategoryEntity.RealEstate
      case 'ShippingAndDelivery':
        return OrganizationCategoryEntity.ShippingAndDelivery
      case 'Shopping':
        return OrganizationCategoryEntity.Shopping
      case 'SocialMedia':
        return OrganizationCategoryEntity.SocialMedia
      case 'SportsAndFitness':
        return OrganizationCategoryEntity.SportsAndFitness
      case 'Technology':
        return OrganizationCategoryEntity.Technology
      case 'Transportation':
        return OrganizationCategoryEntity.Transportation
      case 'Travel':
        return OrganizationCategoryEntity.Travel
      case 'VideoGames':
        return OrganizationCategoryEntity.VideoGames
      default:
        return OrganizationCategoryEntity.Other
    }
  }

  fromEntityToAPI(entity: OrganizationCategoryEntity): OrganizationCategory {
    switch (entity) {
      case OrganizationCategoryEntity.Automotive:
        return OrganizationCategory.Automotive
      case OrganizationCategoryEntity.Communications:
        return OrganizationCategory.Communications
      case OrganizationCategoryEntity.CommunityAndCharity:
        return OrganizationCategory.CommunityAndCharity
      case OrganizationCategoryEntity.Cryptocurrency:
        return OrganizationCategory.Cryptocurrency
      case OrganizationCategoryEntity.Dating:
        return OrganizationCategory.Dating
      case OrganizationCategoryEntity.Education:
        return OrganizationCategory.Education
      case OrganizationCategoryEntity.Employment:
        return OrganizationCategory.Employment
      case OrganizationCategoryEntity.EnergyAndUtilities:
        return OrganizationCategory.EnergyAndUtilities
      case OrganizationCategoryEntity.Entertainment:
        return OrganizationCategory.Entertainment
      case OrganizationCategoryEntity.Finance:
        return OrganizationCategory.Finance
      case OrganizationCategoryEntity.FoodAndDining:
        return OrganizationCategory.FoodAndDining
      case OrganizationCategoryEntity.Gambling:
        return OrganizationCategory.Gambling
      case OrganizationCategoryEntity.Government:
        return OrganizationCategory.Government
      case OrganizationCategoryEntity.Health:
        return OrganizationCategory.Health
      case OrganizationCategoryEntity.Insurance:
        return OrganizationCategory.Insurance
      case OrganizationCategoryEntity.Military:
        return OrganizationCategory.Military
      case OrganizationCategoryEntity.News:
        return OrganizationCategory.News
      case OrganizationCategoryEntity.Other:
        return OrganizationCategory.Other
      case OrganizationCategoryEntity.PersonalEmail:
        return OrganizationCategory.PersonalEmail
      case OrganizationCategoryEntity.PrivacyAndSecurity:
        return OrganizationCategory.PrivacyAndSecurity
      case OrganizationCategoryEntity.RealEstate:
        return OrganizationCategory.RealEstate
      case OrganizationCategoryEntity.ShippingAndDelivery:
        return OrganizationCategory.ShippingAndDelivery
      case OrganizationCategoryEntity.Shopping:
        return OrganizationCategory.Shopping
      case OrganizationCategoryEntity.SocialMedia:
        return OrganizationCategory.SocialMedia
      case OrganizationCategoryEntity.SportsAndFitness:
        return OrganizationCategory.SportsAndFitness
      case OrganizationCategoryEntity.Technology:
        return OrganizationCategory.Technology
      case OrganizationCategoryEntity.Transportation:
        return OrganizationCategory.Transportation
      case OrganizationCategoryEntity.Travel:
        return OrganizationCategory.Travel
      case OrganizationCategoryEntity.VideoGames:
        return OrganizationCategory.VideoGames
    }
  }
}
