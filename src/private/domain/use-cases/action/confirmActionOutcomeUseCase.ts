/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { ActionEntity } from '../../entities/action/actionEntity'
import { ActionService } from '../../entities/action/actionService'

/**
 * Application business logic for confirming that an action was completed.
 */
export class ConfirmActionOutcomeUseCase {
  private readonly log: Logger

  public constructor(private readonly actionService: ActionService) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(id: string): Promise<ActionEntity> {
    this.log.debug(this.constructor.name, { id })
    return await this.actionService.confirmOutcome(id)
  }
}
