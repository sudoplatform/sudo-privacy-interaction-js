/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResultUpdate } from './analysisResult'
import { DataHolder } from './dataHolder'
import { VirtualPresence } from './virtualPresence'

/**
 * The connection state of a subscription.
 *
 * @property Connected The subscription is actively connected and receiving updates.
 * @property Disconnected The subscription is not connected.
 *
 * @enum
 */
export enum ConnectionState {
  Connected = 'CONNECTED',
  Disconnected = 'DISCONNECTED',
}

/**
 * Subscriber interface for receiving virtual presence events.
 *
 * @interface VirtualPresenceSubscriber
 */
export interface VirtualPresenceSubscriber {
  /**
   * Notifies the subscriber of an updated virtual presence.
   *
   * @param {VirtualPresence} virtualPresence The updated virtual presence.
   */
  virtualPresenceUpdated(virtualPresence: VirtualPresence): void

  /**
   * Notifies the subscriber that the subscription connection state has changed.
   * The subscriber won't be notified of virtual presence changes until the connection
   * status changes to `ConnectionState.CONNECTED`. The subscriber will stop receiving
   * virtual presence change notifications when the connection state changes to `ConnectionState.DISCONNECTED`.
   *
   * @param state The connection state.
   */
  connectionStatusChanged(state: ConnectionState): void
}

/**
 * Subscriber interface for receiving data holder events.
 *
 * @interface DataHolderSubscriber
 */
export interface DataHolderSubscriber {
  /**
   * Notifies the subscriber of a batch of data holder updates.
   *
   * @param {DataHolder[]} dataHolders The batch of updated data holders.
   */
  dataHoldersUpdated(dataHolders: DataHolder[]): void

  /**
   * Notifies the subscriber that the subscription connection state has changed.
   * The subscriber won't be notified of data holder changes until the connection
   * status changes to `ConnectionState.CONNECTED`. The subscriber will stop receiving
   * data holder change notifications when the connection state changes to `ConnectionState.DISCONNECTED`.
   *
   * @param state The connection state.
   */
  connectionStatusChanged(state: ConnectionState): void
}

/**
 * Subscriber interface for receiving analysis result update events.
 *
 * @interface AnalysisResultSubscriber
 */
export interface AnalysisResultSubscriber {
  /**
   * Notifies the subscriber of an analysis result update.
   *
   * @param {AnalysisResultUpdate} update The analysis result update notification.
   */
  analysisResultUpdated(update: AnalysisResultUpdate): void

  /**
   * Notifies the subscriber that the subscription connection state has changed.
   * The subscriber won't be notified of analysis result changes until the connection
   * status changes to `ConnectionState.CONNECTED`. The subscriber will stop receiving
   * analysis result change notifications when the connection state changes to `ConnectionState.DISCONNECTED`.
   *
   * @param state The connection state.
   */
  connectionStatusChanged(state: ConnectionState): void
}
