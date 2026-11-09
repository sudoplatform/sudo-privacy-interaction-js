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
      case ActionIntentEntity.SwapEmail:
        return ActionIntent.SwapEmail
      case ActionIntentEntity.SwapPhone:
        return ActionIntent.SwapPhone
      case ActionIntentEntity.SwapVirtualCard:
        return ActionIntent.SwapVirtualCard
      case ActionIntentEntity.SaveInPassword:
        return ActionIntent.SaveInPassword
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
      case ActionIntent.SwapEmail:
        return ActionIntentEntity.SwapEmail
      case ActionIntent.SwapPhone:
        return ActionIntentEntity.SwapPhone
      case ActionIntent.SwapVirtualCard:
        return ActionIntentEntity.SwapVirtualCard
      case ActionIntent.SaveInPassword:
        return ActionIntentEntity.SaveInPassword
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
      case 'SWAP_EMAIL':
        return ActionIntentEntity.SwapEmail
      case 'SWAP_PHONE':
        return ActionIntentEntity.SwapPhone
      case 'SWAP_VIRTUAL_CARD':
        return ActionIntentEntity.SwapVirtualCard
      case 'SAVE_IN_PASSWORD':
        return ActionIntentEntity.SaveInPassword
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
      case ActionIntentEntity.SwapEmail:
        return 'SWAP_EMAIL'
      case ActionIntentEntity.SwapPhone:
        return 'SWAP_PHONE'
      case ActionIntentEntity.SwapVirtualCard:
        return 'SWAP_VIRTUAL_CARD'
      case ActionIntentEntity.SaveInPassword:
        return 'SAVE_IN_PASSWORD'
      case ActionIntentEntity.Other:
        return 'OTHER'
    }
  }
}
