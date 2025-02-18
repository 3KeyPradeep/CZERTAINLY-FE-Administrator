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

import type { SearchCondition } from "./";

/**
 * Certificate filter input
 * @export
 * @interface SearchFilterRequestDto
 */
export interface SearchFilterRequestDto {
    /**
     * Group to search
     * @type {string}
     * @memberof SearchFilterRequestDto
     */
    groupName: string;
    /**
     * Field to search
     * @type {string}
     * @memberof SearchFilterRequestDto
     */
    fieldIdentifier: string;
    /**
     * @type {SearchCondition}
     * @memberof SearchFilterRequestDto
     */
    condition: SearchCondition;
    /**
     * Value to match
     * @type {object}
     * @memberof SearchFilterRequestDto
     */
    value?: object;
}


