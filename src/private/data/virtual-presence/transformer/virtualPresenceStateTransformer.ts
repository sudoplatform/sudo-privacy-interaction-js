/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { VirtualPresenceState as VirtualPresenceStateGraphQL } from '../../../../gen/graphqlTypes'
import { VirtualPresenceState } from '../../../../public/typings/virtualPresence'
import { VirtualPresenceStateEntity } from '../../../domain/entities/virtual-presence/virtualPresenceEntity'

export class VirtualPresenceStateTransformer {
  fromEntityToAPI(entity: VirtualPresenceStateEntity): VirtualPresenceState {
    switch (entity) {
      case VirtualPresenceStateEntity.Connected:
        return VirtualPresenceState.Connected
      case VirtualPresenceStateEntity.Scanning:
        return VirtualPresenceState.Scanning
      case VirtualPresenceStateEntity.NeedsReauth:
        return VirtualPresenceState.NeedsReauth
      case VirtualPresenceStateEntity.Inactive:
        return VirtualPresenceState.Inactive
      case VirtualPresenceStateEntity.Error:
        return VirtualPresenceState.Error
      case VirtualPresenceStateEntity.Unknown:
        return VirtualPresenceState.Unknown
    }
  }

  fromGraphQLToEntity(
    data: VirtualPresenceStateGraphQL,
  ): VirtualPresenceStateEntity {
    switch (data) {
      case 'CONNECTED':
        return VirtualPresenceStateEntity.Connected
      case 'SCANNING':
        return VirtualPresenceStateEntity.Scanning
      case 'NEEDS_REAUTH':
        return VirtualPresenceStateEntity.NeedsReauth
      case 'INACTIVE':
        return VirtualPresenceStateEntity.Inactive
      case 'ERROR':
        return VirtualPresenceStateEntity.Error
      default:
        return VirtualPresenceStateEntity.Unknown
    }
  }
}
