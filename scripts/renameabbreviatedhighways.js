function current_layer() {
    var layers = require("josm/layers");
    return layers.activeLayer;
}

function rename_highways() {
    var layer = current_layer();
    if (layer == null) return;

	var util = require("josm/util");
	var command = require("josm/command");
	var console = require("josm/scriptingconsole");

	var abbr = [ "ave", "blvd", "cir", "cr", "ct", "ct.", "cv", "dr", "dr.",
        "hwy", "ln", "pky", "pkwy", "pl", "rd", "st", "tr", "wy" ,"ca."];
	var full = [ "Avenue", "Boulevard", "Circle", "Crossing", "Court", "Court", "Cove", "Drive", "Drive",
        "Highway", "Lane", "Parkway", "Parkway", "Place", "Road", "Street", "Trail", "Way", "Calle"];
	
    var dataset = layer.data;
    var result = dataset.query("type:way");
    var renames = 0;
    console.println("number of ways: " + result.length);
    for (j = 0; j < result.length; j++) {
        var way = result[j];
        var name = way.get("name");
        if (name == null) continue;
        if (name.length() < 4) continue;
        var words = name.split(" ");
        if (words.length < 2) continue;
        var word = words[words.length - 1].toLowerCase();
        var found = -1;
        for (var a = 0; a < abbr.length; a++) {
            if (abbr[a] == word) found = a;
        }
        if (found == -1) continue;
        var newname = "";
        for (var w = 0; w < words.length - 1; w++) {
            newname += words[w];
            newname += " ";
        }
        newname += full[found];
        console.println("  rename [" + name + "] to [" + newname + "]");
        layer.apply( command.change(dataset.way(way.id), {tags: {name: newname}}) );
        renames++;
        way.setModified(true);
    }
    console.println("renames:" + renames);
}
rename_highways();