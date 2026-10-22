/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { ActionEntity } from '../../entities/action/actionEntity'
import { ActionService } from '../../entities/action/actionService'

/**
 * Application business logic for retrieving a single action.
 */
export class GetActionUseCase {
  private readonly log: Logger

  public constructor(private readonly actionService: ActionService) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(id: string): Promise<ActionEntity | undefined> {
    this.log.debug(this.constructor.name, { id })
    return await this.actionService.get(id)
  }
}
