/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { DataHolderService } from '../../entities/data-holder/dataHolderService'

/**
 * Application business logic for unsubscribing from data holder events.
 */
export class UnsubscribeFromDataHoldersUseCase {
  private readonly log: Logger

  public constructor(private readonly dataHolderService: DataHolderService) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  execute(subscriptionId: string): void {
    this.log.debug(this.constructor.name, {
      subscriptionId,
    })
    this.dataHolderService.unsubscribe(subscriptionId)
  }
}
