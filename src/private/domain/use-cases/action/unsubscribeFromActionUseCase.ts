/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { ActionService } from '../../entities/action/actionService'

/**
 * Application business logic for unsubscribing from action status events.
 */
export class UnsubscribeFromActionUseCase {
  private readonly log: Logger

  public constructor(private readonly actionService: ActionService) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  execute(subscriptionId: string): void {
    this.log.debug(this.constructor.name, {
      subscriptionId,
    })
    this.actionService.unsubscribe(subscriptionId)
  }
}
