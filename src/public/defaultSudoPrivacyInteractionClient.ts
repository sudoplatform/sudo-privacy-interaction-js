/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, ListOutput, Logger } from '@sudoplatform/sudo-common'
import { SudoUserClient } from '@sudoplatform/sudo-user'
import { DefaultAnalysisResultService } from '../private/data/analysis-result/defaultAnalysisResultService'
import { AnalysisResultTransformer } from '../private/data/analysis-result/transformer/analysisResultTransformer'
import { ApiClient } from '../private/data/common/apiClient'
import { PrivateSudoPrivacyInteractionClientOptions } from '../private/data/common/privateSudoPrivacyInteractionClientOptions'
import { DefaultDataHolderService } from '../private/data/data-holder/defaultDataHolderService'
import { DataHolderTransformer } from '../private/data/data-holder/transformer/dataHolderTransformer'
import { DefaultVirtualPresenceService } from '../private/data/virtual-presence/defaultVirtualPresenceService'
import { VirtualPresenceTransformer } from '../private/data/virtual-presence/transformer/virtualPresenceTransformer'
import { GetAnalysisResultUseCase } from '../private/domain/use-cases/analysis-result/getAnalysisResultUseCase'
import { ListAnalysisResultsUseCase } from '../private/domain/use-cases/analysis-result/listAnalysisResultsUseCase'
import { SubscribeToAnalysisResultUseCase } from '../private/domain/use-cases/analysis-result/subscribeToAnalysisResultUseCase'
import { UnsubscribeFromAnalysisResultUseCase } from '../private/domain/use-cases/analysis-result/unsubscribeFromAnalysisResultUseCase'
import { GetDataHolderUseCase } from '../private/domain/use-cases/data-holder/getDataHolderUseCase'
import { ListDataHoldersUseCase } from '../private/domain/use-cases/data-holder/listDataHoldersUseCase'
import { SubscribeToDataHoldersUseCase } from '../private/domain/use-cases/data-holder/subscribeToDataHoldersUseCase'
import { UnsubscribeFromDataHoldersUseCase } from '../private/domain/use-cases/data-holder/unsubscribeFromDataHoldersUseCase'
import { ConnectVirtualPresenceWithAuthCodeUseCase } from '../private/domain/use-cases/virtual-presence/connectVirtualPresenceWithAuthCodeUseCase'
import { ConnectVirtualPresenceWithRefreshTokenUseCase } from '../private/domain/use-cases/virtual-presence/connectVirtualPresenceWithRefreshTokenUseCase'
import { DisconnectVirtualPresenceUseCase } from '../private/domain/use-cases/virtual-presence/disconnectVirtualPresenceUseCase'
import { ListVirtualPresencesUseCase } from '../private/domain/use-cases/virtual-presence/listVirtualPresencesUseCase'
import { RescanVirtualPresenceUseCase } from '../private/domain/use-cases/virtual-presence/rescanVirtualPresenceUseCase'
import { SubscribeToVirtualPresenceUseCase } from '../private/domain/use-cases/virtual-presence/subscribeToVirtualPresenceUseCase'
import { UnsubscribeFromVirtualPresenceUseCase } from '../private/domain/use-cases/virtual-presence/unsubscribeFromVirtualPresenceUseCase'
import {
  ConnectVirtualPresenceWithRefreshTokenInput,
  ListAnalysisResultsInput,
  ListDataHoldersInput,
  ListVirtualPresencesInput,
  RescanVirtualPresenceInput,
} from './inputs'
import {
  SudoPrivacyInteractionClient,
  SudoPrivacyInteractionClientOptions,
} from './sudoPrivacyInteractionClient'
import {
  AnalysisResult,
  AnalysisResultSubscriber,
  DataHolder,
  DataHolderSubscriber,
  VirtualPresence,
  VirtualPresenceSubscriber,
} from './typings'

