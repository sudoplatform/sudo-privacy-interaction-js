/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OnActionStatusUpdateSubscription } from '../../../gen/graphqlTypes'
import {
  ActionSubscriber,
  ConnectionState,
} from '../../../public/typings/subscription'
import { ActionEntity } from '../../domain/entities/action/actionEntity'
import {
  ActionService,
  InitiateActionInput,
  ListAvailableActionsInput,
  ListAvailableActionsOutput,
  SubscribeToActionsInput,
} from '../../domain/entities/action/actionService'
import { ApiClient } from '../common/apiClient'
import { SubscriptionResult } from '../common/baseSubscriptionManager'
import { ActionSubscriptionManager } from './actionSubscriptionManager'
import { ActionFulfilmentMethodTransformer } from './transformer/actionFulfilmentMethodTransformer'
import { ActionIntentTransformer } from './transformer/actionIntentTransformer'
import { ActionTransformer } from './transformer/actionTransformer'
import { AvailableActionTransformer } from './transformer/availableActionTransformer'

export class DefaultActionService implements ActionService {
  private readonly actionTransformer: ActionTransformer
  private readonly availableActionTransformer: AvailableActionTransformer
  private readonly intentTransformer: ActionIntentTransformer
  private readonly fulfilmentMethodTransformer: ActionFulfilmentMethodTransformer
  private readonly subscriptionManager: ActionSubscriptionManager<
    OnActionStatusUpdateSubscription,
    ActionSubscriber
  >

  constructor(private readonly appSync: ApiClient) {
    this.actionTransformer = new ActionTransformer()
    this.availableActionTransformer = new AvailableActionTransformer()
    this.intentTransformer = new ActionIntentTransformer()
    this.fulfilmentMethodTransformer = new ActionFulfilmentMethodTransformer()
    this.subscriptionManager = new ActionSubscriptionManager<
      OnActionStatusUpdateSubscription,
      ActionSubscriber
    >()
  }

  async initiate(input: InitiateActionInput): Promise<ActionEntity> {
    const result = await this.appSync.initiateAction({
      dataHolderId: input.dataHolderId,
      intent: this.intentTransformer.fromEntityToGraphQL(input.intent),
      fulfilmentMethod: this.fulfilmentMethodTransformer.fromEntityToGraphQL(
        input.fulfilmentMethod,
      ),
    })
    return this.actionTransformer.fromGraphQLToEntity(result)
  }

  async confirmOutcome(id: string): Promise<ActionEntity> {
    const result = await this.appSync.confirmActionOutcome(id)
    return this.actionTransformer.fromGraphQLToEntity(result)
  }

  async listAvailable(
    input: ListAvailableActionsInput,
  ): Promise<ListAvailableActionsOutput> {
    const result = await this.appSync.listAvailableActions(input)
    const availableActions = (result.items ?? []).map((item) =>
      this.availableActionTransformer.fromGraphQLToEntity(item),
    )
    return {
      availableActions,
      nextToken: result.nextToken ?? undefined,
    }
  }

  async subscribe(input: SubscribeToActionsInput): Promise<void> {
    this.subscriptionManager.subscribe(input.subscriptionId, input.subscriber)

    if (!this.subscriptionManager.getWatcher()) {
      this.subscriptionManager.setWatcher(
        await this.appSync.onActionStatusUpdated(input.owner),
      )

      this.subscriptionManager.setSubscription(this.setupUpdateSubscription())

      this.subscriptionManager.connectionStatusChanged(
        ConnectionState.Connected,
      )
    }
  }

  unsubscribe(subscriptionId: string): void {
    this.subscriptionManager.unsubscribe(subscriptionId)
  }

  private setupUpdateSubscription(): ZenObservable.Subscription | undefined {
    const subscription = this.subscriptionManager.getWatcher()?.subscribe({
      complete: () => {
        this.subscriptionManager.connectionStatusChanged(
          ConnectionState.Disconnected,
        )
      },
      error: () => {
        this.subscriptionManager.connectionStatusChanged(
          ConnectionState.Disconnected,
        )
      },
      next: (result: SubscriptionResult<OnActionStatusUpdateSubscription>) => {
        const action = result.data?.onActionStatusUpdate
        if (action) {
          const entity = this.actionTransformer.fromGraphQLToEntity(action)
          this.subscriptionManager.actionUpdated(
            this.actionTransformer.fromEntityToAPI(entity),
          )
        }
      },
    })
    return subscription
  }
}
