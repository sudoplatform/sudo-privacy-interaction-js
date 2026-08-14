/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Core entity representation of a data holder.
 *
 * A data holder is an organization that holds data associated with a user's virtual presence.
 *
 * @interface DataHolderEntity
 * @property {string} id Unique identifier associated with the data holder.
 * @property {string} virtualPresenceId The virtual presence this data holder is associated with.
 * @property {string} domainName Domain name of the data holder.
 * @property {string} name Display name of the data holder.
 * @property {DataHolderProtectionStateEntity} protectionState Current protection state.
 * @property {boolean} complianceConcern Whether there is a compliance concern.
 * @property {Date} mostRecentInteractionAt Date of the most recent interaction.
 * @property {string} owner Unique identifier of the user.
 * @property {number} version Version of this entity. Increments on update.
 * @property {Date} createdAt Date for when the data holder was created.
 * @property {Date} updatedAt Date for when the data holder was last updated.
 */
export interface DataHolderEntity {
  id: string
  virtualPresenceId: string
  domainName: string
  name: string
  protectionState: DataHolderProtectionStateEntity
  complianceConcern: boolean
  mostRecentInteractionAt: Date
  owner: string
  version: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Enumeration that defines the protection state of a data holder.
 *
 * @property MONITORED The data holder is being monitored.
 * @property ACTION_REQUESTED An action has been requested against this data holder.
 * @property RESOLVED The data holder has been resolved.
 *
 * @enum
 */
export enum DataHolderProtectionStateEntity {
  Monitored = 'MONITORED',
  ActionRequested = 'ACTION_REQUESTED',
  Resolved = 'RESOLVED',
  Unknown = 'UNKNOWN',
}
