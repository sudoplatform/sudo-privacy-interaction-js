/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProviderTypeEntity } from '../virtual-presence/virtualPresenceEntity'

/**
 * Core entity representation of a provider configuration.
 *
 * Contains the configuration required by consumers to support the provider
 * OAuth flow. This is the decoded form of the opaque configuration data
 * returned by the service.
 *
 * @interface ProviderConfigurationEntity
 * @property {string} name Human-readable provider name (e.g. 'google').
 * @property {ProviderTypeEntity} providerType The kind of virtual presence this provider backs (e.g. EMAIL).
 * @property {string} clientId OAuth client id.
 */
export interface ProviderConfigurationEntity {
  name: string
  providerType: ProviderTypeEntity
  clientId: string
}
