/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultConfigurationManager } from '@sudoplatform/sudo-common'
import * as t from 'io-ts'
import { PrivacyInteractionServiceConfigNotFoundError } from '../../../public/errors'

const PrivacyInteractionServiceConfigCodec = t.type({
  apiUrl: t.string,
  region: t.string,
})

export type PrivacyInteractionServiceConfig = t.TypeOf<
  typeof PrivacyInteractionServiceConfigCodec
>

export const getPrivacyInteractionServiceConfig =
  (): PrivacyInteractionServiceConfig => {
    if (!DefaultConfigurationManager.getInstance().getConfigSet('pimService')) {
      throw new PrivacyInteractionServiceConfigNotFoundError()
    }

    return DefaultConfigurationManager.getInstance().bindConfigSet<PrivacyInteractionServiceConfig>(
      PrivacyInteractionServiceConfigCodec,
      'pimService',
    )
  }
