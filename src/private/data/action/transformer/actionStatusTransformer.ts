/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActionStatus as ActionStatusGraphQL } from '../../../../gen/graphqlTypes'
import { ActionStatus } from '../../../../public'
import { ActionStatusEntity } from '../../../domain/entities/action/actionEntity'

export class ActionStatusTransformer {
  fromEntityToAPI(entity: ActionStatusEntity): ActionStatus {
    switch (entity) {
      case ActionStatusEntity.Pending:
        return ActionStatus.Pending
      case ActionStatusEntity.InProgress:
        return ActionStatus.InProgress
      case ActionStatusEntity.CompletedUnverified:
        return ActionStatus.CompletedUnverified
      case ActionStatusEntity.CompletedVerified:
        return ActionStatus.CompletedVerified
      case ActionStatusEntity.Failed:
        return ActionStatus.Failed
      case ActionStatusEntity.RequiresUserInput:
        return ActionStatus.RequiresUserInput
      case ActionStatusEntity.Contradicted:
        return ActionStatus.Contradicted
      case ActionStatusEntity.Unknown:
        return ActionStatus.Unknown
    }
  }

  fromGraphQLToEntity(data: ActionStatusGraphQL): ActionStatusEntity {
    switch (data) {
      case 'PENDING':
        return ActionStatusEntity.Pending
      case 'IN_PROGRESS':
        return ActionStatusEntity.InProgress
      case 'COMPLETED_UNVERIFIED':
        return ActionStatusEntity.CompletedUnverified
      case 'COMPLETED_VERIFIED':
        return ActionStatusEntity.CompletedVerified
      case 'FAILED':
        return ActionStatusEntity.Failed
      case 'REQUIRES_USER_INPUT':
        return ActionStatusEntity.RequiresUserInput
      case 'CONTRADICTED':
        return ActionStatusEntity.Contradicted
      default:
        return ActionStatusEntity.Unknown
    }
  }
}
