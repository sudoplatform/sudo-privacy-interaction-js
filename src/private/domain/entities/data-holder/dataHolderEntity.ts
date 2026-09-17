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

/**
 * Core entity representation of email interaction metrics captured during a
 * single scan for a specific data holder.
 *
 * @interface DataHolderScanSummaryEntity
 * @property {string} dataHolderId The data holder these metrics apply to.
 * @property {string} owner Unique identifier of the user.
 * @property {Date} scannedAt Date for when the scan was performed.
 * @property {Date} scanRangeFrom Start of the scanned time range.
 * @property {Date} scanRangeTo End of the scanned time range.
 * @property {number} emailCount Total number of emails observed in the scan range.
 * @property {number} readCount Number of emails that were read.
 * @property {number} readRate Ratio of read emails to total emails.
 * @property {number} marketingEmailCount Number of marketing emails observed.
 * @property {number} marketingEmailOpened Number of marketing emails that were opened.
 * @property {number} marketingOpenRate Ratio of opened marketing emails to marketing emails.
 * @property {Record<string, number>} categoryBreakdown Count of emails per category.
 * @property {number} uncategorizedCount Number of emails that could not be categorized.
 */
export interface DataHolderScanSummaryEntity {
  dataHolderId: string
  owner: string
  scannedAt: Date
  scanRangeFrom: Date
  scanRangeTo: Date
  emailCount: number
  readCount: number
  readRate: number
  marketingEmailCount: number
  marketingEmailOpened: number
  marketingOpenRate: number
  categoryBreakdown: Record<string, number>
  uncategorizedCount: number
}
