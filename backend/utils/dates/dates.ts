export const getTimeZonesHoursOffset = (
    fromTimeZone: string
    , toTimeZone: string
    , currentDate = new Date()
): number => {
    const fromDate = new Date(
        currentDate.toLocaleString( 'en-US', { timeZone: fromTimeZone } )
    );

    const toDate = new Date(
        currentDate.toLocaleString( 'en-US', { timeZone: toTimeZone } )
    );

    const offsetMilliseconds = fromDate.getTime() - toDate.getTime();

    const offsetHours = offsetMilliseconds / ( 1000 * 3600 );

    return offsetHours;
};

export const getDateWithCentralTimezoneOffset = (
    date: Date
): Date => {

    const utcDate = new Date( date.toLocaleString( 'en-US', { timeZone: 'UTC' } ) );
    const tzDate = new Date( date.toLocaleString( 'en-US', { timeZone: 'America/Chicago' } ) );
    const offset = utcDate.getTime() - tzDate.getTime();
    date.setTime( date.getTime() + offset );

    return date;
};

/**
 * These windows look like:
 * May 5th 11:00 AM CST - May 6th 10:59 AM CST
 */
export const getAdjustmentWindowStartDate = (
    adjustmentWindowEndDate: Date
): Date => {
    const adjustmentWindowStartDate = new Date(
        adjustmentWindowEndDate.getTime()
        - ( 11 * 3600 * 1000 )
        - ( 24 * 3600 * 1000 )
    );

    return adjustmentWindowStartDate;
};

/**
 * For this function, the windows look like:
 * May 5th 11:00 AM CST - May 6th 10:59 AM CST
 */
export const getAdjustmentWindowEndDate = (
    currentDate = new Date()
): Date => {
    const cstHoursOffset = getTimeZonesHoursOffset(
        'America/Chicago'
        , 'UTC'
        , currentDate
    );

    const adjustmentWindowEndDate = new Date( currentDate );

    adjustmentWindowEndDate.setUTCHours(
        adjustmentWindowEndDate.getUTCHours()
        + cstHoursOffset
    );

    if ( adjustmentWindowEndDate.getUTCHours() >= 11 ) {
        adjustmentWindowEndDate.setUTCHours(
            adjustmentWindowEndDate.getUTCHours()
            + 24
        );
    }

    adjustmentWindowEndDate.setUTCHours( 11, 0, 0, 0 );

    adjustmentWindowEndDate.setUTCHours(
        adjustmentWindowEndDate.getUTCHours()
        - cstHoursOffset
    );

    return adjustmentWindowEndDate;
};

export const getAdjustmentDeadlineDate = (
    currentDate = new Date()
): Date => {

    const cstHoursOffset = getTimeZonesHoursOffset(
        'America/Chicago'
        , 'UTC'
        , currentDate
    );

    // '2022-12-25T05:59:00.000Z' --> '2022-08-04T02:00'
    const adjustmentDeadlineDate = new Date( currentDate );

    // '2022-12-24T23:59:00.000Z'
    adjustmentDeadlineDate.setUTCHours(
        adjustmentDeadlineDate.getUTCHours() + cstHoursOffset
    );

    // '2022-12-24T00:00:00.000Z'
    adjustmentDeadlineDate.setUTCHours( 0, 0, 0, 0 );

    // '2022-12-25T00:00:00.000Z'
    adjustmentDeadlineDate.setUTCHours(
        adjustmentDeadlineDate.getUTCHours()
        + 24
    );

    // '2022-12-25T11:00:00.000Z'
    adjustmentDeadlineDate.setUTCHours(
        adjustmentDeadlineDate.getUTCHours()
        + 11
    );

    // '2022-12-26T17:00:00.000Z'
    adjustmentDeadlineDate.setUTCHours(
        adjustmentDeadlineDate.getUTCHours() - cstHoursOffset
    );

    // '2022-12-25T17:00:00.000Z' --> '2022-08-05T11:00'
    return adjustmentDeadlineDate;
};

