/**
 * @file Naive XDR tree-sitter implementation
 * @author algebnaly <mail@algebnaly.com>
 * @license MIT
 */
/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "naive_xdr",
  extras: ($) => [$.block_comment, /\s/],

  rules: {
    source_file: ($) => repeat($.definition),
    declaration: ($) =>
      choice(
        seq($.type_specifier, $.identifier),
        seq($.type_specifier, $.identifier, "[", $.value, "]"),
        seq($.type_specifier, $.identifier, "<", $.value, ">"),
        seq($.keyword_opaque, $.identifier, "[", $.value, "]"),
        seq($.keyword_opaque, $.identifier, "<", $.value, ">"),
        seq($.keyword_string, $.identifier, "<", $.value, ">"),
        seq($.type_specifier, "*", $.identifier),
        $.keyword_void,
      ),
    value: ($) => choice($.constant, $.identifier),
    constant: ($) =>
      choice($.decimal_constant, $.hexadecimal_constant, $.octal_constant),
    type_specifier: ($) =>
      choice(
        seq(optional("unsigned"), "int"),
        seq(optional("unsigned"), "hyper"),
        "float",
        "double",
        "quadruple",
        "bool",
        $.enum_type_spec,
        $.struct_type_spec,
        $.union_type_spec,
        $.identifier,
      ),
    enum_type_spec: ($) => seq($.keyword_enum, $.enum_body),
    enum_body: ($) =>
      seq(
        "{",
        $.identifier,
        "=",
        $.value,
        repeat(seq(",", $.identifier, "=", $.value)),
        "}",
      ),
    struct_type_spec: ($) => seq($.keyword_struct, $.struct_body),
    struct_body: ($) =>
      seq("{", $.declaration, ";", repeat(seq($.declaration, ";")), "}"),
    union_type_spec: ($) => seq($.keyword_union, $.union_body),
    union_body: ($) =>
      seq(
        $.keyword_switch,
        "(",
        $.declaration,
        ")",
        "{",
        $.case_spec,
        repeat($.case_spec),
        optional(seq($.keyword_default, ":", $.declaration, ";")),
        "}",
      ),
    case_spec: ($) =>
      seq(
        $.keyword_case,
        $.value,
        ":",
        repeat(seq($.keyword_case, $.value, ":")),
        $.declaration,
        ";",
      ),
    constant_def: ($) =>
      seq($.keyword_const, $.identifier, "=", $.constant, ";"),
    type_def: ($) =>
      choice(
        seq($.keyword_typedef, $.declaration, ";"),
        seq($.keyword_enum, $.identifier, $.enum_body, ";"),
        seq($.keyword_struct, $.identifier, $.struct_body, ";"),
        seq($.keyword_union, $.identifier, $.union_body, ";"),
      ),
    definition: ($) => choice($.type_def, $.constant_def),
    specification: ($) => repeat($.definition),
    decimal_constant: ($) => choice("0", /[1-9]+[0-9]*/),
    hexadecimal_constant: ($) => /0(x|X)[0-9A-Fa-f]+/,
    octal_constant: ($) => /0(o|O)[0-7]+/,
    keyword_case: ($) => "case",
    keyword_opaque: ($) => "opaque",
    keyword_string: ($) => "string",
    keyword_void: ($) => "void",
    keyword_union: ($) => "union",
    keyword_switch: ($) => "switch",
    keyword_typedef: ($) => "typedef",
    keyword_const: ($) => "const",
    keyword_enum: ($) => "enum",
    keyword_struct: ($) => "struct",
    keyword_default: ($) => "default",
    identifier: ($) => /[A-Za-z]+[_A-Za-z0-9]*/,
    block_comment: ($) => token(seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
  },
});
