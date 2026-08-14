/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { ScanOptionsEntity } from '../../entities/inputs/scanOptionsEntity'
import { VirtualPresenceEntity } from '../../entities/virtual-presence/virtualPresenceEntity'
import { VirtualPresenceService } from '../../entities/virtual-presence/virtualPresenceService'

/**
 * Input for `RescanVirtualPresenceCase`.
 *
 * @interface RescanVirtualPresenceUseCaseInput
 */
interface RescanVirtualPresenceUseCaseInput {
  id: string
  options?: ScanOptionsEntity
}

/**
 * Application business logic for rescanning a virtual presence.
 */
export class RescanVirtualPresenceUseCase {
  private readonly log: Logger

  public constructor(
    private readonly virtualPresenceService: VirtualPresenceService,
  ) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(
    input: RescanVirtualPresenceUseCaseInput,
  ): Promise<VirtualPresenceEntity> {
    this.log.debug(this.constructor.name, { input })
    return await this.virtualPresenceService.rescan(input)
  }
}
