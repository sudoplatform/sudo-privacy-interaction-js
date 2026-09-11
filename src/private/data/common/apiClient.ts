/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { GraphQLOptions } from '@aws-amplify/api-graphql'
import {
  ApiClientManager,
  DefaultApiClientManager,
} from '@sudoplatform/sudo-api-client'
import {
  DefaultLogger,
  FatalError,
  GraphQLNetworkError,
  Logger,
  UnknownGraphQLError,
  isGraphQLNetworkError,
  mapNetworkErrorToClientError,
} from '@sudoplatform/sudo-common'
import { GraphQLClient } from '@sudoplatform/sudo-user'
import Observable from 'zen-observable'
import {
  AnalysisResult,
  AnalysisResultConnection,
  ConnectVirtualPresenceDocument,
  ConnectVirtualPresenceInput,
  ConnectVirtualPresenceMutation,
  ConnectVirtualPresenceMutationVariables,
  DataHolder,
  DataHolderConnection,
  DisconnectVirtualPresenceDocument,
  DisconnectVirtualPresenceMutation,
  DisconnectVirtualPresenceMutationVariables,
  GetAnalysisResultDocument,
  GetAnalysisResultQuery,
  GetAnalysisResultQueryVariables,
  GetDataHolderDocument,
  GetDataHolderQuery,
  GetDataHolderQueryVariables,
  GetProviderConfigurationDocument,
  GetProviderConfigurationQuery,
  GetProviderConfigurationQueryVariables,
  ProviderConfiguration,
  ListAnalysisResultsDocument,
  ListAnalysisResultsQuery,
  ListAnalysisResultsQueryVariables,
  ListDataHoldersDocument,
  ListDataHoldersQuery,
  ListDataHoldersQueryVariables,
  ListVirtualPresencesDocument,
  ListVirtualPresencesInput,
  ListVirtualPresencesQuery,
  ListVirtualPresencesQueryVariables,
  OnAnalysisResultUpdateDocument,
  OnAnalysisResultUpdateSubscription,
  OnAnalysisResultUpdateSubscriptionVariables,
  OnDataHoldersUpdateDocument,
  OnDataHoldersUpdateSubscription,
  OnDataHoldersUpdateSubscriptionVariables,
  OnVirtualPresenceUpdateDocument,
  OnVirtualPresenceUpdateSubscription,
  OnVirtualPresenceUpdateSubscriptionVariables,
  RescanVirtualPresenceDocument,
  RescanVirtualPresenceMutation,
  RescanVirtualPresenceMutationVariables,
  ScanOptionsInput,
  VirtualPresence,
  VirtualPresenceConnection,
} from '../../../gen/graphqlTypes'
import { SubscriptionResult } from './baseSubscriptionManager'
import { ErrorTransformer } from './transformer/errorTransformer'

export class ApiClient {
  private readonly log: Logger
  private readonly client: GraphQLClient

  private readonly graphqlErrorTransformer: ErrorTransformer

  public constructor(apiClientManager?: ApiClientManager) {
    this.log = new DefaultLogger(this.constructor.name)
    this.graphqlErrorTransformer = new ErrorTransformer()
    const clientManager =
      apiClientManager ?? DefaultApiClientManager.getInstance()
    this.client = clientManager.getClient({
      configNamespace: 'pimService',
    })
  }

  public async connectVirtualPresence(
    input: ConnectVirtualPresenceInput,
  ): Promise<VirtualPresence> {
    const data = await this.performMutation<ConnectVirtualPresenceMutation>({
      mutation: ConnectVirtualPresenceDocument,
      variables: { input } as ConnectVirtualPresenceMutationVariables,
      calleeName: this.connectVirtualPresence.name,
    })
    return data.connectVirtualPresence
  }