export class DefaultSudoPrivacyInteractionClient implements SudoPrivacyInteractionClient {
  private readonly apiClient: ApiClient
  private readonly userClient: SudoUserClient
  private readonly virtualPresenceService: DefaultVirtualPresenceService
  private readonly dataHolderService: DefaultDataHolderService
  private readonly analysisResultService: DefaultAnalysisResultService
  private readonly virtualPresenceTransformer: VirtualPresenceTransformer
  private readonly dataHolderTransformer: DataHolderTransformer
  private readonly analysisResultTransformer: AnalysisResultTransformer
  private readonly log: Logger

  public constructor(opts: SudoPrivacyInteractionClientOptions) {
    this.log = new DefaultLogger(this.constructor.name)

    const privateOptions = opts as PrivateSudoPrivacyInteractionClientOptions

    this.apiClient = privateOptions.apiClient ?? new ApiClient()
    this.userClient = opts.sudoUserClient

    this.virtualPresenceService = new DefaultVirtualPresenceService(
      this.apiClient,
    )
    this.dataHolderService = new DefaultDataHolderService(this.apiClient)
    this.analysisResultService = new DefaultAnalysisResultService(
      this.apiClient,
    )

    this.virtualPresenceTransformer = new VirtualPresenceTransformer()
    this.dataHolderTransformer = new DataHolderTransformer()
    this.analysisResultTransformer = new AnalysisResultTransformer()
  }

  public async connectVirtualPresenceWithAuthCode(
    authCode: string,
  ): Promise<VirtualPresence> {
    this.log.debug(this.connectVirtualPresenceWithAuthCode.name)
    const useCase = new ConnectVirtualPresenceWithAuthCodeUseCase(
      this.virtualPresenceService,
    )
    const result = await useCase.execute(authCode)
    return this.virtualPresenceTransformer.fromEntityToAPI(result)
  }

  public async connectVirtualPresenceWithRefreshToken(
    input: ConnectVirtualPresenceWithRefreshTokenInput,
  ): Promise<VirtualPresence> {
    this.log.debug(this.connectVirtualPresenceWithRefreshToken.name)
    const useCase = new ConnectVirtualPresenceWithRefreshTokenUseCase(
      this.virtualPresenceService,
    )
    const result = await useCase.execute(input)
    return this.virtualPresenceTransformer.fromEntityToAPI(result)
  }

  public async disconnectVirtualPresence(id: string): Promise<VirtualPresence> {
    this.log.debug(this.disconnectVirtualPresence.name, { id })
    const useCase = new DisconnectVirtualPresenceUseCase(
      this.virtualPresenceService,
    )
    const result = await useCase.execute(id)
    return this.virtualPresenceTransformer.fromEntityToAPI(result)
  }

  public async rescanVirtualPresence(
    input: RescanVirtualPresenceInput,
  ): Promise<VirtualPresence> {
    this.log.debug(this.rescanVirtualPresence.name, { input })
    const useCase = new RescanVirtualPresenceUseCase(
      this.virtualPresenceService,
    )
    const result = await useCase.execute(input)
    return this.virtualPresenceTransformer.fromEntityToAPI(result)
  }

  public async listVirtualPresences(
    input: ListVirtualPresencesInput,
  ): Promise<ListOutput<VirtualPresence>> {
    this.log.debug(this.listVirtualPresences.name, {
      input,
    })
    const useCase = new ListVirtualPresencesUseCase(this.virtualPresenceService)
    const { virtualPresences, nextToken: resultNextToken } =
      await useCase.execute({
        limit: input.limit,
        nextToken: input.nextToken,
      })
    const transformedVirtualPresences = virtualPresences.map(
      (virtualPresence) =>
        this.virtualPresenceTransformer.fromEntityToAPI(virtualPresence),
    )
    return { items: transformedVirtualPresences, nextToken: resultNextToken }
  }

  public async subscribeToVirtualPresence(
    subscriptionId: string,
    subscriber: VirtualPresenceSubscriber,
  ): Promise<void> {
    this.log.debug(this.subscribeToVirtualPresence.name, {
      subscriptionId,
    })
    const useCase = new SubscribeToVirtualPresenceUseCase(
      this.virtualPresenceService,
      this.userClient,
    )
    await useCase.execute({ subscriptionId, subscriber })
  }

