package tree_sitter_naive_xdr_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_naive_xdr "github.com/tree-sitter/tree-sitter-naive_xdr/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_naive_xdr.Language())
	if language == nil {
		t.Errorf("Error loading NaiveXdr grammar")
	}
}
