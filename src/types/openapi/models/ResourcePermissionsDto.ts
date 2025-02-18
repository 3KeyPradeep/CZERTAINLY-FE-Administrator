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
    ObjectPermissionsDto,
} from './';

/**
 * Resources
 * @export
 * @interface ResourcePermissionsDto
 */
export interface ResourcePermissionsDto {
    /**
     * Name of the Resource
     * @type {string}
     * @memberof ResourcePermissionsDto
     */
    name: string;
    /**
     * Allow all actions. True = Yes, False = No
     * @type {boolean}
     * @memberof ResourcePermissionsDto
     */
    allowAllActions: boolean;
    /**
     * List of actions permitted
     * @type {Array<string>}
     * @memberof ResourcePermissionsDto
     */
    actions: Array<string>;
    /**
     * Object permissions
     * @type {Array<ObjectPermissionsDto>}
     * @memberof ResourcePermissionsDto
     */
    objects: Array<ObjectPermissionsDto>;
}
