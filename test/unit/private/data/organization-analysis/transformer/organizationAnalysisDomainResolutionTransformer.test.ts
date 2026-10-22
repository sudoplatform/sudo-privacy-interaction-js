/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrganizationAnalysisDomainResolutionTransformer } from '../../../../../../src/private/data/organization-analysis/transformer/organizationAnalysisDomainResolutionTransformer'
import { OrganizationAnalysisDomainResolutionEntity } from '../../../../../../src/private/domain/entities/organization-analysis/organizationAnalysisEntity'
import { OrganizationAnalysisDomainResolution } from '../../../../../../src/public'

describe('OrganizationAnalysisDomainResolutionTransformer Test Suite', () => {
  const instanceUnderTest =
    new OrganizationAnalysisDomainResolutionTransformer()

  describe('fromAPIToEntity', () => {
    it('maps Registrable', () => {
      expect(
        instanceUnderTest.fromAPIToEntity(
          OrganizationAnalysisDomainResolution.Registrable,
        ),
      ).toBe(OrganizationAnalysisDomainResolutionEntity.Registrable)
    })
    it('maps Exact', () => {
      expect(
        instanceUnderTest.fromAPIToEntity(
          OrganizationAnalysisDomainResolution.Exact,
        ),
      ).toBe(OrganizationAnalysisDomainResolutionEntity.Exact)
    })
  })

  describe('fromEntityToGraphQL', () => {
    it('maps Registrable', () => {
      expect(
        instanceUnderTest.fromEntityToGraphQL(
          OrganizationAnalysisDomainResolutionEntity.Registrable,
        ),
      ).toBe('REGISTRABLE')
    })
    it('maps Exact', () => {
      expect(
        instanceUnderTest.fromEntityToGraphQL(
          OrganizationAnalysisDomainResolutionEntity.Exact,
        ),
      ).toBe('EXACT')
    })
  })
})
