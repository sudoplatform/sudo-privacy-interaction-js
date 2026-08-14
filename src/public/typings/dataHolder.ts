/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The Sudo Platform SDK representation of a data holder.
 *
 * A data holder is an organization that holds data associated with a user's virtual presence.
 *
 * @interface DataHolder
 * @property {string} id Unique identifier associated with the data holder.
 * @property {string} owner Unique identifier of the user.
 * @property {string} virtualPresenceId The virtual presence this data holder is associated with.
 * @property {string} domainName Domain name of the data holder.
 * @property {string} name Display name of the data holder.
 * @property {DataHolderProtectionState} protectionState Current protection state.
 * @property {boolean} complianceConcern Whether there is a compliance concern.
 * @property {Date} mostRecentInteractionAt Date of the most recent interaction.
 * @property {number} version Version of this entity. Increments on update.
 * @property {Date} createdAt Date for when the data holder was created.
 * @property {Date} updatedAt Date for when the data holder was last updated.
 */
export interface DataHolder {
  id: string
  owner: string
  virtualPresenceId: string
  domainName: string
  name: string
  protectionState: DataHolderProtectionState
  complianceConcern: boolean
  mostRecentInteractionAt: Date
  version: number
  createdAt: Date
  updatedAt: Date
}

/**
 * The protection state of a data holder.
 *
 * @property MONITORED The data holder is being monitored.
 * @property ACTION_REQUESTED An action has been requested against this data holder.
 * @property RESOLVED The data holder has been resolved.
 *
 * @enum
 */
export enum DataHolderProtectionState {
  Monitored = 'MONITORED',
  ActionRequested = 'ACTION_REQUESTED',
  Resolved = 'RESOLVED',
  Unknown = 'UNKNOWN',
}
