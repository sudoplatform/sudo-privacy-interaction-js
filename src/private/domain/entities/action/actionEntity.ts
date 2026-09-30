/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The user-facing intent of an action. This is a service-owned taxonomy,
 * decoupled from any upstream provider's action vocabulary.
 *
 * Clients must tolerate unknown values: an unrecognised intent is represented
 * as `Other` rather than failing, so newly added intents do not break existing
 * clients.
 *
 * @property StopContact Unsubscribe / opt out of marketing communications.
 * @property AccessMyData Data subject access / portability request.
 * @property DeleteMyData Account deletion / data erasure.
 * @property LimitDataUse Opt out of sale / tracking, manage consent.
 * @property Other Anything unmapped; carries additionalInfo.
 *
 * @enum
 */
export enum ActionIntentEntity {
  StopContact = 'STOP_CONTACT',
  AccessMyData = 'ACCESS_MY_DATA',
  DeleteMyData = 'DELETE_MY_DATA',
  LimitDataUse = 'LIMIT_DATA_USE',
  Other = 'OTHER',
}

/**
 * How an action is fulfilled from the user's perspective.
 *
 * @property Assisted The service returns structured materials for the client to
 *  complete the action.
 * @property Delegated The service performs the action on the user's behalf.
 *
 * @enum
 */
export enum ActionFulfilmentMethodEntity {
  Assisted = 'ASSISTED',
  Delegated = 'DELEGATED',
}

/**
 * Which source contributed an available action.
 *
 * @property Static Always-possible action for the virtual presence type.
 * @property Analysis Derived from an analysis source's reported actions.
 * @property Discovery Derived from a discovery scan (e.g. List-Unsubscribe).
 *
 * @enum
 */
export enum ActionOriginEntity {
  Static = 'STATIC',
  Analysis = 'ANALYSIS',
  Discovery = 'DISCOVERY',
  Unknown = 'UNKNOWN',
}

/**
 * Lifecycle status of a persisted action instance.
 *
 * @property Pending The action has been created but not yet started.
 * @property InProgress The action is being performed.
 * @property CompletedUnverified The action completed but has not been verified.
 * @property CompletedVerified The action completed and has been verified.
 * @property Failed The action failed to complete.
 * @property RequiresUserInput The action requires further input from the user.
 * @property Contradicted Subsequent evidence contradicts the action's completion.
 *
 * @enum
 */
export enum ActionStatusEntity {
  Pending = 'PENDING',
  InProgress = 'IN_PROGRESS',
  CompletedUnverified = 'COMPLETED_UNVERIFIED',
  CompletedVerified = 'COMPLETED_VERIFIED',
  Failed = 'FAILED',
  RequiresUserInput = 'REQUIRES_USER_INPUT',
  Contradicted = 'CONTRADICTED',
  Unknown = 'UNKNOWN',
}

/**
 * Contact materials for an assisted action.
 *
 * @interface ActionContactEntity
 * @property {string} email Contact email address, when available.
 * @property {string} phone Contact phone number, when available.
 * @property {string} address Contact postal address, when available.
 */
export interface ActionContactEntity {
  email?: string
  phone?: string
  address?: string
}

/**
 * An email template returned for an assisted action. The body may contain
 * placeholders (e.g. "{{fullName}}") for fields the user supplies client-side.
 *
 * @interface AssistedEmailTemplateEntity
 * @property {string} subject Subject line for the email, when available.
 * @property {string} body Body of the email; may contain placeholders.
 */
export interface AssistedEmailTemplateEntity {
  subject?: string
  body: string
}

/**
 * Materials for an assisted action. The service supplies the organisation
 * contact points and any source-provided instructions, but never the user's own
 * data.
 *
 * @interface AssistedPayloadEntity
 * @property {string} toAddress Recipient address for an assisted email action.
 * @property {string} unsubscribeUrl Unsubscribe URL, when available.
 * @property {string} unsubscribeMailto Unsubscribe mailto link, when available.
 * @property {ActionContactEntity} contact Organisation contact points, when available.
 * @property {string} jurisdiction Jurisdiction relevant to the action, when available.
 * @property {string} instructions Free-text instructions, potentially provided
 *  verbatim by an analysis source.
 * @property {AssistedEmailTemplateEntity} emailTemplate An email template for the
 *  action, resolved from a deployment-time template store.
 */
export interface AssistedPayloadEntity {
  toAddress?: string
  unsubscribeUrl?: string
  unsubscribeMailto?: string
  contact?: ActionContactEntity
  jurisdiction?: string
  instructions?: string
  emailTemplate?: AssistedEmailTemplateEntity
}

/**
 * Core entity representation of a persisted, initiated action instance scoped to
 * a data holder relationship.
 *
 * @interface ActionEntity
 * @property {string} id Unique identifier associated with the action.
 * @property {string} virtualPresenceId The virtual presence this action belongs to.
 * @property {string} dataHolderId The data holder relationship this action is scoped to.
 * @property {ActionIntentEntity} intent The user-facing intent of the action.
 * @property {string} additionalInfo Additional info, populated when intent is `Other`.
 * @property {ActionFulfilmentMethodEntity} fulfilmentMethod How the action is fulfilled.
 * @property {ActionStatusEntity} status Current lifecycle status of the action.
 * @property {AssistedPayloadEntity} assistedPayload Materials for an assisted action.
 *  Undefined for a delegated action.
 * @property {Date} initiatedAt Date for when the action was initiated.
 * @property {Date} completedAt Date for when the action completed.
 * @property {string} owner Unique identifier of the user.
 * @property {number} version Version of this entity. Increments on update.
 * @property {Date} createdAt Date for when the action was created.
 * @property {Date} updatedAt Date for when the action was last updated.
 */
export interface ActionEntity {
  id: string
  virtualPresenceId: string
  dataHolderId?: string
  intent: ActionIntentEntity
  additionalInfo?: string
  fulfilmentMethod: ActionFulfilmentMethodEntity
  status: ActionStatusEntity
  assistedPayload?: AssistedPayloadEntity
  initiatedAt?: Date
  completedAt?: Date
  owner: string
  version: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Core entity representation of a derived, non-persisted action the user could
 * take against a data holder. Produced at query time by merging static,
 * analysis, and discovery sources.
 *
 * @interface AvailableActionEntity
 * @property {ActionIntentEntity} intent The user-facing intent of the action.
 * @property {string} additionalInfo Additional info, populated when intent is `Other`.
 * @property {ActionFulfilmentMethodEntity} fulfilmentMethod How the action is fulfilled.
 * @property {ActionOriginEntity} origin Which source contributed this action.
 * @property {string} title Short presentation hint for the action's title.
 * @property {string} description Short presentation hint describing the action.
 */
export interface AvailableActionEntity {
  intent: ActionIntentEntity
  additionalInfo?: string
  fulfilmentMethod: ActionFulfilmentMethodEntity
  origin: ActionOriginEntity
  title?: string
  description?: string
}
