/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { internal as SudoUserInternal } from '@sudoplatform/sudo-user'
import { SudoPrivacyInteractionClientOptions } from '../../../public/sudoPrivacyInteractionClient'
import { ApiClient } from './apiClient'
import { PrivacyInteractionServiceConfig } from './config'

/**
 * Private DefaultSudoPrivacyInteractionClient for describing private options
 * for supporting unit testing.
 */
export type PrivateSudoPrivacyInteractionClientOptions = {
  apiClient?: ApiClient
  identityServiceConfig?: SudoUserInternal.IdentityServiceConfig
  privacyInteractionServiceConfig?: PrivacyInteractionServiceConfig
} & SudoPrivacyInteractionClientOptions