  public async disconnectVirtualPresence(id: string): Promise<VirtualPresence> {
    const data = await this.performMutation<DisconnectVirtualPresenceMutation>({
      mutation: DisconnectVirtualPresenceDocument,
      variables: { id } as DisconnectVirtualPresenceMutationVariables,
      calleeName: this.disconnectVirtualPresence.name,
    })
    return data.disconnectVirtualPresence
  }

  public async rescanVirtualPresence(
    id: string,
    options?: ScanOptionsInput,
  ): Promise<VirtualPresence> {
    const data = await this.performMutation<RescanVirtualPresenceMutation>({
      mutation: RescanVirtualPresenceDocument,
      variables: { id, options } as RescanVirtualPresenceMutationVariables,
      calleeName: this.rescanVirtualPresence.name,
    })
    return data.rescanVirtualPresence
  }

  public async listVirtualPresences(
    input: ListVirtualPresencesInput,
  ): Promise<VirtualPresenceConnection> {
    const data = await this.performQuery<ListVirtualPresencesQuery>({
      query: ListVirtualPresencesDocument,
      variables: { input } as ListVirtualPresencesQueryVariables,
      calleeName: this.listVirtualPresences.name,
    })
    return data.listVirtualPresences
  }

  public async getProviderConfiguration(): Promise<ProviderConfiguration> {
    const data = await this.performQuery<GetProviderConfigurationQuery>({
      query: GetProviderConfigurationDocument,
      variables: {} as GetProviderConfigurationQueryVariables,
      calleeName: this.getProviderConfiguration.name,
    })
    return data.getProviderConfiguration
  }

  public async getDataHolder(id: string): Promise<DataHolder | undefined> {
    const data = await this.performQuery<GetDataHolderQuery>({
      query: GetDataHolderDocument,
      variables: { id } as GetDataHolderQueryVariables,
      calleeName: this.getDataHolder.name,
    })
    return data.getDataHolder ?? undefined
  }

  public async listDataHolders(input: {
    virtualPresenceId: string
    limit?: number
    nextToken?: string
  }): Promise<DataHolderConnection> {
    const data = await this.performQuery<ListDataHoldersQuery>({
      query: ListDataHoldersDocument,
      variables: {
        virtualPresenceId: input.virtualPresenceId,
        limit: input.limit,
        nextToken: input.nextToken,
      } as ListDataHoldersQueryVariables,
      calleeName: this.listDataHolders.name,
    })
    return data.listDataHolders
  }

  public async getAnalysisResult(
    id: string,
  ): Promise<AnalysisResult | undefined> {
    const data = await this.performQuery<GetAnalysisResultQuery>({
      query: GetAnalysisResultDocument,
      variables: { id } as GetAnalysisResultQueryVariables,
      calleeName: this.getAnalysisResult.name,
    })
    return data.getAnalysisResult ?? undefined
  }

  public async listAnalysisResults(input: {
    virtualPresenceId: string
    limit?: number
    nextToken?: string
  }): Promise<AnalysisResultConnection> {
    const data = await this.performQuery<ListAnalysisResultsQuery>({
      query: ListAnalysisResultsDocument,
      variables: {
        virtualPresenceId: input.virtualPresenceId,
        limit: input.limit,
        nextToken: input.nextToken,
      } as ListAnalysisResultsQueryVariables,
      calleeName: this.listAnalysisResults.name,
    })
    return data.listAnalysisResults
  }

  public onVirtualPresenceUpdated(
    owner: string,
  ): Promise<
    Observable<SubscriptionResult<OnVirtualPresenceUpdateSubscription>>
  > {
    return this.performSubscription<OnVirtualPresenceUpdateSubscription>({
      subscription: OnVirtualPresenceUpdateDocument,
      variables: {
        owner,
      } as OnVirtualPresenceUpdateSubscriptionVariables,
      calleeName: this.onVirtualPresenceUpdated.name,
    })
  }

