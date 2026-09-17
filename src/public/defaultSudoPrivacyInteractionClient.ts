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
import { DataHolderScanSummaryTransformer } from '../private/data/data-holder/transformer/dataHolderScanSummaryTransformer'
import { DataHolderTransformer } from '../private/data/data-holder/transformer/dataHolderTransformer'
import { DefaultProviderConfigurationService } from '../private/data/provider-configuration/defaultProviderConfigurationService'
import { ProviderConfigurationTransformer } from '../private/data/provider-configuration/transformer/providerConfigurationTransformer'
import { DefaultOrganizationAnalysisService } from '../private/data/organization-analysis/defaultOrganizationAnalysisService'
import { OrganizationAnalysisModeTransformer } from '../private/data/organization-analysis/transformer/organizationAnalysisModeTransformer'
import { OrganizationAnalysisTransformer } from '../private/data/organization-analysis/transformer/organizationAnalysisTransformer'
import { DefaultVirtualPresenceService } from '../private/data/virtual-presence/defaultVirtualPresenceService'
import { RelationshipProviderTransformer } from '../private/data/virtual-presence/transformer/relationshipProviderTransformer'
import { VirtualPresenceTransformer } from '../private/data/virtual-presence/transformer/virtualPresenceTransformer'
import { GetAnalysisResultUseCase } from '../private/domain/use-cases/analysis-result/getAnalysisResultUseCase'
import { ListAnalysisResultsUseCase } from '../private/domain/use-cases/analysis-result/listAnalysisResultsUseCase'
import { SubscribeToAnalysisResultUseCase } from '../private/domain/use-cases/analysis-result/subscribeToAnalysisResultUseCase'
import { UnsubscribeFromAnalysisResultUseCase } from '../private/domain/use-cases/analysis-result/unsubscribeFromAnalysisResultUseCase'
import { GetProviderConfigurationUseCase } from '../private/domain/use-cases/configuration/getProviderConfigurationUseCase'
import { GetOrganizationAnalysisUseCase } from '../private/domain/use-cases/organization-analysis/getOrganizationAnalysisUseCase'
import { GetDataHolderUseCase } from '../private/domain/use-cases/data-holder/getDataHolderUseCase'
import { ListDataHolderScanSummariesUseCase } from '../private/domain/use-cases/data-holder/listDataHolderScanSummariesUseCase'
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
  ConnectVirtualPresenceWithAuthCodeInput,
  ConnectVirtualPresenceWithRefreshTokenInput,
  GetDataHolderOptions,
  GetOrganizationAnalysisInput,
  ListAnalysisResultsInput,
  ListDataHolderScanSummariesInput,
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
  DataHolderScanSummary,
  DataHolderSubscriber,
  OrganizationAnalysis,
  ProviderConfiguration,
  VirtualPresence,
  VirtualPresenceSubscriber,
} from './typings'

export class DefaultSudoPrivacyInteractionClient implements SudoPrivacyInteractionClient {
  private readonly apiClient: ApiClient
  private readonly userClient: SudoUserClient
  private readonly providerConfigurationService: DefaultProviderConfigurationService
  private readonly virtualPresenceService: DefaultVirtualPresenceService
  private readonly dataHolderService: DefaultDataHolderService
  private readonly analysisResultService: DefaultAnalysisResultService
  private readonly organizationAnalysisService: DefaultOrganizationAnalysisService
  private readonly providerConfigurationTransformer: ProviderConfigurationTransformer
  private readonly virtualPresenceTransformer: VirtualPresenceTransformer
  private readonly relationshipProviderTransformer: RelationshipProviderTransformer
  private readonly dataHolderTransformer: DataHolderTransformer
  private readonly dataHolderScanSummaryTransformer: DataHolderScanSummaryTransformer
  private readonly analysisResultTransformer: AnalysisResultTransformer
  private readonly organizationAnalysisTransformer: OrganizationAnalysisTransformer
  private readonly organizationAnalysisModeTransformer: OrganizationAnalysisModeTransformer
  private readonly log: Logger

  public constructor(opts: SudoPrivacyInteractionClientOptions) {
    this.log = new DefaultLogger(this.constructor.name)

    const privateOptions = opts as PrivateSudoPrivacyInteractionClientOptions

    this.apiClient = privateOptions.apiClient ?? new ApiClient()
    this.userClient = opts.sudoUserClient

    this.providerConfigurationService = new DefaultProviderConfigurationService(
      this.apiClient,
    )
    this.virtualPresenceService = new DefaultVirtualPresenceService(
      this.apiClient,
    )
    this.dataHolderService = new DefaultDataHolderService(this.apiClient)
    this.analysisResultService = new DefaultAnalysisResultService(
      this.apiClient,
    )
    this.organizationAnalysisService = new DefaultOrganizationAnalysisService(
      this.apiClient,
    )

    this.providerConfigurationTransformer =
      new ProviderConfigurationTransformer()
    this.virtualPresenceTransformer = new VirtualPresenceTransformer()
    this.relationshipProviderTransformer = new RelationshipProviderTransformer()
    this.dataHolderTransformer = new DataHolderTransformer()
    this.dataHolderScanSummaryTransformer =
      new DataHolderScanSummaryTransformer()
    this.analysisResultTransformer = new AnalysisResultTransformer()
    this.organizationAnalysisTransformer = new OrganizationAnalysisTransformer()
    this.organizationAnalysisModeTransformer =
      new OrganizationAnalysisModeTransformer()
  }

