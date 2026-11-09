/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import {
  ActionService,
  ListActionsForDataHolderInput,
  ListActionsForDataHolderOutput,
} from '../../entities/action/actionService'

/**
 * Application business logic for listing the persisted action history for a data
 * holder.
 */
export class ListActionsForDataHolderUseCase {
  private readonly log: Logger

  public constructor(private readonly actionService: ActionService) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(
    input: ListActionsForDataHolderInput,
  ): Promise<ListActionsForDataHolderOutput> {
    this.log.debug(this.constructor.name, { input })
    return await this.actionService.listForDataHolder(input)
  }
}