export const getInvoicingWindowStartDate = (
    currentDate = new Date()
): Date => {

    const cstHoursOffset = getTimeZonesHoursOffset(
        'America/Chicago'
        , 'UTC'
        , currentDate
    );
    const currentCSTHours = currentDate.getUTCHours() + cstHoursOffset;
    const dayOfWeek = currentDate.getUTCDay();
    let invoiceAdjustmentStartDate = currentDate;

    if ( dayOfWeek === 0 ) {
        invoiceAdjustmentStartDate.setUTCDate( currentDate.getUTCDate() - 6 );
    } else if ( dayOfWeek === 1 ) {
        invoiceAdjustmentStartDate.setUTCDate(
            currentDate.getUTCDate() - 0
        );

        if ( currentCSTHours < 12 ) {
            invoiceAdjustmentStartDate.setUTCDate(
                currentDate.getUTCDate() - 7
            );
        }
    } else {
        invoiceAdjustmentStartDate.setUTCDate(
            currentDate.getUTCDate() - ( dayOfWeek - 1 )
        );
    }

    invoiceAdjustmentStartDate.setUTCHours( 12 );
    invoiceAdjustmentStartDate.setUTCMinutes( 0 );
    invoiceAdjustmentStartDate.setUTCSeconds( 0 );

    invoiceAdjustmentStartDate = getDateWithCentralTimezoneOffset(
        invoiceAdjustmentStartDate
    );

    return invoiceAdjustmentStartDate;
};

export const getInvoicingWindowEndDate = (
    endTime: Date
): Date => {
    let cutoffTime = new Date( endTime );
    const endTimeDayOfWeek = endTime.getUTCDay();

    /*
     * if the end time is NOT sunday,
     * shift the time to next monday
     */
    if ( endTimeDayOfWeek !== 0 ) {
        cutoffTime.setUTCDate( cutoffTime.getUTCDate() + 7 );
    }

    // ensure that the day of the week is monday
    if ( endTimeDayOfWeek !== 1 ) {
        const distanceToMonday = endTimeDayOfWeek - 1;
        cutoffTime.setUTCDate( cutoffTime.getUTCDate() - distanceToMonday );
    }

    // set the time to noon on monday
    cutoffTime.setUTCHours( 12 );
    cutoffTime.setUTCMinutes( 0 );
    cutoffTime.setUTCSeconds( 0 );
    cutoffTime = getDateWithCentralTimezoneOffset( cutoffTime );

    return ( cutoffTime );
};

export const getStartDateOfTheWeek = (
    currentDate = new Date()
): Date => {

    const cstHoursOffset = getTimeZonesHoursOffset(
        'America/Chicago'
        , 'UTC'
        , currentDate
    );
    const currentCSTHours = currentDate.getUTCHours() + cstHoursOffset;
    const dayOfWeek = currentDate.getUTCDay();
    let startDateOfTheWeek = currentDate;

    if ( dayOfWeek === 0 ) {
        startDateOfTheWeek.setUTCDate( currentDate.getUTCDate() - 6 );
    } else if ( dayOfWeek === 1 ) {
        if ( currentCSTHours < 12 ) {
            startDateOfTheWeek.setUTCDate(
                currentDate.getUTCDate() - 7
            );
        }
    } else {
        startDateOfTheWeek.setUTCDate(
            currentDate.getUTCDate() - ( dayOfWeek - 1 )
        );
    }

    /*
     *  set the time to monday midnight
     * to account for overnight ops
     */
    startDateOfTheWeek.setUTCHours( 0 );
    startDateOfTheWeek.setUTCMinutes( 0 );
    startDateOfTheWeek.setUTCSeconds( 0 );

    startDateOfTheWeek = getDateWithCentralTimezoneOffset(
        startDateOfTheWeek
    );

    return startDateOfTheWeek;
};

export const parseDateMMDDYYYY = (
    dateStr: string
): Date => {
    const [
        month
        , day
        , year
    ] = dateStr.split( '/' ).map( Number );
    return new Date( year, month - 1, day );
};

export const formatDateMMDDYYYY = (
    date: Date
): string => {
    const mm = String( date.getMonth() + 1 ).padStart( 2, '0' );
    const dd = String( date.getDate() ).padStart( 2, '0' );
    const yyyy = date.getFullYear();
    return `${ mm }/${ dd }/${ yyyy }`;
};