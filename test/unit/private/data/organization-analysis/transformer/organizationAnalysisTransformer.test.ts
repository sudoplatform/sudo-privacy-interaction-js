/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrganizationAnalysisTransformer } from '../../../../../../src/private/data/organization-analysis/transformer/organizationAnalysisTransformer'
import { APIDataFactory } from '../../../../../data-factory/api'
import { EntityDataFactory } from '../../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../../data-factory/graphQL'

describe('OrganizationAnalysisTransformer Test Suite', () => {
  const instanceUnderTest = new OrganizationAnalysisTransformer()

  describe('fromGraphQLToEntity', () => {
    it('transforms GraphQL organization analysis to entity correctly', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity(
          GraphQLDataFactory.organizationAnalysis,
        ),
      ).toStrictEqual(EntityDataFactory.organizationAnalysis)
    })

    it('maps undefined data', () => {
      const result = instanceUnderTest.fromGraphQLToEntity({
        ...GraphQLDataFactory.organizationAnalysis,
        data: undefined,
      })
      expect(result.data).toBeUndefined()
    })
  })

  describe('fromEntityToAPI', () => {
    it('transforms entity organization analysis to API correctly', () => {
      expect(
        instanceUnderTest.fromEntityToAPI(
          EntityDataFactory.organizationAnalysis,
        ),
      ).toStrictEqual(APIDataFactory.organizationAnalysis)
    })
  })
})
