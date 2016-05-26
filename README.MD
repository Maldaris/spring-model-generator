# Spring POJO Model Generator

A NodeJS Script to generate a Plain Old Java Object for use with a Spring MVC Form from a list of fields in a text file.

## Usage:
1. Write a plaintext file (utf8 encoded) of line separated, pairs of types and fields separated by single spaces.
	* If you want to have a JDBC consumer generated, you'll need to specify column names from the ResultSet

2. Call the script with the appropriate parameters.
```bash
$ node modelgen.js <full classpath> <fields file> <output directory> <generate JDBC consumer>
```
Note: You need to supply it with at least one level of a classpath. Ex: `somepackage.Classname`

## Supported Types

Currently, Strings, Booleans, Emails (represented as strings) and Integers are supported. 
Appropriate validation decorators are added per type.

## TODO

* Add support for JDBC ResultSet consumer based on field names in database, as third part in row of plaintext file.
