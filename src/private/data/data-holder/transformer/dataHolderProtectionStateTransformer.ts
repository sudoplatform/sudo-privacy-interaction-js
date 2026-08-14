/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataHolderProtectionState as DataHolderProtectionStateGraphQL } from '../../../../gen/graphqlTypes'
import { DataHolderProtectionState } from '../../../../public'
import { DataHolderProtectionStateEntity } from '../../../domain/entities/data-holder/dataHolderEntity'

export class DataHolderProtectionStateTransformer {
  fromEntityToAPI(
    entity: DataHolderProtectionStateEntity,
  ): DataHolderProtectionState {
    switch (entity) {
      case DataHolderProtectionStateEntity.Monitored:
        return DataHolderProtectionState.Monitored
      case DataHolderProtectionStateEntity.ActionRequested:
        return DataHolderProtectionState.ActionRequested
      case DataHolderProtectionStateEntity.Resolved:
        return DataHolderProtectionState.Resolved
      case DataHolderProtectionStateEntity.Unknown:
        return DataHolderProtectionState.Unknown
    }
  }

  fromGraphQLToEntity(
    data: DataHolderProtectionStateGraphQL,
  ): DataHolderProtectionStateEntity {
    switch (data) {
      case 'MONITORED':
        return DataHolderProtectionStateEntity.Monitored
      case 'ACTION_REQUESTED':
        return DataHolderProtectionStateEntity.ActionRequested
      case 'RESOLVED':
        return DataHolderProtectionStateEntity.Resolved
      default:
        return DataHolderProtectionStateEntity.Unknown
    }
  }
}
