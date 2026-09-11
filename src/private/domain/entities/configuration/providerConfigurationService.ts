/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProviderConfigurationEntity } from './providerConfigurationEntity'

/**
 * Core entity representation of a configuration service used in business logic.
 * Used to retrieve service configuration.
 *
 * @interface ProviderConfigurationService
 */
export interface ProviderConfigurationService {
  /**
   * Retrieve the provider configurations required by consumers to support
   * the provider OAuth flow.
   *
   * @returns {ProviderConfigurationEntity[]} The decoded provider configurations.
   */
  get(): Promise<ProviderConfigurationEntity[]>
}
