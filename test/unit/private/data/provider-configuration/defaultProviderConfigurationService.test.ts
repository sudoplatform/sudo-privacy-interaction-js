/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { instance, mock, reset, verify, when } from 'ts-mockito'
import { ApiClient } from '../../../../../src/private/data/common/apiClient'
import { DefaultProviderConfigurationService } from '../../../../../src/private/data/provider-configuration/defaultProviderConfigurationService'
import { EntityDataFactory } from '../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../data-factory/graphQL'

describe('DefaultProviderConfigurationService Test Suite', () => {
  const mockAppSync = mock<ApiClient>()

  let instanceUnderTest: DefaultProviderConfigurationService

  beforeEach(() => {
    reset(mockAppSync)
    instanceUnderTest = new DefaultProviderConfigurationService(
      instance(mockAppSync),
    )
  })

  describe('get', () => {
    it('calls appSync and returns the decoded configurations correctly', async () => {
      when(mockAppSync.getProviderConfiguration()).thenResolve(
        GraphQLDataFactory.providerConfiguration,
      )

      const result = await instanceUnderTest.get()

      expect(result).toStrictEqual(EntityDataFactory.providerConfigurations)
      verify(mockAppSync.getProviderConfiguration()).once()
    })

    it('throws error when appSync throws', async () => {
      when(mockAppSync.getProviderConfiguration()).thenReject(
        new Error('GraphQL error'),
      )

      await expect(instanceUnderTest.get()).rejects.toThrow('GraphQL error')
      verify(mockAppSync.getProviderConfiguration()).once()
    })
  })
})
