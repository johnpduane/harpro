/*
 Copyright 2014 John Duane. All rights reserved.
 Use of this source code is governed by a BSD-style license that can be
 found in the LICENSE file.
 */

var Profile = require('./lib/profile.js');
var Har = require('./lib/har.js');
var args = process.argv.slice(2);
var profileFile = null;
var harFile = null;
var verbose = false;

if (args.length == 0) {
    help();
}
else {
    while(args.length) {
        var arg = args.shift();
        switch(arg)
        {
            case '--version':
                printVersion();
                break;
            case '--verbose':
                verbose = true;
                break;
            case '--har':
                harFile = args.shift();
                break;
            case '--pro':
                profileFile = args.shift();
                break;
            case '-h':
                help();
                break;
            default:
                if (arg.slice(-4) === ".har") {
                    harFile = arg;
                }
                else if (arg.slice(-11) === ".cpuprofile") {
                    profileFile = arg;
                }
                else if (arg.match(/^--/)) {
                    help();
                }
                break;
        }
    }
    processInput();
}

function processInput() {
    var har, pro;
    try {
        if (!profileFile && !harFile) {
            console.log("You must specify either a --har or --pro option.");
            help();
        }

        if (harFile && harFile !== "") {
            har = new Har(harFile);
        }

        if (profileFile && profileFile !== "") {
            pro = new Profile(profileFile);
        }

        if (har && pro) {
            console.log(compareHarPro(har, pro));
        }
        else if (verbose) {
            if (har) console.log(har.generateDetails());
            if (pro) console.log(pro.generateDetails());
        }
        else {
            if (har) console.log(har.generateSummary());
            if (pro) console.log(pro.generateSummary());
        }

    }
    catch (e) {
        console.log(e.message + '\n');
        help();
    }
}

function compareHarPro(har, pro) {
    var i,
        found = [],
        unfound = [],
        profileInfo,
        output = "";
    for (i = 0; i < har.harJs.entries.length; i++) {
        if (har.harJs.entries[i].isEntryJavaScript) {
            profileInfo = pro.getUrlProfileInformation(har.harJs.entries[i].url);
            if (profileInfo[har.harJs.entries[i].url]) {
                found.push({
                    harEntry: har.harJs.entries[i],
                    profile: profileInfo[har.harJs.entries[i].url]
                });
            }
            else {
                unfound.push(har.harJs.entries[i]);
            }
        }
    }

    //unfound
    if (unfound.length === 0) {
        output = "All JavaScript files downloaded were used.\n";
    }
    else {
        output = unfound.length + " JavaScript files were downloaded but not used:\n";
        output += "File\tDownload Time\n";
        for (i = 0; i < unfound.length; i++) {
            output += unfound[i].url + "\t" +
                      unfound[i].time+ "\n";
        }
    }

    //found
    output += "\n";
    if (found.length === 0) {
        output += "None of the JavaScript files downloaded were used.\n";
    }
    else {
        output += found.length + " JavaScript files were downloaded and used:\n";
        output += "File\tCPU Time\tUses\n";
        for (i = 0; i < found.length; i++) {
            output += found[i].harEntry.url + "\t" +
                      found[i].profile.time + "\t" +
                      found[i].profile.usageCount + "\n";
        }
    }

    return output;
}

function help(){
    process.stdout.write([
        'USAGE: harpro [--har] [--pro]'
        , 'harpro will process the files referenced in the --har or --pro options independently.'
        , 'If provided together, harpro will compare the usage of Javascript files referenced in the har file'
        , 'with usage of these files and functions in the cpuprofile file.'
        , ''
        , 'Options:'
        , '  --har           - HAR file name to process, should be found within provided directory'
        , '  --pro           - CPUPROFILE file name to process, should be found within provided directory'
        , '  --verbose       - print tab separated value of all data processed'
        , '  --version       - show the current version'
        , '  -h, --help      - display this help and exit'
        , ''
    ].join("\n"));

    process.exit(-1);
}

function printVersion(){
    console.log("1.1.0");
    process.exit(0);
}