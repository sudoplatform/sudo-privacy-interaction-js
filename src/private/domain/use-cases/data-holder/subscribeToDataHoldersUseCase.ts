/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DefaultLogger,
  Logger,
  NotSignedInError,
} from '@sudoplatform/sudo-common'
import { SudoUserClient } from '@sudoplatform/sudo-user'
import { DataHolderSubscriber } from '../../../../public/typings/subscription'
import { DataHolderService } from '../../entities/data-holder/dataHolderService'

/**
 * Input for `SubscribeToDataHoldersUseCase`.
 *
 * @interface SubscribeToDataHoldersUseCaseInput
 */
export interface SubscribeToDataHoldersUseCaseInput {
  subscriptionId: string
  subscriber: DataHolderSubscriber
}

/**
 * Application business logic for subscribing to data holder events.
 */
export class SubscribeToDataHoldersUseCase {
  private readonly log: Logger

  public constructor(
    private readonly dataHolderService: DataHolderService,
    private readonly sudoUserClient: SudoUserClient,
  ) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(input: SubscribeToDataHoldersUseCaseInput): Promise<void> {
    this.log.debug(this.constructor.name, {
      subscriptionId: input.subscriptionId,
    })

    const owner = await this.sudoUserClient.getSubject()
    if (!owner) {
      throw new NotSignedInError()
    }

    await this.dataHolderService.subscribe({
      subscriptionId: input.subscriptionId,
      owner,
      subscriber: input.subscriber,
    })
  }
}
