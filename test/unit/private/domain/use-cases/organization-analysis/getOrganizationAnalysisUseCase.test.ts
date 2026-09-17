/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  anything,
  capture,
  instance,
  mock,
  reset,
  verify,
  when,
} from 'ts-mockito'
import { OrganizationAnalysisModeEntity } from '../../../../../../src/private/domain/entities/organization-analysis/organizationAnalysisEntity'
import { OrganizationAnalysisService } from '../../../../../../src/private/domain/entities/organization-analysis/organizationAnalysisService'
import { GetOrganizationAnalysisUseCase } from '../../../../../../src/private/domain/use-cases/organization-analysis/getOrganizationAnalysisUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('GetOrganizationAnalysisUseCase Test Suite', () => {
  const mockService = mock<OrganizationAnalysisService>()

  let instanceUnderTest: GetOrganizationAnalysisUseCase

  beforeEach(() => {
    reset(mockService)
    instanceUnderTest = new GetOrganizationAnalysisUseCase(
      instance(mockService),
    )
  })

  describe('execute', () => {
    it('returns the organization analysis', async () => {
      when(mockService.getOrganizationAnalysis(anything())).thenResolve(
        EntityDataFactory.organizationAnalysis,
      )

      const result = await instanceUnderTest.execute({
        domain: 'example.com',
        mode: OrganizationAnalysisModeEntity.Analyze,
      })

      expect(result).toStrictEqual(EntityDataFactory.organizationAnalysis)
      const [inputArgs] = capture(mockService.getOrganizationAnalysis).first()
      expect(inputArgs).toStrictEqual<typeof inputArgs>({
        domain: 'example.com',
        mode: OrganizationAnalysisModeEntity.Analyze,
      })
      verify(mockService.getOrganizationAnalysis(anything())).once()
    })

    it('returns undefined when the service returns undefined', async () => {
      when(mockService.getOrganizationAnalysis(anything())).thenResolve(
        undefined,
      )

      const result = await instanceUnderTest.execute({ domain: 'example.com' })

      expect(result).toBeUndefined()
      verify(mockService.getOrganizationAnalysis(anything())).once()
    })
  })
})
