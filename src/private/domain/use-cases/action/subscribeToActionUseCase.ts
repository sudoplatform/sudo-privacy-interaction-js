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
import { ActionSubscriber } from '../../../../public/typings/subscription'
import { ActionService } from '../../entities/action/actionService'

/**
 * Input for `SubscribeToActionUseCase`.
 *
 * @interface SubscribeToActionUseCaseInput
 */
export interface SubscribeToActionUseCaseInput {
  subscriptionId: string
  subscriber: ActionSubscriber
}

/**
 * Application business logic for subscribing to action status events.
 */
export class SubscribeToActionUseCase {
  private readonly log: Logger

  public constructor(
    private readonly actionService: ActionService,
    private readonly sudoUserClient: SudoUserClient,
  ) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(input: SubscribeToActionUseCaseInput): Promise<void> {
    this.log.debug(this.constructor.name, {
      subscriptionId: input.subscriptionId,
    })

    const owner = await this.sudoUserClient.getSubject()
    if (!owner) {
      throw new NotSignedInError()
    }

    await this.actionService.subscribe({
      subscriptionId: input.subscriptionId,
      owner,
      subscriber: input.subscriber,
    })
  }
}
