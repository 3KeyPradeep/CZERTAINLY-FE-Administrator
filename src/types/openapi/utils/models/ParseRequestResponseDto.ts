// tslint:disable
/**
 * CZERTAINLY Utils Service API
 * REST APIs for utility and helper function to work with certificates
 *
 * The version of the OpenAPI document: 1.0.0-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type {
    RequestData,
} from './';

/**
 * @export
 * @interface ParseRequestResponseDto
 */
export interface ParseRequestResponseDto {
    /**
     * Type of the certification request parsed
     * @type {string}
     * @memberof ParseRequestResponseDto
     */
    type: ParseRequestResponseDtoTypeEnum;
    /**
     * @type {RequestData}
     * @memberof ParseRequestResponseDto
     */
    data: RequestData;
}

/**
 * @export
 * @enum {string}
 */
export enum ParseRequestResponseDtoTypeEnum {
    Pkcs10 = 'PKCS10'
}

