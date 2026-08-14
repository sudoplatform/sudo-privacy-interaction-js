/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrganizationIdentityTransformer } from '../../../../../../src/private/data/analysis-result/transformer/organizationIdentityTransformer'
import { APIDataFactory } from '../../../../../data-factory/api'
import { EntityDataFactory } from '../../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../../data-factory/graphQL'

describe('OrganizationIdentityTransformer Test Suite', () => {
  const instanceUnderTest = new OrganizationIdentityTransformer()

  describe('fromGraphQLToEntity', () => {
    it('transforms GraphQL organization identity to entity correctly', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity(
          GraphQLDataFactory.organizationIdentity,
        ),
      ).toStrictEqual(EntityDataFactory.organizationIdentity)
    })
  })

  describe('fromEntityToAPI', () => {
    it('transforms entity organization identity to API correctly', () => {
      expect(
        instanceUnderTest.fromEntityToAPI(
          EntityDataFactory.organizationIdentity,
        ),
      ).toStrictEqual(APIDataFactory.organizationIdentity)
    })
  })
})
