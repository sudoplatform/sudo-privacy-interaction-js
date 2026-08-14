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
import { VirtualPresenceSubscriber } from '../../../../public/typings/subscription'
import { VirtualPresenceService } from '../../entities/virtual-presence/virtualPresenceService'

/**
 * Input for `SubscribeToVirtualPresenceUseCase`.
 *
 * @interface SubscribeToVirtualPresenceUseCaseInput
 */
export interface SubscribeToVirtualPresenceUseCaseInput {
  subscriptionId: string
  subscriber: VirtualPresenceSubscriber
}

/**
 * Application business logic for subscribing to virtual presence events.
 */
export class SubscribeToVirtualPresenceUseCase {
  private readonly log: Logger

  public constructor(
    private readonly virtualPresenceService: VirtualPresenceService,
    private readonly sudoUserClient: SudoUserClient,
  ) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(input: SubscribeToVirtualPresenceUseCaseInput): Promise<void> {
    this.log.debug(this.constructor.name, {
      subscriptionId: input.subscriptionId,
    })

    const owner = await this.sudoUserClient.getSubject()
    if (!owner) {
      throw new NotSignedInError()
    }

    await this.virtualPresenceService.subscribe({
      subscriptionId: input.subscriptionId,
      owner,
      subscriber: input.subscriber,
    })
  }
}
