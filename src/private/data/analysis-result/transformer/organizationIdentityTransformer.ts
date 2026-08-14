/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrganizationIdentity as OrganizationIdentityGraphQL } from '../../../../gen/graphqlTypes'
import { OrganizationIdentity } from '../../../../public/typings/analysisResult'
import { OrganizationIdentityEntity } from '../../../domain/entities/analysis-result/analysisResultEntity'
import { OrganizationCategoryTransformer } from './organizationCategoryTransformer'

export class OrganizationIdentityTransformer {
  private readonly organizationCategoryTransformer =
    new OrganizationCategoryTransformer()

  fromGraphQLToEntity(
    data: OrganizationIdentityGraphQL,
  ): OrganizationIdentityEntity {
    return {
      brandName: data.brandName ?? '',
      companyName: data.companyName ?? '',
      primaryCategory: this.organizationCategoryTransformer.fromGraphQLToEntity(
        data.primaryCategory ?? '%future added value',
      ),
      categories: data.categories.map((c) =>
        this.organizationCategoryTransformer.fromGraphQLToEntity(c),
      ),
    }
  }

  fromEntityToAPI(entity: OrganizationIdentityEntity): OrganizationIdentity {
    return {
      brandName: entity.brandName,
      companyName: entity.companyName,
      primaryCategory: this.organizationCategoryTransformer.fromEntityToAPI(
        entity.primaryCategory,
      ),
      categories: entity.categories.map((c) =>
        this.organizationCategoryTransformer.fromEntityToAPI(c),
      ),
    }
  }
}
