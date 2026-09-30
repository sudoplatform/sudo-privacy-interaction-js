/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { ActionEntity } from '../../entities/action/actionEntity'
import {
  ActionService,
  InitiateActionInput,
} from '../../entities/action/actionService'

/**
 * Application business logic for initiating an action against a data holder
 * relationship.
 */
export class InitiateActionUseCase {
  private readonly log: Logger

  public constructor(private readonly actionService: ActionService) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(input: InitiateActionInput): Promise<ActionEntity> {
    this.log.debug(this.constructor.name, { input })
    return await this.actionService.initiate(input)
  }
}