  public async getProviderConfiguration(): Promise<ProviderConfiguration[]> {
    this.log.debug(this.getProviderConfiguration.name)
    const useCase = new GetProviderConfigurationUseCase(
      this.providerConfigurationService,
    )
    const result = await useCase.execute()
    return result.map((entity) =>
      this.providerConfigurationTransformer.fromEntityToAPI(entity),
    )
  }

  public async connectVirtualPresenceWithAuthCode(
    input: ConnectVirtualPresenceWithAuthCodeInput,
  ): Promise<VirtualPresence> {
    this.log.debug(this.connectVirtualPresenceWithAuthCode.name)
    const useCase = new ConnectVirtualPresenceWithAuthCodeUseCase(
      this.virtualPresenceService,
    )
    const result = await useCase.execute({
      authCode: input.authCode,
      redirectUri: input.redirectUri,
      relationshipProvider: input.relationshipProvider
        ? this.relationshipProviderTransformer.fromAPIToEntity(
            input.relationshipProvider,
          )
        : undefined,
    })
    return this.virtualPresenceTransformer.fromEntityToAPI(result)
  }

  public async connectVirtualPresenceWithRefreshToken(
    input: ConnectVirtualPresenceWithRefreshTokenInput,
  ): Promise<VirtualPresence> {
    this.log.debug(this.connectVirtualPresenceWithRefreshToken.name)
    const useCase = new ConnectVirtualPresenceWithRefreshTokenUseCase(
      this.virtualPresenceService,
    )
    const result = await useCase.execute({
      refreshToken: input.refreshToken,
      providerIdentity: input.providerIdentity,
      scopes: input.scopes,
      expiresInEpochMs: input.expiresInEpochMs,
      relationshipProvider: input.relationshipProvider
        ? this.relationshipProviderTransformer.fromAPIToEntity(
            input.relationshipProvider,
          )
        : undefined,
    })
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

  public async getDataHolder(
    id: string,
    options?: GetDataHolderOptions,
  ): Promise<DataHolder | undefined> {
    this.log.debug(this.getDataHolder.name, { id, options })
    const includeScanSummary = options?.includeScanSummary ?? true

    const getDataHolderUseCase = new GetDataHolderUseCase(
      this.dataHolderService,
    )

    // Fetch the data holder and (optionally) its latest scan summary concurrently
    // to minimise latency. The scan summary is a best-effort convenience: if it
    // fails, the data holder is still returned without a `latestScanSummary`.
    const [dataHolderOutcome, scanSummariesOutcome] = await Promise.allSettled([
      getDataHolderUseCase.execute(id),
      includeScanSummary
        ? new ListDataHolderScanSummariesUseCase(
            this.dataHolderService,
          ).execute({ dataHolderId: id, limit: 1 })
        : Promise.resolve(undefined),
    ])

    // The data holder is the primary result; propagate its error to the caller.
    if (dataHolderOutcome.status === 'rejected') {
      throw dataHolderOutcome.reason
    }
    const dataHolderResult = dataHolderOutcome.value
    if (!dataHolderResult) {
      return undefined
    }

    const dataHolder =
      this.dataHolderTransformer.fromEntityToAPI(dataHolderResult)

    if (scanSummariesOutcome.status === 'fulfilled') {
      const latestScanSummaryEntity =
        scanSummariesOutcome.value?.scanSummaries[0]
      if (latestScanSummaryEntity) {
        dataHolder.latestScanSummary =
          this.dataHolderScanSummaryTransformer.fromEntityToAPI(
            latestScanSummaryEntity,
          )
      }
    } else {
      this.log.error('Failed to fetch latest scan summary for data holder', {
        id,
        error: scanSummariesOutcome.reason,
      })
    }

    return dataHolder
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

  public async listDataHolderScanSummaries(
    input: ListDataHolderScanSummariesInput,
  ): Promise<ListOutput<DataHolderScanSummary>> {
    this.log.debug(this.listDataHolderScanSummaries.name, { input })
    const useCase = new ListDataHolderScanSummariesUseCase(
      this.dataHolderService,
    )
    const { scanSummaries, nextToken: resultNextToken } = await useCase.execute(
      {
        dataHolderId: input.dataHolderId,
        limit: input.limit,
        nextToken: input.nextToken,
      },
    )
    const transformedScanSummaries = scanSummaries.map((scanSummary) =>
      this.dataHolderScanSummaryTransformer.fromEntityToAPI(scanSummary),
    )
    return { items: transformedScanSummaries, nextToken: resultNextToken }
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

  public async getOrganizationAnalysis(
    input: GetOrganizationAnalysisInput,
  ): Promise<OrganizationAnalysis | undefined> {
    this.log.debug(this.getOrganizationAnalysis.name, { input })
    const useCase = new GetOrganizationAnalysisUseCase(
      this.organizationAnalysisService,
    )
    const result = await useCase.execute({
      domain: input.domain,
      mode: input.mode
        ? this.organizationAnalysisModeTransformer.fromAPIToEntity(input.mode)
        : undefined,
    })
    if (!result) {
      return undefined
    }
    return this.organizationAnalysisTransformer.fromEntityToAPI(result)
  }
}
