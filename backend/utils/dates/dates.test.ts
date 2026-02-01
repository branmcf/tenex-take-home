import {
    getAdjustmentDeadlineDate
    , getAdjustmentWindowEndDate
    , getAdjustmentWindowStartDate
    , getDateWithCentralTimezoneOffset
    , getInvoicingWindowEndDate
    , getInvoicingWindowStartDate
    , getStartDateOfTheWeek
    , getTimeZonesHoursOffset
    , parseDateMMDDYYYY
    , formatDateMMDDYYYY
} from './dates';

describe( 'getTimeZonesHoursOffset', () => {
    it(
        'returns the correct hours offset'
        , () => {
            const currentDate = new Date( '2022-08-04T08:00:00.000Z' );

            const hoursOffset = getTimeZonesHoursOffset(
                'America/Chicago'
                , 'UTC'
                , currentDate
            );

            expect( hoursOffset )
                .toEqual( -5 );
        }
    );

    it(
        'accounts for daylight savings time'
        , () => {
            const currentDate = new Date( '2022-12-25T08:00:00.000Z' );

            const hoursOffset = getTimeZonesHoursOffset(
                'America/Chicago'
                , 'UTC'
                , currentDate
            );

            expect( hoursOffset )
                .toEqual( -6 );
        }
    );

    it(
        'defaults to system date when current date not given'
        , () => {

            const hoursOffset = getTimeZonesHoursOffset(
                'America/Phoenix'
                , 'UTC'
            );

            expect( hoursOffset )
                .toEqual( -7 );
        }
    );
} );

describe( 'date with timezone offset - getDateWithCentralTimezoneOffset', () => {
    it(
        'returns the correct date with timezone offset accounted for'
        , () => {
            const date = new Date( Date.UTC( 2021, 11, 7, 0, 0, 0 ) );
            const dateResult = getDateWithCentralTimezoneOffset(
                date
            );

            expect( dateResult )
                .toEqual( new Date( '2021-12-07T06:00:00.000Z' ) );
        }
    );

    it(
        'offset accounts for daylight savings time'
        , () => {
            const date = new Date( Date.UTC( 2022, 3, 7, 0, 0, 0 ) );
            const dateResult = getDateWithCentralTimezoneOffset(
                date
            );

            expect( dateResult )
                .toEqual( new Date( '2022-04-07T05:00:00.000Z' ) );
        }
    );
} );

describe( 'getAdjustmentWindowStartDate', () => {

    it(
        'returns correct window start'
        , () => {
            // 5th at 11:00 AM CST
            const adjustmentDeadline = new Date( '2022-08-05T16:00:00.000Z' );

            const adjustmentWindowStartDate = getAdjustmentWindowStartDate(
                adjustmentDeadline
            );

            // 4th at 12:00 AM CST
            expect( adjustmentWindowStartDate )
                .toEqual( new Date( '2022-08-04T05:00:00.000Z' ) );
        }
    );

    it(
        'accounts for daylight savings time'
        , () => {
            // 25th at 11:00 AM CST
            const adjustmentDeadline = new Date( '2022-12-25T17:00:00.000Z' );

            const adjustmentWindowStartDate = getAdjustmentWindowStartDate(
                adjustmentDeadline
            );

            // 24th at 12:00 AM CST
            expect( adjustmentWindowStartDate )
                .toEqual( new Date( '2022-12-24T06:00:00.000Z' ) );
        }
    );
} );


describe( 'getAdjustmentWindowEndDate', () => {

    it(
        'returns correct window end date in the late morning'
        , () => {
            // 5th at 09:00 AM CST
            const currentDate = new Date( '2022-08-05T14:00:00.000Z' );

            const adjustmentWindowEndDate = getAdjustmentWindowEndDate(
                currentDate
            );

            // 5th at 11:00 AM CST
            expect( adjustmentWindowEndDate )
                .toEqual( new Date( '2022-08-05T16:00:00.000Z' ) );
        }
    );

    it(
        'returns correct window end date in the early morning'
        , () => {
            // 5th at 12:00 AM CST
            const currentDate = new Date( '2022-08-05T05:00:00.000Z' );

            const adjustmentWindowEndDate = getAdjustmentWindowEndDate(
                currentDate
            );

            // 5th at 11:00 AM CST
            expect( adjustmentWindowEndDate )
                .toEqual( new Date( '2022-08-05T16:00:00.000Z' ) );
        }
    );

    it(
        'returns correct window end date after the 11 AM deadline'
        , () => {
            // 25th at 11:00 AM CST
            const currentDate = new Date( '2022-12-25T17:00:00.000Z' );

            const adjustmentWindowEndDate = getAdjustmentWindowEndDate(
                currentDate
            );

            // 26th at 11:00 AM CST
            expect( adjustmentWindowEndDate )
                .toEqual( new Date( '2022-12-26T17:00:00.000Z' ) );
        }
    );
} );

