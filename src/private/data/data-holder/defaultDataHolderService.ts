/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OnDataHoldersUpdateSubscription } from '../../../gen/graphqlTypes'
import {
  ConnectionState,
  DataHolderSubscriber,
} from '../../../public/typings/subscription'
import { DataHolderEntity } from '../../domain/entities/data-holder/dataHolderEntity'
import {
  DataHolderService,
  ListDataHoldersInput,
  ListDataHoldersOutput,
  ListDataHolderScanSummariesInput,
  ListDataHolderScanSummariesOutput,
  SubscribeToDataHoldersInput,
} from '../../domain/entities/data-holder/dataHolderService'
import { ApiClient } from '../common/apiClient'
import { SubscriptionResult } from '../common/baseSubscriptionManager'
import { DataHolderSubscriptionManager } from './dataHolderSubscriptionManager'
import { DataHolderScanSummaryTransformer } from './transformer/dataHolderScanSummaryTransformer'
import { DataHolderTransformer } from './transformer/dataHolderTransformer'

export class DefaultDataHolderService implements DataHolderService {
  private readonly dataHolderTransformer: DataHolderTransformer
  private readonly dataHolderScanSummaryTransformer: DataHolderScanSummaryTransformer
  private readonly subscriptionManager: DataHolderSubscriptionManager<
    OnDataHoldersUpdateSubscription,
    DataHolderSubscriber
  >

  constructor(private readonly appSync: ApiClient) {
    this.dataHolderTransformer = new DataHolderTransformer()
    this.dataHolderScanSummaryTransformer =
      new DataHolderScanSummaryTransformer()
    this.subscriptionManager = new DataHolderSubscriptionManager<
      OnDataHoldersUpdateSubscription,
      DataHolderSubscriber
    >()
  }

  async get(id: string): Promise<DataHolderEntity | undefined> {
    const result = await this.appSync.getDataHolder(id)
    if (!result) {
      return undefined
    }
    return this.dataHolderTransformer.fromGraphQLToEntity(result)
  }

  async list(input: ListDataHoldersInput): Promise<ListDataHoldersOutput> {
    const result = await this.appSync.listDataHolders(input)
    const dataHolders: DataHolderEntity[] = []
    if (result.items) {
      result.items.map((item) =>
        dataHolders.push(this.dataHolderTransformer.fromGraphQLToEntity(item)),
      )
    }
    return {
      dataHolders,
      nextToken: result.nextToken ?? undefined,
    }
  }

  async listScanSummaries(
    input: ListDataHolderScanSummariesInput,
  ): Promise<ListDataHolderScanSummariesOutput> {
    const result = await this.appSync.listDataHolderScanSummaries(input)
    const scanSummaries = (result.items ?? []).map((item) =>
      this.dataHolderScanSummaryTransformer.fromGraphQLToEntity(item),
    )
    return {
      scanSummaries,
      nextToken: result.nextToken ?? undefined,
    }
  }

  async subscribe(input: SubscribeToDataHoldersInput): Promise<void> {
    this.subscriptionManager.subscribe(input.subscriptionId, input.subscriber)

    if (!this.subscriptionManager.getWatcher()) {
      this.subscriptionManager.setWatcher(
        await this.appSync.onDataHoldersUpdated(input.owner),
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
      next: (result: SubscriptionResult<OnDataHoldersUpdateSubscription>) => {
        const items = result.data?.onDataHoldersUpdate?.items
        if (items) {
          const dataHolders = items.map((item) => {
            const entity = this.dataHolderTransformer.fromGraphQLToEntity(item)
            return this.dataHolderTransformer.fromEntityToAPI(entity)
          })
          this.subscriptionManager.dataHoldersUpdated(dataHolders)
        }
      },
    })
    return subscription
  }
}
