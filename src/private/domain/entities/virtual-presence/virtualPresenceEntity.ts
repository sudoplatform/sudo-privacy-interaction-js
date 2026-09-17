/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Core entity representation of a virtual presence business rule.
 *
 * A virtual presence is a user's identity on an external platform.
 *
 * @interface VirtualPresenceEntity
 * @property {string} id Unique identifier associated with the virtual presence.
 * @property {string} owner Unique identifier of the user associated with the virtual presence.
 * @property {number} version Version of this entity. Increments on update.
 * @property {ProviderTypeEntity} providerType The provider type for this virtual presence.
 * @property {string} identifier The presence identifier (e.g. email address).
 * @property {VirtualPresenceStateEntity} state The current state of the virtual presence.
 * @property {Date} lastScannedAt Date for when the virtual presence was last scanned.
 * @property {string} lastScanFailureReason Reason the most recent completed scan failed (an error/exception name).
 *  Undefined when the most recent completed scan succeeded (or none has completed).
 * @property {Date} createdAt Date for when the virtual presence was created.
 * @property {Date} updatedAt Date for when the virtual presence was last updated.
 */
export interface VirtualPresenceEntity {
  id: string
  owner: string
  version: number
  providerType: ProviderTypeEntity
  identifier: string
  state: VirtualPresenceStateEntity
  lastScannedAt: Date
  lastScanFailureReason?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Enumeration that defines the provider type of the virtual presence.
 *
 * @enum
 */
export enum ProviderTypeEntity {
  Email = 'EMAIL',
  Unknown = 'UNKNOWN',
}

/**
 * Enumeration that defines the possible states of a virtual presence.
 *
 * @property CONNECTED: The virtual presence is active and connected to the provider.
 * @property SCANNING: The virtual presence is currently being scanned.
 * @property NEEDS_REAUTH: The virtual presence requires re-authentication with the provider.
 * @property ERROR: The virtual presence encountered an error and is in a failed state.
 * @property INACTIVE: The virtual presence is no longer active.
 *
 * @enum
 */
export enum VirtualPresenceStateEntity {
  Connected = 'CONNECTED',
  Scanning = 'SCANNING',
  NeedsReauth = 'NEEDS_REAUTH',
  Error = 'ERROR',
  Inactive = 'INACTIVE',
  Unknown = 'UNKNOWN',
}
