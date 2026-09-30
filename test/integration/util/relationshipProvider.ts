/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  RelationshipProvider,
  SudoPrivacyInteractionClient,
} from '../../../src/public'

/**
 * Resolves the relationship provider to use when connecting a virtual presence
 * based on the provider configuration returned by the service.
 *
 * Prefers the `TEST_PROVIDER` whenever it is available. If absent, fall back to the
 * provider keyed by the `name` parameter (i.e. `GMAIL_PROVIDER`).
 *
 * @param {SudoPrivacyInteractionClient} client The privacy interaction client.
 * @returns {RelationshipProvider} The resolved relationship provider.
 */
export const resolveRelationshipProvider = async (
  client: SudoPrivacyInteractionClient,
): Promise<RelationshipProvider> => {
  const configs = await client.getProviderConfiguration()
  const hasTestProvider = configs.some(
    (config) => config.name.toLowerCase() === 'default',
  )
  if (hasTestProvider) {
    return RelationshipProvider.TestProvider
  }
  const isGoogle = configs.some((config) =>
    config.name.toLowerCase().includes('google'),
  )
  return isGoogle
    ? RelationshipProvider.GmailProvider
    : RelationshipProvider.TestProvider
}

/**
 * Determines whether the TEST relationship provider is enabled for the current
 * environment. The TEST provider allows seeding data holders with known actions
 * (e.g. via `List-Unsubscribe` headers), which some integration tests depend on.
 *
 * @param {SudoPrivacyInteractionClient} client The privacy interaction client.
 * @returns {boolean} True when the TEST provider is available.
 */
export const isTestProviderEnabled = async (
  client: SudoPrivacyInteractionClient,
): Promise<boolean> => {
  const configs = await client.getProviderConfiguration()
  return configs.some((config) => config.name.toLowerCase() === 'default')
}
