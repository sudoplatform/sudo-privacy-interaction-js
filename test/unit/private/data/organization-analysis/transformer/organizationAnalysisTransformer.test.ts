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

    it('maps statusReason to the entity when present', () => {
      const result = instanceUnderTest.fromGraphQLToEntity({
        ...GraphQLDataFactory.organizationAnalysis,
        statusReason: 'MALICIOUS',
      })
      expect(result.statusReason).toBe('MALICIOUS')
    })

    it('omits statusReason when the GraphQL value is null', () => {
      const result = instanceUnderTest.fromGraphQLToEntity(
        GraphQLDataFactory.organizationAnalysis,
      )
      expect(result.statusReason).toBeUndefined()
      expect('statusReason' in result).toBe(false)
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

    it('maps statusReason to the API type when present', () => {
      const result = instanceUnderTest.fromEntityToAPI({
        ...EntityDataFactory.organizationAnalysis,
        statusReason:
          EntityDataFactory.analysisResultWithStatusReason.statusReason,
      })
      expect(result.statusReason).toBe(
        APIDataFactory.analysisResultWithStatusReason.statusReason,
      )
    })
  })
})
