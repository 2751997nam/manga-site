const slugify = (data) => {
    var retval = data;
    try {
        str = retval;
        str = str.replace(/^\s+|\s+$/g, ""); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to = "aaaaaaeeeeiiiioooouuuunc------";

        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(
                new RegExp(from.charAt(i), "g"),
                to.charAt(i)
            );
        }

        str = str
            .replace('.', '-')
            .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
            .replace(/\s+/g, "-") // collapse whitespace and replace by -
            .replace(/-+/g, "-") // collapse dashes
            .replace(/^-+/, "") // trim - from start of text
            .replace(/-+$/, ""); // trim - from end of text

        return str;
    } catch (e) {
    } finally {
    }
    return retval;
}

module.exports = {
    slugify: slugify
}