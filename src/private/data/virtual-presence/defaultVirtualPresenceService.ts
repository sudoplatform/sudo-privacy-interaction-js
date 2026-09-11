/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ConnectVirtualPresenceInput as ConnectVirtualPresenceInputGraphQL,
  OnVirtualPresenceUpdateSubscription,
} from '../../../gen/graphqlTypes'
import {
  ConnectionState,
  VirtualPresenceSubscriber,
} from '../../../public/typings/subscription'
import { VirtualPresenceEntity } from '../../domain/entities/virtual-presence/virtualPresenceEntity'
import {
  ConnectVirtualPresenceInput,
  ListVirtualPresencesInput,
  ListVirtualPresencesOutput,
  SubscribeToVirtualPresenceInput,
  VirtualPresenceService,
  RescanVirtualPresenceInput,
} from '../../domain/entities/virtual-presence/virtualPresenceService'
import { ApiClient } from '../common/apiClient'
import { SubscriptionResult } from '../common/baseSubscriptionManager'
import { RelationshipProviderTransformer } from './transformer/relationshipProviderTransformer'
import { VirtualPresenceTransformer } from './transformer/virtualPresenceTransformer'
import { VirtualPresenceSubscriptionManager } from './virtualPresenceSubscriptionManager'

export class DefaultVirtualPresenceService implements VirtualPresenceService {
  private readonly virtualPresenceTransformer: VirtualPresenceTransformer
  private readonly relationshipProviderTransformer: RelationshipProviderTransformer
  private readonly subscriptionManager: VirtualPresenceSubscriptionManager<
    OnVirtualPresenceUpdateSubscription,
    VirtualPresenceSubscriber
  >

  constructor(private readonly appSync: ApiClient) {
    this.virtualPresenceTransformer = new VirtualPresenceTransformer()
    this.relationshipProviderTransformer = new RelationshipProviderTransformer()
    this.subscriptionManager = new VirtualPresenceSubscriptionManager<
      OnVirtualPresenceUpdateSubscription,
      VirtualPresenceSubscriber
    >()
  }

  async connect(
    input: ConnectVirtualPresenceInput,
  ): Promise<VirtualPresenceEntity> {
    const graphQLInput: ConnectVirtualPresenceInputGraphQL = {
      authCode: input.authCode,
      refreshToken: input.refreshToken,
      relationshipProvider: input.relationshipProvider
        ? this.relationshipProviderTransformer.fromEntityToGraphQL(
            input.relationshipProvider,
          )
        : undefined,
    }
    const result = await this.appSync.connectVirtualPresence(graphQLInput)
    return this.virtualPresenceTransformer.fromGraphQLToEntity(result)
  }

  async list(
    input: ListVirtualPresencesInput,
  ): Promise<ListVirtualPresencesOutput> {
    const result = await this.appSync.listVirtualPresences(input)
    const virtualPresences: VirtualPresenceEntity[] = []
    if (result.items) {
      result.items.map((item) =>
        virtualPresences.push(
          this.virtualPresenceTransformer.fromGraphQLToEntity(item),
        ),
      )
    }
    return {
      virtualPresences,
      nextToken: result.nextToken ?? undefined,
    }
  }

  async rescan(
    input: RescanVirtualPresenceInput,
  ): Promise<VirtualPresenceEntity> {
    const result = await this.appSync.rescanVirtualPresence(
      input.id,
      input.options,
    )
    return this.virtualPresenceTransformer.fromGraphQLToEntity(result)
  }

  async disconnect(id: string): Promise<VirtualPresenceEntity> {
    const result = await this.appSync.disconnectVirtualPresence(id)
    return this.virtualPresenceTransformer.fromGraphQLToEntity(result)
  }

  async subscribe(input: SubscribeToVirtualPresenceInput): Promise<void> {
    this.subscriptionManager.subscribe(input.subscriptionId, input.subscriber)

    if (!this.subscriptionManager.getWatcher()) {
      this.subscriptionManager.setWatcher(
        await this.appSync.onVirtualPresenceUpdated(input.owner),
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
      next: (
        result: SubscriptionResult<OnVirtualPresenceUpdateSubscription>,
      ) => {
        if (result.data?.onVirtualPresenceUpdate) {
          const entity = this.virtualPresenceTransformer.fromGraphQLToEntity(
            result.data.onVirtualPresenceUpdate,
          )
          const virtualPresence =
            this.virtualPresenceTransformer.fromEntityToAPI(entity)
          this.subscriptionManager.virtualPresenceUpdated(virtualPresence)
        }
      },
    })
    return subscription
  }
}
