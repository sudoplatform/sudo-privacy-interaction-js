/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProviderConfigurationEntity } from '../../domain/entities/configuration/providerConfigurationEntity'
import { ProviderConfigurationService } from '../../domain/entities/configuration/providerConfigurationService'
import { ApiClient } from '../common/apiClient'
import { ProviderConfigurationTransformer } from './transformer/providerConfigurationTransformer'

export class DefaultProviderConfigurationService implements ProviderConfigurationService {
  private readonly providerConfigurationTransformer: ProviderConfigurationTransformer

  constructor(private readonly appSync: ApiClient) {
    this.providerConfigurationTransformer =
      new ProviderConfigurationTransformer()
  }

  async get(): Promise<ProviderConfigurationEntity[]> {
    const result = await this.appSync.getProviderConfiguration()
    return this.providerConfigurationTransformer.fromGraphQLToEntity(
      result.data,
    )
  }
}