  public unsubscribeFromVirtualPresence(subscriptionId: string): void {
    this.log.debug(this.unsubscribeFromVirtualPresence.name, {
      subscriptionId,
    })
    const useCase = new UnsubscribeFromVirtualPresenceUseCase(
      this.virtualPresenceService,
    )
    useCase.execute(subscriptionId)
  }

  public async getDataHolder(id: string): Promise<DataHolder | undefined> {
    this.log.debug(this.getDataHolder.name, { id })
    const useCase = new GetDataHolderUseCase(this.dataHolderService)
    const result = await useCase.execute(id)
    if (!result) {
      return undefined
    }
    return this.dataHolderTransformer.fromEntityToAPI(result)
  }

  public async listDataHolders(
    input: ListDataHoldersInput,
  ): Promise<ListOutput<DataHolder>> {
    this.log.debug(this.listDataHolders.name, { input })
    const useCase = new ListDataHoldersUseCase(this.dataHolderService)
    const { dataHolders, nextToken: resultNextToken } = await useCase.execute({
      virtualPresenceId: input.virtualPresenceId,
      limit: input.limit,
      nextToken: input.nextToken,
    })
    const transformedDataHolders = dataHolders.map((dataHolder) =>
      this.dataHolderTransformer.fromEntityToAPI(dataHolder),
    )
    return { items: transformedDataHolders, nextToken: resultNextToken }
  }

  public async subscribeToDataHolders(
    subscriptionId: string,
    subscriber: DataHolderSubscriber,
  ): Promise<void> {
    this.log.debug(this.subscribeToDataHolders.name, {
      subscriptionId,
    })
    const useCase = new SubscribeToDataHoldersUseCase(
      this.dataHolderService,
      this.userClient,
    )
    await useCase.execute({ subscriptionId, subscriber })
  }

  public unsubscribeFromDataHolders(subscriptionId: string): void {
    this.log.debug(this.unsubscribeFromDataHolders.name, {
      subscriptionId,
    })
    const useCase = new UnsubscribeFromDataHoldersUseCase(
      this.dataHolderService,
    )
    useCase.execute(subscriptionId)
  }

  public async getAnalysisResult(
    id: string,
  ): Promise<AnalysisResult | undefined> {
    this.log.debug(this.getAnalysisResult.name, { id })
    const useCase = new GetAnalysisResultUseCase(this.analysisResultService)
    const result = await useCase.execute(id)
    if (!result) {
      return undefined
    }
    return this.analysisResultTransformer.fromEntityToAPI(result)
  }

  public async listAnalysisResults(
    input: ListAnalysisResultsInput,
  ): Promise<ListOutput<AnalysisResult>> {
    this.log.debug(this.listAnalysisResults.name, { input })
    const useCase = new ListAnalysisResultsUseCase(this.analysisResultService)
    const { analysisResults, nextToken: resultNextToken } =
      await useCase.execute({
        virtualPresenceId: input.virtualPresenceId,
        limit: input.limit,
        nextToken: input.nextToken,
      })
    const transformedAnalysisResults = analysisResults.map((analysisResult) =>
      this.analysisResultTransformer.fromEntityToAPI(analysisResult),
    )
    return { items: transformedAnalysisResults, nextToken: resultNextToken }
  }

  public async subscribeToAnalysisResult(
    subscriptionId: string,
    subscriber: AnalysisResultSubscriber,
  ): Promise<void> {
    this.log.debug(this.subscribeToAnalysisResult.name, {
      subscriptionId,
    })
    const useCase = new SubscribeToAnalysisResultUseCase(
      this.analysisResultService,
      this.userClient,
    )
    await useCase.execute({ subscriptionId, subscriber })
  }

  public unsubscribeFromAnalysisResult(subscriptionId: string): void {
    this.log.debug(this.unsubscribeFromAnalysisResult.name, {
      subscriptionId,
    })
    const useCase = new UnsubscribeFromAnalysisResultUseCase(
      this.analysisResultService,
    )
    useCase.execute(subscriptionId)
  }
}
