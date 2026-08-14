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
    return {
      id: data.id,
      virtualPresenceId: data.virtualPresenceId,
      domainName: data.domainName,
      name: data.name,
      protectionState: dataHolderProtectionStateTransformer.fromGraphQLToEntity(
        data.protectionState,
      ),
      complianceConcern: data.complianceConcern,
      mostRecentInteractionAt: new Date(data.mostRecentInteractionEpochMs),
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
      owner: entity.owner,
      version: entity.version,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}
