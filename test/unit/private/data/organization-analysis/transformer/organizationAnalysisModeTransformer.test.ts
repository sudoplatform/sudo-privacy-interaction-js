/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrganizationAnalysisModeTransformer } from '../../../../../../src/private/data/organization-analysis/transformer/organizationAnalysisModeTransformer'
import { OrganizationAnalysisModeEntity } from '../../../../../../src/private/domain/entities/organization-analysis/organizationAnalysisEntity'
import { OrganizationAnalysisMode } from '../../../../../../src/public'

describe('OrganizationAnalysisModeTransformer Test Suite', () => {
  const instanceUnderTest = new OrganizationAnalysisModeTransformer()

  describe('fromAPIToEntity', () => {
    it('maps Analyze', () => {
      expect(
        instanceUnderTest.fromAPIToEntity(OrganizationAnalysisMode.Analyze),
      ).toBe(OrganizationAnalysisModeEntity.Analyze)
    })
    it('maps Fetch', () => {
      expect(
        instanceUnderTest.fromAPIToEntity(OrganizationAnalysisMode.Fetch),
      ).toBe(OrganizationAnalysisModeEntity.Fetch)
    })
  })

  describe('fromEntityToGraphQL', () => {
    it('maps Analyze', () => {
      expect(
        instanceUnderTest.fromEntityToGraphQL(
          OrganizationAnalysisModeEntity.Analyze,
        ),
      ).toBe('ANALYZE')
    })
    it('maps Fetch', () => {
      expect(
        instanceUnderTest.fromEntityToGraphQL(
          OrganizationAnalysisModeEntity.Fetch,
        ),
      ).toBe('FETCH')
    })
  })
})
