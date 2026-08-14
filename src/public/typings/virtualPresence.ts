/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The Sudo Platform SDK representation of a virtual presence.
 *
 * A virtual presence is a user's identity on an external platform.
 *
 * @interface VirtualPresence
 * @property {string} id Unique identifier associated with the virtual presence.
 * @property {string} owner Unique identifier of the user associated with the virtual presence.
 * @property {number} version Version of this entity. Increments on update.
 * @property {ProviderType} providerType The provider type for this virtual presence.
 * @property {string} identifier The presence identifier (e.g. email address).
 * @property {VirtualPresenceState} state The current state of the virtual presence.
 * @property {Date} lastScannedAt Date for when the virtual presence was last scanned.
 * @property {Date} createdAt Date for when the virtual presence was created.
 * @property {Date} updatedAt Date for when the virtual presence was last updated.
 */
export interface VirtualPresence {
  id: string
  owner: string
  version: number
  providerType: ProviderType
  identifier: string
  state: VirtualPresenceState
  lastScannedAt: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Enumeration that defines the provider type of the virtual presence.
 * 
 * @enum
 */
export enum ProviderType {
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
export enum VirtualPresenceState {
  Connected = 'CONNECTED',
  Scanning = 'SCANNING',
  NeedsReauth = 'NEEDS_REAUTH',
  Error = 'ERROR',
  Inactive = 'INACTIVE',
  Unknown = 'UNKNOWN',
}
