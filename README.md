harpro
======

Harpro consumes related HAR and CPUPROFILE files to generate a report of the JavaScript downloaded but not used.  Harpro requires node.js.
```
harpro [--har] [--pro] [--verbose]
```
Harpro will process the files referenced in the --har or --pro options independently.
If provided together, harpro will compare the usage of Javascript files referenced in the har file
with usage of these files and functions in the cpuprofile file.
```
Options:
  --har           - HAR file name to process, should be found within provided directory
  --pro           - CPUPROFILE file name to process, should be found within provided directory
  --verbose       - print tab separated value of all data processed
  --version       - show the current version
  -h, --help      - display this help and exit
```
For example:

```
$ node harpro www.yahoo.com.har www.yahoo.com.cpuprofile

6 JavaScript files were downloaded but not used:
File                                              Download Time
https://s.yimg.com/.../widget-uievents_3.8.2.js   217.79990196228027
https://s.yimg.com/.../carousel_service_0.1.62.js 98.33002090454102
https://s.yimg.com/.../masthead_0.2.306.js        131.68001174926758
https://s.yimg.com/.../lw_geo_0.0.1.js            28.339862823486328
https://y.analytics.yahoo.com/fpc.pl?...          52.89006233215332

8 JavaScript files were downloaded and used:
File                                              CPU Time            Uses
https://s.yimg.com/.../yfpad_timetracking.js      7.018125573486533   19
https://s.yimg.com/rq/darla/2-8-1/js/g-r-min.js   49.126879014405745  67
https://s.yimg.com/.../yui-base_3.8.3.js          28.072502293946133  48
https://s.yimg.com/lq/lib/3pm/cs_0.2.js           2.005178735281867   6
https://s.yimg.com/.../yui_service_0.1.19.js      31.080270396868933  58
https://pr.comet.yahoo.com/comet?                 0	                  1
https://s.yimg.com/.../dd-scroll-min.js           1.0025893676409334  23
https://y.analytics.yahoo.com/fpc.pl              0                   1
```
