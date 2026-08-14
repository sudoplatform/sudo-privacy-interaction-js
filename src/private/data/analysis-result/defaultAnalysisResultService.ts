/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OnAnalysisResultUpdateSubscription } from '../../../gen/graphqlTypes'
import { AnalysisResultUpdate } from '../../../public/typings/analysisResult'
import {
  AnalysisResultSubscriber,
  ConnectionState,
} from '../../../public/typings/subscription'
import { AnalysisResultEntity } from '../../domain/entities/analysis-result/analysisResultEntity'
import {
  AnalysisResultService,
  ListAnalysisResultsInput,
  ListAnalysisResultsOutput,
  SubscribeToAnalysisResultInput,
} from '../../domain/entities/analysis-result/analysisResultService'
import { ApiClient } from '../common/apiClient'
import { SubscriptionResult } from '../common/baseSubscriptionManager'
import { AnalysisResultSubscriptionManager } from './analysisResultSubscriptionManager'
import { AnalysisResultStatusTransformer } from './transformer/analysisResultStatusTransformer'
import { AnalysisResultTransformer } from './transformer/analysisResultTransformer'

export class DefaultAnalysisResultService implements AnalysisResultService {
  private readonly analysisResultTransformer: AnalysisResultTransformer
  private readonly analysisResultStatusTransformer: AnalysisResultStatusTransformer
  private readonly subscriptionManager: AnalysisResultSubscriptionManager<
    OnAnalysisResultUpdateSubscription,
    AnalysisResultSubscriber
  >

  constructor(private readonly appSync: ApiClient) {
    this.analysisResultTransformer = new AnalysisResultTransformer()
    this.analysisResultStatusTransformer = new AnalysisResultStatusTransformer()
    this.subscriptionManager = new AnalysisResultSubscriptionManager<
      OnAnalysisResultUpdateSubscription,
      AnalysisResultSubscriber
    >()
  }

  async get(id: string): Promise<AnalysisResultEntity | undefined> {
    const result = await this.appSync.getAnalysisResult(id)
    if (!result) {
      return undefined
    }
    return this.analysisResultTransformer.fromGraphQLToEntity(result)
  }

  async list(
    input: ListAnalysisResultsInput,
  ): Promise<ListAnalysisResultsOutput> {
    const result = await this.appSync.listAnalysisResults(input)
    const analysisResults: AnalysisResultEntity[] = []
    if (result.items) {
      result.items.map((item) =>
        analysisResults.push(
          this.analysisResultTransformer.fromGraphQLToEntity(item),
        ),
      )
    }
    return {
      analysisResults,
      nextToken: result.nextToken ?? undefined,
    }
  }

  async subscribe(input: SubscribeToAnalysisResultInput): Promise<void> {
    this.subscriptionManager.subscribe(input.subscriptionId, input.subscriber)

    if (!this.subscriptionManager.getWatcher()) {
      this.subscriptionManager.setWatcher(
        await this.appSync.onAnalysisResultUpdated(input.owner),
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
        result: SubscriptionResult<OnAnalysisResultUpdateSubscription>,
      ) => {
        const item = result.data?.onAnalysisResultUpdate
        if (item) {
          const statusEntity =
            this.analysisResultStatusTransformer.fromGraphQLToEntity(
              item.status,
            )
          const update: AnalysisResultUpdate = {
            id: item.id,
            virtualPresenceId: item.virtualPresenceId,
            dataHolderIdentifier: item.dataHolderIdentifier,
            status:
              this.analysisResultStatusTransformer.fromEntityToAPI(
                statusEntity,
              ),
            lastAnalyzedAt: new Date(item.lastAnalyzedAtEpochMs),
            owner: item.owner,
            version: item.version,
            createdAt: new Date(item.createdAtEpochMs),
            updatedAt: new Date(item.updatedAtEpochMs),
          }
          this.subscriptionManager.analysisResultUpdated(update)
        }
      },
    })
    return subscription
  }
}
