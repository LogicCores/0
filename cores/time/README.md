0-time
======



Development
===========

To verify that the time core is working properly by taking a timezone configuration into account when running on a server you may want to set the timezone of your environment before calling NodeJS:

    // @see http://stackoverflow.com/a/9849524/330439
    export TZ="Europe/Amsterdam"

Calling the following should now give you the local time in *Amsterdam*:

    new Date().toLocaleTimeString()

If the time core is configured as follows:

    {
        "zone": "America/Vancouver"
    }

Calling the following should give you the local time in *Vancouver*:

    moment().format("dddd, MMMM Do YYYY, h:mm:ss a Z");
