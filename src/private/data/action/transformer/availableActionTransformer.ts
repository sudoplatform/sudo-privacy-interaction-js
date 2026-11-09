/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { AvailableAction as AvailableActionGraphQL } from '../../../../gen/graphqlTypes'
import { AvailableAction } from '../../../../public/typings/action'
import { AvailableActionEntity } from '../../../domain/entities/action/actionEntity'
import { ActionFulfilmentMethodTransformer } from './actionFulfilmentMethodTransformer'
import { ActionIntentTransformer } from './actionIntentTransformer'
import { ActionOriginTransformer } from './actionOriginTransformer'
import { ActionStatusTransformer } from './actionStatusTransformer'

export class AvailableActionTransformer {
  private readonly intentTransformer = new ActionIntentTransformer()
  private readonly fulfilmentMethodTransformer =
    new ActionFulfilmentMethodTransformer()
  private readonly originTransformer = new ActionOriginTransformer()
  private readonly statusTransformer = new ActionStatusTransformer()

  fromGraphQLToEntity(data: AvailableActionGraphQL): AvailableActionEntity {
    return {
      intent: this.intentTransformer.fromGraphQLToEntity(data.intent),
      additionalInfo: data.additionalInfo ?? undefined,
      fulfilmentMethod: this.fulfilmentMethodTransformer.fromGraphQLToEntity(
        data.fulfilmentMethod,
      ),
      origin: this.originTransformer.fromGraphQLToEntity(data.origin),
      title: data.title ?? undefined,
      description: data.description ?? undefined,
      status:
        data.status != null
          ? this.statusTransformer.fromGraphQLToEntity(data.status)
          : undefined,
    }
  }

  fromEntityToAPI(entity: AvailableActionEntity): AvailableAction {
    return {
      intent: this.intentTransformer.fromEntityToAPI(entity.intent),
      additionalInfo: entity.additionalInfo,
      fulfilmentMethod: this.fulfilmentMethodTransformer.fromEntityToAPI(
        entity.fulfilmentMethod,
      ),
      origin: this.originTransformer.fromEntityToAPI(entity.origin),
      title: entity.title,
      description: entity.description,
      status:
        entity.status !== undefined
          ? this.statusTransformer.fromEntityToAPI(entity.status)
          : undefined,
    }
  }
}
