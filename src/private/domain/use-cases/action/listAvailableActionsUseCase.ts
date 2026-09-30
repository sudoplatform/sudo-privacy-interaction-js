/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import {
  ActionService,
  ListAvailableActionsInput,
  ListAvailableActionsOutput,
} from '../../entities/action/actionService'

/**
 * Application business logic for listing the actions available for a data holder
 * relationship.
 */
export class ListAvailableActionsUseCase {
  private readonly log: Logger

  public constructor(private readonly actionService: ActionService) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(
    input: ListAvailableActionsInput,
  ): Promise<ListAvailableActionsOutput> {
    this.log.debug(this.constructor.name, { input })
    return await this.actionService.listAvailable(input)
  }
}
