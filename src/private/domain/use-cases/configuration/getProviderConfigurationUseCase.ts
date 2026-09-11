/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { ProviderConfigurationEntity } from '../../entities/configuration/providerConfigurationEntity'
import { ProviderConfigurationService } from '../../entities/configuration/providerConfigurationService'

/**
 * Application business logic for retrieving the provider configuration.
 */
export class GetProviderConfigurationUseCase {
  private readonly log: Logger

  public constructor(
    private readonly providerConfigurationService: ProviderConfigurationService,
  ) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(): Promise<ProviderConfigurationEntity[]> {
    this.log.debug(this.constructor.name)
    return await this.providerConfigurationService.get()
  }
}
