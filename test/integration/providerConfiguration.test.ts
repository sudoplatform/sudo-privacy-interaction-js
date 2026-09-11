/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger } from '@sudoplatform/sudo-common'
import { SudoUserClient } from '@sudoplatform/sudo-user'
import { ProviderType, SudoPrivacyInteractionClient } from '../../src/public'
import {
  SetupPrivacyInteractionClientOutput,
  setupPrivacyInteractionClient,
} from './util/privacyInteractionClientLifecycle'

describe('Provider Configuration Integration Test Suite', () => {
  const log = new DefaultLogger('ProviderConfigurationIntegrationTest')

  let setup: SetupPrivacyInteractionClientOutput
  let instanceUnderTest: SudoPrivacyInteractionClient
  let userClient: SudoUserClient

  beforeEach(async () => {
    setup = await setupPrivacyInteractionClient(log)
    instanceUnderTest = setup.privacyInteractionClient
    userClient = setup.userClient
  })

  afterEach(async () => {
    await userClient.reset()
  })

  describe('getProviderConfiguration', () => {
    it('retrieves and decodes the provider configurations successfully', async () => {
      const configs = await instanceUnderTest.getProviderConfiguration()

      expect(Array.isArray(configs)).toBe(true)
      expect(configs.length).toBeGreaterThan(0)

      for (const config of configs) {
        expect(typeof config.name).toBe('string')
        expect(config.name.length).toBeGreaterThan(0)
        expect(typeof config.clientId).toBe('string')
        expect(config.clientId.length).toBeGreaterThan(0)
        expect(Object.values(ProviderType)).toContain(config.providerType)
      }
    })
  })
})
