const jpUtil = {};
const jpNumbers = "０１２３４５６７８９　";
const engNumbers = "0123456789 ";

jpUtil.convertJpToInt = number => {
    return parseInt(tr(number, jpNumbers, engNumbers));
};

function tr( text, search, replace ) {
    // Make the search string a regex.
    var regex = RegExp( '[' + search + ']', 'g' );
    var t = text.replace( regex,
        function( chr ) {
            // Get the position of the found character in the search string.
            var ind = search.indexOf( chr );
            // Get the corresponding character from the replace string.
            var r = replace.charAt( ind );
            return r;
        } );
    return t;
}

module.exports = jpUtil;