/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { VirtualPresence as VirtualPresenceGraphQL } from '../../../../gen/graphqlTypes'
import { VirtualPresence } from '../../../../public/typings/virtualPresence'
import { VirtualPresenceEntity } from '../../../domain/entities/virtual-presence/virtualPresenceEntity'
import { ProviderTypeTransformer } from './providerTypeTransformer'
import { VirtualPresenceStateTransformer } from './virtualPresenceStateTransformer'

export class VirtualPresenceTransformer {
  fromEntityToAPI(entity: VirtualPresenceEntity): VirtualPresence {
    const providerTypeTransformer = new ProviderTypeTransformer()
    const virtualPresenceStateTransformer =
      new VirtualPresenceStateTransformer()
    return {
      id: entity.id,
      owner: entity.owner,
      version: entity.version,
      providerType: providerTypeTransformer.fromEntityToAPI(
        entity.providerType,
      ),
      identifier: entity.identifier,
      state: virtualPresenceStateTransformer.fromEntityToAPI(entity.state),
      lastScannedAt: entity.lastScannedAt,
      lastScanFailureReason: entity.lastScanFailureReason,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  fromGraphQLToEntity(data: VirtualPresenceGraphQL): VirtualPresenceEntity {
    const providerTypeTransformer = new ProviderTypeTransformer()
    const virtualPresenceStateTransformer =
      new VirtualPresenceStateTransformer()
    return {
      id: data.id,
      owner: data.owner,
      version: data.version,
      providerType: providerTypeTransformer.fromGraphQLToEntity(
        data.providerType,
      ),
      identifier: data.identifier,
      state: virtualPresenceStateTransformer.fromGraphQLToEntity(data.state),
      lastScannedAt: new Date(data.lastScannedAtEpochMs),
      lastScanFailureReason: data.lastScanFailureReason ?? undefined,
      createdAt: new Date(data.createdAtEpochMs),
      updatedAt: new Date(data.updatedAtEpochMs),
    }
  }
}
