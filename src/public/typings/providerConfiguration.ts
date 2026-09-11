/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProviderType } from './virtualPresence'

/**
 * The Sudo Platform SDK representation of a provider client configuration.
 *
 * Contains the configuration required by consumers to support the provider
 * OAuth flow. This is the decoded form of the opaque configuration data
 * returned by the service.
 *
 * @interface ProviderConfiguration
 * @property {string} name Human-readable provider name (e.g. 'google').
 * @property {ProviderType} providerType The kind of virtual presence this provider backs (e.g. EMAIL).
 * @property {string} clientId OAuth client id.
 */
export interface ProviderConfiguration {
  name: string
  providerType: ProviderType
  clientId: string
}
