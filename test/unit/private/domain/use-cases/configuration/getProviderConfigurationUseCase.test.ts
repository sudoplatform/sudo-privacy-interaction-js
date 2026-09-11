/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { instance, mock, reset, verify, when } from 'ts-mockito'
import { ProviderConfigurationService } from '../../../../../../src/private/domain/entities/configuration/providerConfigurationService'
import { GetProviderConfigurationUseCase } from '../../../../../../src/private/domain/use-cases/configuration/getProviderConfigurationUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('GetProviderConfigurationUseCase Test Suite', () => {
  const mockProviderConfigurationService = mock<ProviderConfigurationService>()

  let instanceUnderTest: GetProviderConfigurationUseCase

  beforeEach(() => {
    reset(mockProviderConfigurationService)

    instanceUnderTest = new GetProviderConfigurationUseCase(
      instance(mockProviderConfigurationService),
    )
  })

  describe('execute', () => {
    it('retrieves the provider configurations successfully', async () => {
      when(mockProviderConfigurationService.get()).thenResolve(
        EntityDataFactory.providerConfigurations,
      )

      const result = await instanceUnderTest.execute()

      expect(result).toStrictEqual(EntityDataFactory.providerConfigurations)
      verify(mockProviderConfigurationService.get()).once()
    })

    it('throws when service throws', async () => {
      when(mockProviderConfigurationService.get()).thenReject(
        new Error('service error'),
      )

      await expect(instanceUnderTest.execute()).rejects.toThrow('service error')
      verify(mockProviderConfigurationService.get()).once()
    })
  })
})
