import XCTest
import SwiftTreeSitter
import TreeSitterNaiveXdr

final class TreeSitterNaiveXdrTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_naive_xdr())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading NaiveXdr grammar")
    }
}
