/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActionIntent as ActionIntentGraphQL } from '../../../../gen/graphqlTypes'
import { ActionIntent } from '../../../../public'
import { ActionIntentEntity } from '../../../domain/entities/action/actionEntity'

export class ActionIntentTransformer {
  fromEntityToAPI(entity: ActionIntentEntity): ActionIntent {
    switch (entity) {
      case ActionIntentEntity.StopContact:
        return ActionIntent.StopContact
      case ActionIntentEntity.AccessMyData:
        return ActionIntent.AccessMyData
      case ActionIntentEntity.DeleteMyData:
        return ActionIntent.DeleteMyData
      case ActionIntentEntity.LimitDataUse:
        return ActionIntent.LimitDataUse
      case ActionIntentEntity.Other:
        return ActionIntent.Other
    }
  }

  fromAPIToEntity(data: ActionIntent): ActionIntentEntity {
    switch (data) {
      case ActionIntent.StopContact:
        return ActionIntentEntity.StopContact
      case ActionIntent.AccessMyData:
        return ActionIntentEntity.AccessMyData
      case ActionIntent.DeleteMyData:
        return ActionIntentEntity.DeleteMyData
      case ActionIntent.LimitDataUse:
        return ActionIntentEntity.LimitDataUse
      case ActionIntent.Other:
        return ActionIntentEntity.Other
    }
  }

  fromGraphQLToEntity(data: ActionIntentGraphQL): ActionIntentEntity {
    switch (data) {
      case 'STOP_CONTACT':
        return ActionIntentEntity.StopContact
      case 'ACCESS_MY_DATA':
        return ActionIntentEntity.AccessMyData
      case 'DELETE_MY_DATA':
        return ActionIntentEntity.DeleteMyData
      case 'LIMIT_DATA_USE':
        return ActionIntentEntity.LimitDataUse
      default:
        return ActionIntentEntity.Other
    }
  }

  fromEntityToGraphQL(entity: ActionIntentEntity): ActionIntentGraphQL {
    switch (entity) {
      case ActionIntentEntity.StopContact:
        return 'STOP_CONTACT'
      case ActionIntentEntity.AccessMyData:
        return 'ACCESS_MY_DATA'
      case ActionIntentEntity.DeleteMyData:
        return 'DELETE_MY_DATA'
      case ActionIntentEntity.LimitDataUse:
        return 'LIMIT_DATA_USE'
      case ActionIntentEntity.Other:
        return 'OTHER'
    }
  }
}