describe( 'getAdjustmentDeadlineDate', () => {

    it(
        'returns correct deadline'
        , () => {
            // 4th at 02:00 AM CST
            const currentDate = new Date( '2022-08-04T08:00:00.000Z' );

            const adjustmentDeadlineDate = getAdjustmentDeadlineDate(
                currentDate
            );

            // 5th at 11:00 AM CST
            expect( adjustmentDeadlineDate )
                .toEqual( new Date( '2022-08-05T16:00:00.000Z' ) );
        }
    );

    it(
        'accounts for time that is late in the day'
        , () => {
            // 24th at 11:59 PM CST
            const currentDate = new Date( '2022-12-25T05:59:00.000Z' );

            const adjustmentDeadlineDate = getAdjustmentDeadlineDate(
                currentDate
            );

            // 25th at 11:00 AM CST
            expect( adjustmentDeadlineDate )
                .toEqual( new Date( '2022-12-25T17:00:00.000Z' ) );
        }
    );

    it(
        'accounts for time that is early in the day'
        , () => {
            // 25th at 12:00 AM CST
            const currentDate = new Date( '2022-12-25T06:00:00.000Z' );

            const adjustmentDeadlineDate = getAdjustmentDeadlineDate(
                currentDate
            );

            // 26th at 11:00 AM CST
            expect( adjustmentDeadlineDate )
                .toEqual( new Date( '2022-12-26T17:00:00.000Z' ) );
        }
    );
} );

describe( 'getInvoicingWindowStartDate', () => {

    it(
        'returns correct invoice adjustment start date'
        , () => {
            // 22nd at 11:00 AM CST
            const currentDate = new Date( '2022-12-22T17:00:00.000Z' );


            const invoicingWindowStartDate = getInvoicingWindowStartDate( currentDate );

            // 19th at 12:00 PM CST
            expect( invoicingWindowStartDate )
                .toEqual( new Date( '2022-12-19T18:00:00.000Z' ) );
        }
    );

    it(
        'returns correct invoice adjustment start date when the current day is monday before 12:00PM'
        , () => {
            // 27th at 11:45 AM CST
            const currentDate = new Date( '2023-02-27T17:45:00.000Z' );


            const invoicingWindowStartDate = getInvoicingWindowStartDate( currentDate );

            // 20th at 12:00 PM CST
            expect( invoicingWindowStartDate )
                .toEqual( new Date( '2023-02-20T18:00:00.000Z' ) );
        }
    );

    it(
        'returns correct invoice adjustment start date when the current day is monday after 12:00PM'
        , () => {
            // 27th at 01:00 PM CST
            const currentDate = new Date( '2023-02-27T19:00:00.000Z' );


            const invoicingWindowStartDate = getInvoicingWindowStartDate( currentDate );

            // 27th at 12:00 PM CST
            expect( invoicingWindowStartDate )
                .toEqual( new Date( '2023-02-27T18:00:00.000Z' ) );
        }
    );

    it(
        'returns correct invoice adjustment start date when current day is monday'
        , () => {
            // 19th at 07:00 AM CST
            const currentDate = new Date( '2022-12-19T13:00:00.000Z' );


            const invoicingWindowStartDate = getInvoicingWindowStartDate(
                currentDate
            );

            // 18th at 12:00 PM CST
            expect( invoicingWindowStartDate )
                .toEqual( new Date( '2022-12-12T18:00:00.000Z' ) );
        }
    );

    it(
        'returns correct invoice adjustment start date when current date is after 05:00 PM'
        , () => {
            // 4th at 03:00 AM CST
            const currentDate = new Date( '2022-08-04T08:00:00.000Z' );


            const invoicingWindowStartDate = getInvoicingWindowStartDate( currentDate );

            // 1st at 12:00 PM CST
            expect( invoicingWindowStartDate )
                .toEqual( new Date( '2022-08-01T17:00:00.000Z' ) );
        }
    );
} );

describe( 'getInvoicingWindowEndDate', () => {

    it(
        'returns correct invoice adjustment end date'
        , () => {
            // 4th at 09:00 AM CST
            const currentDate = new Date( '2022-08-04T08:00:00.000Z' );


            const invoiceAdjustmentDeadlineDate = getInvoicingWindowEndDate(
                currentDate
            );

            // 5th at 12:00 PM CST
            expect( invoiceAdjustmentDeadlineDate )
                .toEqual( new Date( '2022-08-08T17:00:00.000Z' ) );
        }
    );

    it(
        'returns correct invoice adjustment deadline date when current date is in early morning'
        , () => {
            // 21st at 06:00 AM CST
            const currentDate = new Date( '2022-08-21T11:00:00.000Z' );


            const invoiceAdjustmentDeadlineDate = getInvoicingWindowEndDate(
                currentDate
            );

            // 22nd at 12:00 PM CST
            expect( invoiceAdjustmentDeadlineDate )
                .toEqual( new Date( '2022-08-22T17:00:00.000Z' ) );
        }
    );

    it(
        'returns correct invoice adjustment end date when the input date is in the evening'
        , () => {
            // 8th at 12:00 PM CST
            const currentDate = new Date( '2022-12-08T18:00:00.000Z' );


            const invoiceAdjustmentDeadlineDate = getInvoicingWindowEndDate(
                currentDate
            );

            // 12th at 12:00 PM CST
            expect( invoiceAdjustmentDeadlineDate )
                .toEqual( new Date( '2022-12-12T18:00:00.000Z' ) );
        }
    );
} );

