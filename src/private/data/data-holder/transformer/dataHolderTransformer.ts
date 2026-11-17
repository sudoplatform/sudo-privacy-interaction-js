/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataHolder as DataHolderGraphQL } from '../../../../gen/graphqlTypes'
import { DataHolder } from '../../../../public/typings/dataHolder'
import { DataHolderEntity } from '../../../domain/entities/data-holder/dataHolderEntity'
import { DataHolderProtectionStateTransformer } from './dataHolderProtectionStateTransformer'

export class DataHolderTransformer {
  fromGraphQLToEntity(data: DataHolderGraphQL): DataHolderEntity {
    const dataHolderProtectionStateTransformer =
      new DataHolderProtectionStateTransformer()
    const mostRecentInboundContactAt = new Date(
      data.mostRecentInboundContactEpochMs ??
        data.firstInboundContactEpochMs ??
        data.createdAtEpochMs,
    )
    return {
      id: data.id,
      virtualPresenceId: data.virtualPresenceId,
      domainName: data.domainName,
      name: data.name,
      protectionState: dataHolderProtectionStateTransformer.fromGraphQLToEntity(
        data.protectionState,
      ),
      complianceConcern: data.complianceConcern,
      mostRecentInteractionAt: mostRecentInboundContactAt,
      mostRecentInboundContactAt,
      firstInboundContactAt: new Date(
        data.firstInboundContactEpochMs ?? data.createdAtEpochMs,
      ),
      owner: data.owner,
      version: data.version,
      createdAt: new Date(data.createdAtEpochMs),
      updatedAt: new Date(data.updatedAtEpochMs),
    }
  }

  fromEntityToAPI(entity: DataHolderEntity): DataHolder {
    const dataHolderProtectionStateTransformer =
      new DataHolderProtectionStateTransformer()
    return {
      id: entity.id,
      virtualPresenceId: entity.virtualPresenceId,
      domainName: entity.domainName,
      name: entity.name,
      protectionState: dataHolderProtectionStateTransformer.fromEntityToAPI(
        entity.protectionState,
      ),
      complianceConcern: entity.complianceConcern,
      mostRecentInteractionAt: entity.mostRecentInteractionAt,
      mostRecentInboundContactAt: entity.mostRecentInboundContactAt,
      firstInboundContactAt: entity.firstInboundContactAt,
      owner: entity.owner,
      version: entity.version,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}
