/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { VirtualPresenceService } from '../../entities/virtual-presence/virtualPresenceService'

/**
 * Application business logic for unsubscribing from virtual presence events.
 */
export class UnsubscribeFromVirtualPresenceUseCase {
  private readonly log: Logger

  public constructor(
    private readonly virtualPresenceService: VirtualPresenceService,
  ) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  execute(subscriptionId: string): void {
    this.log.debug(this.constructor.name, {
      subscriptionId,
    })
    this.virtualPresenceService.unsubscribe(subscriptionId)
  }
}
