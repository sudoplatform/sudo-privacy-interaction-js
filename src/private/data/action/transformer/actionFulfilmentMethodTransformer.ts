/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActionFulfilmentMethod as ActionFulfilmentMethodGraphQL } from '../../../../gen/graphqlTypes'
import { ActionFulfilmentMethod } from '../../../../public'
import { ActionFulfilmentMethodEntity } from '../../../domain/entities/action/actionEntity'

export class ActionFulfilmentMethodTransformer {
  fromEntityToAPI(
    entity: ActionFulfilmentMethodEntity,
  ): ActionFulfilmentMethod {
    switch (entity) {
      case ActionFulfilmentMethodEntity.Assisted:
        return ActionFulfilmentMethod.Assisted
      case ActionFulfilmentMethodEntity.Delegated:
        return ActionFulfilmentMethod.Delegated
    }
  }

  fromAPIToEntity(data: ActionFulfilmentMethod): ActionFulfilmentMethodEntity {
    switch (data) {
      case ActionFulfilmentMethod.Assisted:
        return ActionFulfilmentMethodEntity.Assisted
      case ActionFulfilmentMethod.Delegated:
        return ActionFulfilmentMethodEntity.Delegated
    }
  }

  fromGraphQLToEntity(
    data: ActionFulfilmentMethodGraphQL,
  ): ActionFulfilmentMethodEntity {
    switch (data) {
      case 'ASSISTED':
        return ActionFulfilmentMethodEntity.Assisted
      case 'DELEGATED':
        return ActionFulfilmentMethodEntity.Delegated
      default:
        return ActionFulfilmentMethodEntity.Assisted
    }
  }

  fromEntityToGraphQL(
    entity: ActionFulfilmentMethodEntity,
  ): ActionFulfilmentMethodGraphQL {
    switch (entity) {
      case ActionFulfilmentMethodEntity.Assisted:
        return 'ASSISTED'
      case ActionFulfilmentMethodEntity.Delegated:
        return 'DELEGATED'
    }
  }
}
