// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 1.6.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type {
    KeyCompromiseReason,
} from './';

/**
 * @export
 * @interface BulkCompromiseKeyRequestDto
 */
export interface BulkCompromiseKeyRequestDto {
    /**
     * @type {KeyCompromiseReason}
     * @memberof BulkCompromiseKeyRequestDto
     */
    reason: KeyCompromiseReason;
    /**
     * List of UUIDs of the keys. This will mark all the items inside the selected key as compromised
     * @type {Array<string>}
     * @memberof BulkCompromiseKeyRequestDto
     */
    uuids?: Array<string>;
}


