/**
 * @file Naive XDR tree-sitter implementation
 * @author algebnaly <mail@algebnaly.com>
 * @license MIT
 */
/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "naive_xdr",
  extras: ($) => [
    $.block_comment,
    /\s/
  ],

  rules: {
    source_file: ($) => repeat($.statement),
    statement: ($) => choice(
      $.block_comment,
      $.enum
    ),
    block_comment: ($) => token(
      seq(
        "/*",
        /[^*]*\*+([^/*][^*]*\*+)*/,
        "/"
      )
    ),
    enum: ($) => seq(
      $.keyword_enum,
      $.enum_name,
      "{",
      $._enum_variant_dec,
      "}"
    ),
    keyword_enum: ($) => "enum",
    enum_name: ($) => $.identifier,
    _enum_variant_dec: ($) => seq(
      $.identifier,
      "=",
      $.number,
      optional(repeat(seq(
        ",",
        $.identifier,
        "=",
        $.number,
      )))
    ),
    struct: ($) => seq(
      $.struct_keyword,
      $.struct_name,
      "{",
      repeat(""),
      "}"
    ),
    struct_keyword: ($) => "struct",
    struct_name: ($) => $.identifier,
    struct_member: ($) => seq(
      $.type_specifier,
      $.identifier,
      ";"
    ),
    type_specifier: ($) => $.identifier,
    identifier: ($) => /[A-Za-z]+[_A-Za-z]*/,
    number: ($) => choice("0", /[1-9]+[0-9]*/),
  },
});