describe( 'getStartDateOfTheWeek', () => {

    it(
        'returns correct start date of the week when current date is Monday before 12'
        , () => {
            // 8th at 11:00 AM CST
            const currentDate = new Date( '2023-05-08T16:00:00.000Z' );

            const startDateOfTheWeek = getStartDateOfTheWeek(
                currentDate
            );

            // 1st at 12:00 AM CST
            expect( startDateOfTheWeek )
                .toEqual( new Date( '2023-05-01T05:00:00.000Z' ) );
        }
    );

    it(
        'returns correct start date of the week when current date is Monday after 12'
        , () => {
            // 8th at 01:00 PM CST
            const currentDate = new Date( '2023-05-08T18:00:00.000Z' );

            const startDateOfTheWeek = getStartDateOfTheWeek(
                currentDate
            );

            // 8th at 12:00 AM CST
            expect( startDateOfTheWeek )
                .toEqual( new Date( '2023-05-08T05:00:00.000Z' ) );
        }
    );

    it(
        'returns correct start date of the week when current day is Sunday'
        , () => {
            // 7th at 6:00 PM CST
            const currentDate = new Date( '2023-05-07T23:00:00.000Z' );

            const startDateOfTheWeek = getStartDateOfTheWeek(
                currentDate
            );

            // 1st at 12:00 AM CST
            expect( startDateOfTheWeek )
                .toEqual( new Date( '2023-05-01T05:00:00.000Z' ) );
        }
    );

    it(
        'returns correct start date of the week when current date is somewhere in the middle of the week before 5:00 AM'
        , () => {
            // 4th at 03:00 AM CST
            const currentDate = new Date( '2023-05-04T08:00:00.000Z' );

            const startDateOfTheWeek = getStartDateOfTheWeek(
                currentDate
            );

            // 1st at 12:00 AM CST
            expect( startDateOfTheWeek )
                .toEqual( new Date( '2023-05-01T05:00:00.000Z' ) );
        }
    );

    it(
        'accounts for daylight savings time - after 12:00PM on monday'
        , () => {
            // 26th at 02:00PM CST
            const currentDate = new Date( '2022-12-26T20:00:00.000Z' );

            const startDateOfTheWeek = getStartDateOfTheWeek(
                currentDate
            );

            // 26th at 12:00 AM CST
            expect( startDateOfTheWeek )
                .toEqual( new Date( '2022-12-26T06:00:00.000Z' ) );
        }
    );

    it(
        'accounts for daylight savings time - before 12:00PM on monday'
        , () => {
            // 26th at 09:00 AM CST
            const currentDate = new Date( '2022-12-26T15:00:00.000Z' );

            const startDateOfTheWeek = getStartDateOfTheWeek(
                currentDate
            );

            // 29th at 12:00 AM CST
            expect( startDateOfTheWeek )
                .toEqual( new Date( '2022-12-19T06:00:00.000Z' ) );
        }
    );
} );

describe( 'parseDateMMDDYYYY', () => {

    it( 'parses "05/15/2025" as May 15, 2025', () => {
        const date = parseDateMMDDYYYY( '05/15/2025' );
        expect( date.getFullYear() ).toBe( 2025 );
        expect( date.getMonth() ).toBe( 4 );
        expect( date.getDate() ).toBe( 15 );
    } );

    it( 'parses "01/01/2000" as January 1st, 2000', () => {
        const date = parseDateMMDDYYYY( '01/01/2000' );
        expect( date.getFullYear() ).toBe( 2000 );
        expect( date.getMonth() ).toBe( 0 );
        expect( date.getDate() ).toBe( 1 );
    } );

    it( 'parses single-digit months/days like "6/3/2024"', () => {
        const date = parseDateMMDDYYYY( '6/3/2024' );
        expect( date.getFullYear() ).toBe( 2024 );
        expect( date.getMonth() ).toBe( 5 );
        expect( date.getDate() ).toBe( 3 );
    } );
} );

describe( 'formatDateMMDDYYYY', () => {

    it( 'formats May 15, 2025 correctly as "05/15/2025"', () => {
        const date = new Date( 2025, 4, 15 );
        expect( formatDateMMDDYYYY( date ) ).toBe( '05/15/2025' );
    } );

    it( 'formats January 1, 2000 correctly as "01/01/2000"', () => {
        const date = new Date( 2000, 0, 1 );
        expect( formatDateMMDDYYYY( date ) ).toBe( '01/01/2000' );
    } );

    it( 'formats single-digit month and day like June 3, 2024 as "06/03/2024"', () => {
        const date = new Date( 2024, 5, 3 );
        expect( formatDateMMDDYYYY( date ) ).toBe( '06/03/2024' );
    } );
} );