  public onDataHoldersUpdated(
    owner: string,
  ): Promise<Observable<SubscriptionResult<OnDataHoldersUpdateSubscription>>> {
    return this.performSubscription<OnDataHoldersUpdateSubscription>({
      subscription: OnDataHoldersUpdateDocument,
      variables: {
        owner,
      } as OnDataHoldersUpdateSubscriptionVariables,
      calleeName: this.onDataHoldersUpdated.name,
    })
  }

  public onAnalysisResultUpdated(
    owner: string,
  ): Promise<
    Observable<SubscriptionResult<OnAnalysisResultUpdateSubscription>>
  > {
    return this.performSubscription<OnAnalysisResultUpdateSubscription>({
      subscription: OnAnalysisResultUpdateDocument,
      variables: {
        owner,
      } as OnAnalysisResultUpdateSubscriptionVariables,
      calleeName: this.onAnalysisResultUpdated.name,
    })
  }

  private async performQuery<Q>({
    variables,
    query,
    calleeName,
  }: GraphQLOptions & { calleeName?: string }): Promise<Q> {
    let result
    try {
      result = await this.client.query<Q>({
        variables,
        query,
      })
    } catch (err) {
      if (isGraphQLNetworkError(err as Error)) {
        throw mapNetworkErrorToClientError(err as GraphQLNetworkError)
      }
      throw this.mapGraphQLCallError(err as Error)
    }

    const error = result.errors?.[0]
    if (error) {
      this.log.debug('appsync query failed with error', { error })
      throw this.graphqlErrorTransformer.toClientError(error)
    }
    if (result.data) {
      return result.data
    } else {
      throw new FatalError(
        `${calleeName ?? '<no callee>'} did not return any result`,
      )
    }
  }

  private async performMutation<M>({
    mutation,
    variables,
    calleeName,
  }: Omit<GraphQLOptions, 'query'> & {
    mutation: GraphQLOptions['query']
    calleeName?: string
  }): Promise<M> {
    let result
    try {
      result = await this.client.mutate<M>({
        mutation,
        variables,
      })
    } catch (err) {
      if (isGraphQLNetworkError(err as Error)) {
        throw mapNetworkErrorToClientError(err as GraphQLNetworkError)
      }
      throw this.mapGraphQLCallError(err as Error)
    }
    const error = result.errors?.[0]
    if (error) {
      this.log.debug('appSync mutation failed with error', { error })
      throw this.graphqlErrorTransformer.toClientError(error)
    }
    if (result.data) {
      return result.data
    } else {
      throw new FatalError(
        `${calleeName ?? '<no callee>'} did not return any result`,
      )
    }
  }

  private performSubscription<S>({
    subscription,
    variables,
    calleeName,
  }: Omit<GraphQLOptions, 'query'> & {
    subscription: GraphQLOptions['query']
    calleeName?: string
  }): Promise<Observable<SubscriptionResult<S>>> {
    try {
      return this.client.subscribe<S>({
        subscription,
        variables,
      })
    } catch (err) {
      if (isGraphQLNetworkError(err as Error)) {
        throw mapNetworkErrorToClientError(err as GraphQLNetworkError)
      }
      this.log.debug('appSync subscription failed with error', {
        error: err as Error,
        calleeName,
      })
      throw this.mapGraphQLCallError(err as Error)
    }
  }

  mapGraphQLCallError = (err: Error): Error => {
    if ('graphQLErrors' in err && Array.isArray(err.graphQLErrors)) {
      const error = err.graphQLErrors[0] as {
        errorType: string
        message: string
        name: string
      }
      if (error) {
        this.log.debug('appSync operation failed with error', { err })
        return this.graphqlErrorTransformer.toClientError(error)
      }
    }
    if ('errorType' in err) {
      this.log.debug('appSync operation failed with error', { err })
      return this.graphqlErrorTransformer.toClientError(
        err as { errorType: string; message: string; errorInfo?: string },
      )
    }
    return new UnknownGraphQLError(err)
  }
}
