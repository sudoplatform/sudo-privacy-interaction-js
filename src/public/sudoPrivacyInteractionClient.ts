/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ListOutput } from '@sudoplatform/sudo-common'
import { SudoUserClient } from '@sudoplatform/sudo-user'
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

export interface SudoPrivacyInteractionClient {
  /**
   * Retrieve the provider configurations required by consumers to support
   * the provider OAuth flow.
   *
   * @returns {ProviderConfiguration[]} The provider configurations.
   */
  getProviderConfiguration(): Promise<ProviderConfiguration[]>

  /**
   * Connect a virtual presence using an authorization code obtained from an OAuth flow.
   *
   * @param {ConnectVirtualPresenceWithAuthCodeInput} input The authorization code input.
   * @returns {VirtualPresence} The connected virtual presence.
   */
  connectVirtualPresenceWithAuthCode(
    input: ConnectVirtualPresenceWithAuthCodeInput,
  ): Promise<VirtualPresence>

  /**
   * Connect a virtual presence using a pre-obtained refresh token credential.
   *
   * @param {ConnectVirtualPresenceWithRefreshTokenInput} input The refresh token input.
   * @returns {VirtualPresence} The connected virtual presence.
   */
  connectVirtualPresenceWithRefreshToken(
    input: ConnectVirtualPresenceWithRefreshTokenInput,
  ): Promise<VirtualPresence>

  /**
   * Disconnect a virtual presence.
   *
   * @param {string} id The unique identifier of the virtual presence to disconnect.
   * @returns {VirtualPresence} The disconnected virtual presence.
   */
  disconnectVirtualPresence(id: string): Promise<VirtualPresence>

  /**
   * Rescan a virtual presence.
   *
   * @param {RescanVirtualPresenceInput} input Parameters used to rescan a virtual presence.
   * @returns {VirtualPresence} The rescanned virtual presence.
   */
  rescanVirtualPresence(
    input: RescanVirtualPresenceInput,
  ): Promise<VirtualPresence>

  /**
   * List all virtual presences for the signed in user.
   *
   * @param {ListVirtualPresencesInput} input Parameters used to retrieve a list of virtual presences.
   * @returns {ListOutput<VirtualPresence>} A list of all virtual presences matching the search criteria.
   */
  listVirtualPresences(
    input: ListVirtualPresencesInput,
  ): Promise<ListOutput<VirtualPresence>>

  /**
   * Subscribe to virtual presence state events. Emitted when a virtual presence changes
   * state (e.g. to NEEDS_REAUTH or SCANNING).
   *
   * @param {string} subscriptionId A unique identifier for this subscription.
   * @param {VirtualPresenceSubscriber} subscriber Callback implementation to be invoked when
   *  a virtual presence event occurs.
   */
  subscribeToVirtualPresence(
    subscriptionId: string,
    subscriber: VirtualPresenceSubscriber,
  ): Promise<void>

  /**
   * Unsubscribe from virtual presence state events.
   *
   * @param {string} subscriptionId The subscription identifier to unsubscribe.
   */
  unsubscribeFromVirtualPresence(subscriptionId: string): void

  /**
   * Retrieve a single data holder by ID.
   *
   * @param {string} id The unique identifier of the data holder.
   * @param {GetDataHolderOptions} options Optional settings controlling what is returned.
   *  By default the most recent scan summary is fetched concurrently and attached as
   *  `latestScanSummary`.
   * @returns {DataHolder | undefined} The data holder, or undefined if not found.
   */
  getDataHolder(
    id: string,
    options?: GetDataHolderOptions,
  ): Promise<DataHolder | undefined>

  /**
   * List data holders associated with a virtual presence.
   *
   * @param {ListDataHoldersInput} input Parameters used to retrieve a list of data holders.
   * @returns {ListOutput<DataHolder>} A list of data holders matching the search criteria.
   */
  listDataHolders(input: ListDataHoldersInput): Promise<ListOutput<DataHolder>>

  /**
   * List scan summaries associated with a data holder, most recent first.
   *
   * @param {ListDataHolderScanSummariesInput} input Parameters used to retrieve a list
   *  of scan summaries.
   * @returns {ListOutput<DataHolderScanSummary>} A list of scan summaries matching the
   *  search criteria.
   */
  listDataHolderScanSummaries(
    input: ListDataHolderScanSummariesInput,
  ): Promise<ListOutput<DataHolderScanSummary>>

  /**
   * Subscribe to data holder state events. Emitted when data holders are discovered
   * or updated during scanning.
   *
   * @param {string} subscriptionId A unique identifier for this subscription.
   * @param {DataHolderSubscriber} subscriber Callback implementation to be invoked when
   *  data holder events occur.
   */
  subscribeToDataHolders(
    subscriptionId: string,
    subscriber: DataHolderSubscriber,
  ): Promise<void>

  /**
   * Unsubscribe from data holder state events.
   *
   * @param {string} subscriptionId The subscription identifier to unsubscribe.
   */
  unsubscribeFromDataHolders(subscriptionId: string): void

  /**
   * Retrieve a full analysis result by ID.
   *
   * @param {string} id The unique identifier of the analysis result.
   * @returns {AnalysisResult | undefined} The analysis result, or undefined if not found.
   */
  getAnalysisResult(id: string): Promise<AnalysisResult | undefined>

  /**
   * List analysis results associated with a virtual presence.
   *
   * @param {ListAnalysisResultsInput} input Parameters used to retrieve a list of analysis results.
   * @returns {ListOutput<AnalysisResult>} A list of analysis results matching the search criteria.
   */
  listAnalysisResults(
    input: ListAnalysisResultsInput,
  ): Promise<ListOutput<AnalysisResult>>

  /**
   * Subscribe to analysis result state events. Emitted when an analysis result
   * changes status or is updated.
   *
   * @param {string} subscriptionId A unique identifier for this subscription.
   * @param {AnalysisResultSubscriber} subscriber Callback implementation to be invoked when
   *  an analysis result event occurs.
   */
  subscribeToAnalysisResult(
    subscriptionId: string,
    subscriber: AnalysisResultSubscriber,
  ): Promise<void>

  /**
   * Unsubscribe from analysis result state events.
   *
   * @param {string} subscriptionId The subscription identifier to unsubscribe.
   */
  unsubscribeFromAnalysisResult(subscriptionId: string): void

  /**
   * Analyze (read-through) and return the shared, organization-generic analysis for a domain.
   *
   * Returns a result with a `Pending` status when an asynchronous source is still resolving;
   * re-query for the terminal result. When `mode` is omitted, the backend behaves as `Analyze`.
   *
   * @param {GetOrganizationAnalysisInput} input Parameters used to obtain the analysis.
   * @returns {OrganizationAnalysis | undefined} The organization analysis, or undefined if not found.
   */
  getOrganizationAnalysis(
    input: GetOrganizationAnalysisInput,
  ): Promise<OrganizationAnalysis | undefined>
}

export type SudoPrivacyInteractionClientOptions = {
  /** Sudo User client to use. No default */
  sudoUserClient: SudoUserClient
}
