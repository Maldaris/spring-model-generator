var fs = require('fs');

Array.prototype.last = function() {
    return this[this.length - 1];
};

var out = "";
var tab = "   ";
var args = process.argv.splice(2, 2);
var classname = args[0].split(".").last();
var fp = fs.readFileSync(args[1], {
    encoding: "utf-8"
}).split("\n");
var fields = [];
for (var i = 0; i < fp.length-1; i++) {
    fields.push(fp[i].split(" ").splice(0, 2));
}
out += "package " + args[0] + ";\n\n";
out += "import javax.validation.constraints.NotNull;\n";
out += "import org.hibernate.validator.constraints.NotBlank;\n";
out += "import org.hibernate.validator.constraints.Email;\n";
out += "\npublic class " + args[0].split(".").last() + "{\n";

for (var i = 0; i < fields.length; i++) {
    var decorators = "";
    if (["Boolean", "Integer"].indexOf(fields[i][0]) != -1) {
        decorators += "@NotNull\n";
    } else if (["Email", "String"].indexOf(fields[i][0])) {
        decorators += "@NotBlank\n" + (fields[i][0] === "Email" ? (tab + "@Email\n") : "");
    } else {
        continue;
    }
    var type = fields[i][0] === "Email" ? "String" : fields[i][0];
    out += tab + decorators + tab + type + " " + fields[i][1] + ";\n\n";
}

function prependCamelCase(prefix, orig) {
    var mid = orig.slice(0, 1);
    mid = mid.toUpperCase();
    return prefix + mid + orig.slice(1);
}
for (var i = 0; i < fields.length; i++) {
    var type = fields[i][0] === "Email" ? "String" : fields[i][0];
    var cc = fields[i][1];
    out += tab + "public " + type + prependCamelCase("get", fields[i][1]) + "() \n" + tab + "{\n";
    out += tab + tab + "return this." + fields[i][1] + ";\n";
    out += tab + "}\n";
}
out += "\n";
for (var i = 0; i < fields.length; i++) {
    var type = fields[i][0] === "Email" ? "String" : fields[i][0];
    var cc = fields[i][1];
    out += tab + "public " + type +" "+ prependCamelCase("set", fields[i][1]) + "(" + type + " arg) \n" + tab + "{\n";
    out += tab + tab + "this." + fields[i][1] + " = arg;\n";
    out += tab + "}\n";
}

function extractFieldsByType(arr, types) {
    var ret = [];
    for (var i = 0; i < arr.length; i++) {
        if (types.indexOf(arr[i][0]) !== -1) {
            ret.push(arr[i][1]);
        }
    }
    return ret;
}
out += "\n\n" + tab + "public " + classname + "(){}\n";
out += "\n" + tab + "public " + classname + "(";
var bools, ints, strings;
strings = extractFieldsByType(fields, ["String", "Email"]);
bools = extractFieldsByType(fields, ["Boolean"]);
ints = extractFieldsByType(fields, ["Integer"]);
if (bools.length === 0 && ints.length === 0) {
    out += "String...args){\n";
} else {
    out += "\n";
    for (var i = 0; i < bools.length; i++) {
        out += tab + tab + "Boolean b" + i + ", \n";
    }
    for (var i = 0; i < ints.length; i++) {
        out += tab + tab + "Integer i" + i + ", \n";
    }
    out += tab + tab + "String...args)\n" + tab + "{\n";
    for (var i = 0; i < bools.length; i++) {
      out += tab + tab + "this." + bools[i] + " = b" + i + ";\n";
    }
    for (var i = 0; i < ints.length; i++) {
        out += tab + taB + "this." + ints[i] + " = i" + i + ";\n";
    }
}
for (var i = 0; i < strings.length; i++) {
    out += tab + tab + "this." + strings[i] + " = args[" + i + "];\n";
}
out += tab + "}\n";


out += "}\n";
fs.writeFileSync(classname + ".java", out, {
    flag: "w+"
});
