/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultApiClientManager } from '@sudoplatform/sudo-api-client'
import {
  DefaultConfigurationManager,
  DefaultLogger,
  DefaultSudoKeyManager,
} from '@sudoplatform/sudo-common'
import {
  DefaultSudoEntitlementsClient,
  SudoEntitlementsClient,
} from '@sudoplatform/sudo-entitlements'
import {
  DefaultSudoEntitlementsAdminClient,
  SudoEntitlementsAdminClient,
} from '@sudoplatform/sudo-entitlements-admin'
import {
  DefaultSudoUserClient,
  SudoUserClient,
  TESTAuthenticationProvider,
} from '@sudoplatform/sudo-user'
import { WebSudoCryptoProvider } from '@sudoplatform/sudo-web-crypto-provider'
import * as fs from 'fs'
import { v4 } from 'uuid'
import { ApiClient } from '../../../src/private/data/common/apiClient'
import { PrivateSudoPrivacyInteractionClientOptions } from '../../../src/private/data/common/privateSudoPrivacyInteractionClientOptions'
import {
  DefaultSudoPrivacyInteractionClient,
  SudoPrivacyInteractionClient,
} from '../../../src/public'
import { EntitlementsBuilder } from './entitlements'

const configFile = 'config/sudoplatformconfig.json'
const registerKeyFile = 'config/register_key.private'
const registerKeyIdFile = 'config/register_key.id'
const registerKey = fs.readFileSync(registerKeyFile).toString()
const registerKeyId = fs.readFileSync(registerKeyIdFile).toString().trim()

const adminApiKeyFile = 'config/admin_api_key.secret'
let adminApiKey: string | undefined
if (fs.existsSync(adminApiKeyFile)) {
  adminApiKey = fs.readFileSync(adminApiKeyFile).toString().trim()
} else {
  adminApiKey = process.env.ADMIN_API_KEY?.trim()
}

const testAuthenticationProvider = new TESTAuthenticationProvider(
  'pims-js-test',
  registerKey,
  registerKeyId,
)

export function setupSudoPlatformConfig(log: DefaultLogger) {
  try {
    DefaultConfigurationManager.getInstance().setConfig(
      fs.readFileSync(configFile).toString(),
    )
  } catch (err) {
    log.error(`${setupSudoPlatformConfig.name} FAILED`)
    console.log(`${setupSudoPlatformConfig.name} FAILED`)
    throw err
  }
}

export interface SetupPrivacyInteractionClientOutput {
  privacyInteractionClient: SudoPrivacyInteractionClient
  userClient: SudoUserClient
  entitlementsClient: SudoEntitlementsClient
  entitlementsAdminClient: SudoEntitlementsAdminClient
  apiClient: ApiClient
  owner: string
}

export const setupPrivacyInteractionClient = async (
  log: DefaultLogger,
): Promise<SetupPrivacyInteractionClientOutput> => {
  try {
    setupSudoPlatformConfig(log)

    const testKeyManager = new DefaultSudoKeyManager(
      new WebSudoCryptoProvider(
        'SudoUserClient',
        'com.sudoplatform.appservicename',
      ),
    )

    const userClient = new DefaultSudoUserClient({
      logger: log,
      sudoKeyManager: testKeyManager,
    })
    const username = await userClient
      .registerWithAuthenticationProvider(
        testAuthenticationProvider,
        `pims-JS-SDK-${v4()}`,
      )
      .catch((err) => {
        console.log('Error registering user', { err })
        throw err
      })
    log.debug('username', { username })
    await userClient.signInWithKey().catch((err) => {
      console.log('Error signing in', { err })
      throw err
    })

    const owner = await userClient.getSubject()
    if (!owner) {
      throw new Error('Unable to resolve owner after sign in')
    }

    const apiClientManager =
      DefaultApiClientManager.getInstance().setAuthClient(userClient)
    const entitlementsClient = new DefaultSudoEntitlementsClient(userClient)
    const entitlementsAdminClient = new DefaultSudoEntitlementsAdminClient(
      adminApiKey,
    )

    await new EntitlementsBuilder()
      .setEntitlementsClient(entitlementsClient)
      .setEntitlementsAdminClient(entitlementsAdminClient)
      .setLogger(log)
      .apply()
      .catch((err) => {
        console.log('Error applying entitlements', { err })
        throw err
      })
    const apiClient = new ApiClient(apiClientManager)
    const options: PrivateSudoPrivacyInteractionClientOptions = {
      sudoUserClient: userClient,
      apiClient,
    }
    const privacyInteractionClient = new DefaultSudoPrivacyInteractionClient(
      options,
    )

    return {
      privacyInteractionClient,
      userClient,
      apiClient,
      entitlementsClient,
      entitlementsAdminClient,
      owner,
    }
  } catch (err) {
    log.error(`${setupPrivacyInteractionClient.name} FAILED`)
    console.log(`${setupPrivacyInteractionClient.name} FAILED`)
    throw err
  }
}
