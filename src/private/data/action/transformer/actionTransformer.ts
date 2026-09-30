/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ActionContact as ActionContactGraphQL,
  ActionFulfilmentMethod as ActionFulfilmentMethodGraphQL,
  ActionIntent as ActionIntentGraphQL,
  ActionStatus as ActionStatusGraphQL,
  AssistedEmailTemplate as AssistedEmailTemplateGraphQL,
  AssistedPayload as AssistedPayloadGraphQL,
} from '../../../../gen/graphqlTypes'
import { Action } from '../../../../public/typings/action'
import {
  ActionEntity,
  AssistedPayloadEntity,
} from '../../../domain/entities/action/actionEntity'
import { ActionFulfilmentMethodTransformer } from './actionFulfilmentMethodTransformer'
import { ActionIntentTransformer } from './actionIntentTransformer'
import { ActionStatusTransformer } from './actionStatusTransformer'

/**
 * Structural shape of the GraphQL `Action` fields consumed by this transformer.
 * Kept intentionally narrow so it accepts both the full mutation/query result
 * and the scalar-only subscription result (which omits `assistedPayload`).
 */
export interface ActionGraphQLLike {
  id: string
  virtualPresenceId: string
  dataHolderId?: string | null
  intent: ActionIntentGraphQL
  additionalInfo?: string | null
  fulfilmentMethod: ActionFulfilmentMethodGraphQL
  status: ActionStatusGraphQL
  assistedPayload?: AssistedPayloadGraphQL | null
  initiatedAtEpochMs?: number | null
  completedAtEpochMs?: number | null
  owner: string
  version: number
  createdAtEpochMs: number
  updatedAtEpochMs: number
}

export class ActionTransformer {
  private readonly intentTransformer = new ActionIntentTransformer()
  private readonly fulfilmentMethodTransformer =
    new ActionFulfilmentMethodTransformer()
  private readonly statusTransformer = new ActionStatusTransformer()

  fromGraphQLToEntity(data: ActionGraphQLLike): ActionEntity {
    return {
      id: data.id,
      virtualPresenceId: data.virtualPresenceId,
      dataHolderId: data.dataHolderId ?? undefined,
      intent: this.intentTransformer.fromGraphQLToEntity(data.intent),
      additionalInfo: data.additionalInfo ?? undefined,
      fulfilmentMethod: this.fulfilmentMethodTransformer.fromGraphQLToEntity(
        data.fulfilmentMethod,
      ),
      status: this.statusTransformer.fromGraphQLToEntity(data.status),
      assistedPayload: data.assistedPayload
        ? this.assistedPayloadFromGraphQL(data.assistedPayload)
        : undefined,
      initiatedAt:
        data.initiatedAtEpochMs != null
          ? new Date(data.initiatedAtEpochMs)
          : undefined,
      completedAt:
        data.completedAtEpochMs != null
          ? new Date(data.completedAtEpochMs)
          : undefined,
      owner: data.owner,
      version: data.version,
      createdAt: new Date(data.createdAtEpochMs),
      updatedAt: new Date(data.updatedAtEpochMs),
    }
  }

  fromEntityToAPI(entity: ActionEntity): Action {
    return {
      id: entity.id,
      virtualPresenceId: entity.virtualPresenceId,
      dataHolderId: entity.dataHolderId,
      intent: this.intentTransformer.fromEntityToAPI(entity.intent),
      additionalInfo: entity.additionalInfo,
      fulfilmentMethod: this.fulfilmentMethodTransformer.fromEntityToAPI(
        entity.fulfilmentMethod,
      ),
      status: this.statusTransformer.fromEntityToAPI(entity.status),
      assistedPayload: entity.assistedPayload,
      initiatedAt: entity.initiatedAt,
      completedAt: entity.completedAt,
      owner: entity.owner,
      version: entity.version,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  private assistedPayloadFromGraphQL(
    data: AssistedPayloadGraphQL,
  ): AssistedPayloadEntity {
    return {
      toAddress: data.toAddress ?? undefined,
      unsubscribeUrl: data.unsubscribeUrl ?? undefined,
      unsubscribeMailto: data.unsubscribeMailto ?? undefined,
      contact: data.contact ? this.contactFromGraphQL(data.contact) : undefined,
      jurisdiction: data.jurisdiction ?? undefined,
      instructions: data.instructions ?? undefined,
      emailTemplate: data.emailTemplate
        ? this.emailTemplateFromGraphQL(data.emailTemplate)
        : undefined,
    }
  }

  private contactFromGraphQL(data: ActionContactGraphQL) {
    return {
      email: data.email ?? undefined,
      phone: data.phone ?? undefined,
      address: data.address ?? undefined,
    }
  }

  private emailTemplateFromGraphQL(data: AssistedEmailTemplateGraphQL) {
    return {
      subject: data.subject ?? undefined,
      body: data.body,
    }
  }
}
