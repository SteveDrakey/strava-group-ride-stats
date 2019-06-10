/**
 * Strava API v3
 * Strava API
 *
 * OpenAPI spec version: 3.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


export interface RunningRace { 
    /**
     * The unique identifier of this race.
     */
    id?: number;
    /**
     * The name of this race.
     */
    name?: string;
    /**
     * The type of this race.
     */
    runningRaceType?: number;
    /**
     * The race's distance, in meters.
     */
    distance?: number;
    /**
     * The time at which the race begins started in the local timezone.
     */
    startDateLocal?: Date;
    /**
     * The name of the city in which the race is taking place.
     */
    city?: string;
    /**
     * The name of the state or geographical region in which the race is taking place.
     */
    state?: string;
    /**
     * The name of the country in which the race is taking place.
     */
    country?: string;
    /**
     * The set of routes that cover this race's course.
     */
    routeIds?: Array<number>;
    /**
     * The unit system in which the race should be displayed.
     */
    measurementPreference?: RunningRace.MeasurementPreferenceEnum;
    /**
     * The vanity URL of this race on Strava.
     */
    url?: string;
    /**
     * The URL of this race's website.
     */
    websiteUrl?: string;
}
export namespace RunningRace {
    export type MeasurementPreferenceEnum = 'feet' | 'meters';
    export const MeasurementPreferenceEnum = {
        Feet: 'feet' as MeasurementPreferenceEnum,
        Meters: 'meters' as MeasurementPreferenceEnum
    };
}
