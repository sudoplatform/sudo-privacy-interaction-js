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
import { ApiClient } from '../../../../../src/private/data/common/apiClient'
import { DefaultOrganizationAnalysisService } from '../../../../../src/private/data/organization-analysis/defaultOrganizationAnalysisService'
import {
  OrganizationAnalysisDomainResolutionEntity,
  OrganizationAnalysisModeEntity,
} from '../../../../../src/private/domain/entities/organization-analysis/organizationAnalysisEntity'
import { EntityDataFactory } from '../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../data-factory/graphQL'

describe('DefaultOrganizationAnalysisService Test Suite', () => {
  const mockAppSync = mock<ApiClient>()

  let instanceUnderTest: DefaultOrganizationAnalysisService

  beforeEach(() => {
    reset(mockAppSync)
    instanceUnderTest = new DefaultOrganizationAnalysisService(
      instance(mockAppSync),
    )
  })

  describe('getOrganizationAnalysis', () => {
    it('calls appSync and returns result correctly', async () => {
      when(mockAppSync.getOrganizationAnalysis(anything())).thenResolve(
        GraphQLDataFactory.organizationAnalysis,
      )

      const result = await instanceUnderTest.getOrganizationAnalysis({
        domain: 'example.com',
      })

      expect(result).toStrictEqual(EntityDataFactory.organizationAnalysis)
      const [inputArg] = capture(mockAppSync.getOrganizationAnalysis).first()
      expect(inputArg).toStrictEqual({
        domain: 'example.com',
        name: undefined,
        mode: undefined,
        resolution: undefined,
      })
      verify(mockAppSync.getOrganizationAnalysis(anything())).once()
    })

    it('forwards the name when provided', async () => {
      when(mockAppSync.getOrganizationAnalysis(anything())).thenResolve(
        GraphQLDataFactory.organizationAnalysis,
      )

      await instanceUnderTest.getOrganizationAnalysis({
        domain: 'example.com',
        name: 'Example',
      })

      const [inputArg] = capture(mockAppSync.getOrganizationAnalysis).first()
      expect(inputArg).toStrictEqual({
        domain: 'example.com',
        name: 'Example',
        mode: undefined,
        resolution: undefined,
      })
    })

    it('transforms the mode to GraphQL when provided', async () => {
      when(mockAppSync.getOrganizationAnalysis(anything())).thenResolve(
        GraphQLDataFactory.organizationAnalysis,
      )

      await instanceUnderTest.getOrganizationAnalysis({
        domain: 'example.com',
        mode: OrganizationAnalysisModeEntity.Fetch,
      })

      const [inputArg] = capture(mockAppSync.getOrganizationAnalysis).first()
      expect(inputArg).toStrictEqual({
        domain: 'example.com',
        name: undefined,
        mode: 'FETCH',
        resolution: undefined,
      })
    })

    it('transforms the resolution to GraphQL when provided', async () => {
      when(mockAppSync.getOrganizationAnalysis(anything())).thenResolve(
        GraphQLDataFactory.organizationAnalysis,
      )

      await instanceUnderTest.getOrganizationAnalysis({
        domain: 'example.com',
        resolution: OrganizationAnalysisDomainResolutionEntity.Exact,
      })

      const [inputArg] = capture(mockAppSync.getOrganizationAnalysis).first()
      expect(inputArg).toStrictEqual({
        domain: 'example.com',
        name: undefined,
        mode: undefined,
        resolution: 'EXACT',
      })
    })

    it('returns undefined when appSync returns undefined', async () => {
      when(mockAppSync.getOrganizationAnalysis(anything())).thenResolve(
        undefined,
      )

      const result = await instanceUnderTest.getOrganizationAnalysis({
        domain: 'example.com',
      })

      expect(result).toBeUndefined()
      verify(mockAppSync.getOrganizationAnalysis(anything())).once()
    })

    it('throws error when appSync throws', async () => {
      when(mockAppSync.getOrganizationAnalysis(anything())).thenReject(
        new Error('GraphQL error'),
      )

      await expect(
        instanceUnderTest.getOrganizationAnalysis({ domain: 'example.com' }),
      ).rejects.toThrow('GraphQL error')
      verify(mockAppSync.getOrganizationAnalysis(anything())).once()
    })
  })
})
