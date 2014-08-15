var expect = require( "chai" ).expect;
var sinon  = require( "sinon" );
var myCode = require('../../lib.js');

describe("tests", function(){
    describe("testFunction", function(){
        it("should return 1", function() {
            expect(myCode.testFunction()).to.equal(1);
        });
    });
});