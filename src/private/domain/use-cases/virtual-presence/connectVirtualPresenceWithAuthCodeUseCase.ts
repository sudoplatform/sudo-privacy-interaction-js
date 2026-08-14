/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { VirtualPresenceEntity } from '../../entities/virtual-presence/virtualPresenceEntity'
import { VirtualPresenceService } from '../../entities/virtual-presence/virtualPresenceService'

/**
 * Application business logic for connecting a virtual presence using an authorization code.
 */
export class ConnectVirtualPresenceWithAuthCodeUseCase {
  private readonly log: Logger

  public constructor(
    private readonly virtualPresenceService: VirtualPresenceService,
  ) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(authCode: string): Promise<VirtualPresenceEntity> {
    this.log.debug(this.constructor.name)
    return await this.virtualPresenceService.connect({
      authCode,
    })
  }
}
