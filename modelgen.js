var fs = require('fs');

Array.prototype.last = function() {
    return this[this.length - 1];
};
String.prototype.mul = function(n) {
    var ret = "";
    var cnt = n;
    while (cnt > 0) {
        ret += this;
        cnt--;
    }
    return ret;
};
var out = "";
var tab = "   ";
var args, specifyOutputDir, jdbcConsumer;
if (process.argv.length < 4) {
    console.log("usage: node modelgen.js <classpath> <fields file> <output directory> <generate jdbcConsumer>\n");
    process.exit(0);
} else if (process.argv.length === 4) {
    args = process.argv.splice(2, 2);
    jdbcConsumer = false;
} else if (process.argv.length === 5) {
    args = process.argv.splice(2, 3);
    specifyOutputDir = true;
    jdbcConsumer = false;
} else {
  args = process.argv.splice(2, 4);
  specifyOutputDir = true;
  jdbcConsumer = true;
}


var classname = args[0].split(".").last();
var filepath;
if(specifyOutputDir === true){
  filepath = require('path').join(args[2], classname+".java");
} else {
  filepath = classname +".java";
}

if (fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, "", {
        flag: "w+"
    });
}

var fp = fs.readFileSync(args[1], {
    encoding: "utf-8"
}).split("\n");
var fields = [];
for (var i = 0; i < fp.length - 1; i++) {
    var sp = jdbcConsumer ? 3 : 2;
    fields.push(fp[i].split(" ").splice(0, sp));
}
out += "package " + args[0] + ";\n\n";
out += "import javax.validation.constraints.NotNull;\n";
out += "import org.hibernate.validator.constraints.NotBlank;\n";
out += "import org.hibernate.validator.constraints.Email;\n";
out += "\npublic class " + args[0].split(".").last() + "{\n";

fs.writeFileSync(filepath, out, {
    flag: "a+"
});
out = "";

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

fs.appendFileSync(filepath, out, {
    flag: "a+"
});
out = "";

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
    out += tab + "public " + type + " " + prependCamelCase("set", fields[i][1]) + "(" + type + " arg) \n" + tab + "{\n";
    out += tab + tab + "this." + fields[i][1] + " = arg;\n";
    out += tab + "}\n";
}

fs.appendFileSync(filepath, out, {
    flag: "a+"
});
out = "";

function extractFieldsByType(arr, types) {
    var ret = [];
    for (var i = 0; i < arr.length; i++) {
        if (types.indexOf(arr[i][0]) !== -1) {
            ret.push(arr[i]);
        }
    }
    return ret;
}
out += "\n" + tab + "public " + classname + "(){}\n";
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
        out += tab.mul(2) + "Boolean b" + i + ", \n";
    }
    for (var i = 0; i < ints.length; i++) {
        out += tab.mul(2) + "Integer i" + i + ", \n";
    }
    out += tab.mul(2) + "String...args)\n" + tab + "{\n";
    for (var i = 0; i < bools.length; i++) {
        out += tab.mul(2) + "this." + bools[i][1] + " = b" + i + ";\n";
    }
    for (var i = 0; i < ints.length; i++) {
        out += tab.mul(2) + "this." + ints[i][1] + " = i" + i + ";\n";
    }
}
for (var i = 0; i < strings.length; i++) {
    out += tab.mul(2) + "this." + strings[i][1] + " = args[" + i + "];\n";
}
out += tab + "}\n";

fs.appendFileSync(filepath, out);
out = "";

if (jdbcConsumer === true) {
    out +=
    out += tab + "public ResultSetExtractor<" + classname + "> getConsumer(){\n";
    out += tab.mul(2) + "return new ResultSetExtractor<" + classname + ">(){\n";
    out += tab.mul(3) + "@Override\n" + tab.mul(3) + "public " + classname + " extractData(ResultSet rs)\n";
    out += tab.mul(4) + "throws SQLException, DataAccessException\n" + tab.mul(3) + "{\n";
    out += tab.mul(4) + "rs.next();\n" + tab.mul(4) + "return new " + classname + "(";
    for (var i = 0; i < bools.length; i++) {
        if (i !== 0)
            out += tab.mul(5);
        else
            out += "\n" + tab.mul(5);
        out += "rs.getBoolean(\"" + bools[i][2] + "\")";
        if (i !== bools.length - 1)
            out += ',\n';
    }
    if (ints.length !== 0) {
        out +=',\n';
    }
    fs.appendFileSync(filepath, out);
    out = "";
    for (var i = 0; i < ints.length; i++) {
        if (i !== 0)
            out += tab.mul(5);
        out += tab.mul(5) + "rs.getInteger(\"" + ints[i][2] + "\")";
        if (i !== ints.length - 1)
            out += ',\n';
    }
    if (strings.length !== 0) {
        out += "," + tab.mul(5) + ',\n'+ tab.mul(5) + 'new String[]{\n';
    }
    fs.appendFileSync(filepath, out);
    out = "";
    for (var i = 0; i < strings.length; i++) {
        out += tab.mul(6) + "rs.getString(\"" + strings[i][2] + "\")";
        if (i !== strings.length - 1)
            out += ",\n";
        else
            out += "\n"+tab.mul(5) +"}";
    }
    out += "\n" + tab.mul(4) + ");\n" + tab.mul(3) +"}\n"+ tab.mul(2) + "};\n" +tab+"}\n";
}
out += "}\n";
fs.appendFileSync(filepath, out);
