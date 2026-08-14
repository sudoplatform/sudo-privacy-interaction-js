/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultConfigurationManager } from '@sudoplatform/sudo-common'
import {
  PrivacyInteractionServiceConfig,
  getPrivacyInteractionServiceConfig,
} from '../../../../../src/private/data/common/config'
import { PrivacyInteractionServiceConfigNotFoundError } from '../../../../../src/public/errors'

describe('Config Test Suite', () => {
  const privacyInteractionServiceConfig: PrivacyInteractionServiceConfig = {
    apiUrl: 'api-url',
    region: 'region',
  }

  describe('getPrivacyInteractionServiceConfig', () => {
    it('should throw an PrivacyInteractionServiceConfigNotFoundError if config has no pimService stanza', () => {
      DefaultConfigurationManager.getInstance().setConfig(JSON.stringify({}))
      expect(() => getPrivacyInteractionServiceConfig()).toThrow(
        PrivacyInteractionServiceConfigNotFoundError,
      )
    })

    it('should return config if pimService stanza is present', () => {
      DefaultConfigurationManager.getInstance().setConfig(
        JSON.stringify({ pimService: privacyInteractionServiceConfig }),
      )
      expect(getPrivacyInteractionServiceConfig()).toStrictEqual(
        privacyInteractionServiceConfig,
      )
    })
  })
})
