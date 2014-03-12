const fs = require('fs');
const browserify = require('browserify');
var b = browserify();

b.add('./sources/_utils.js');
b.bundle({},function(err,src){
    // resolve namspace collisions between the firefox addon sdk API and browserify
    src = src.replace(/module/g,'moduleBrowserify');
    src = src.replace(/exports/g,'exportsBrowserify');
    src = src.replace(/require/g,'requireBrowserify');

    // export the inheritsFromEventEmitter function
    src = src.replace("function inheritsFromEventEmitter(c){\n\
    inherits(c,EventEmitter);\n\
    return c\n\
};",
    "function inheritsFromEventEmitter(c){\n\
    inherits(c,EventEmitter);\n\
    return c\n\
};\n\
module.exports = { 'inheritsFromEventEmitter': inheritsFromEventEmitter};\n"
    );
    fs.writeFile("_utils_bundle.js", src);
});
 