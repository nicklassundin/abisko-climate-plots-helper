const {expect} = require("chai");
describe('test build', () => {
	const helper = require('../module.js')
	before(function(done) {
		done()
	})
	describe('date', function(){
		it('parse', function*() {
			var str = '2019-01-06T00:00:00.000Z';
			var res = helper.parseDate(str); 
			expect(res.year).to.eql(2019);
			expect(res.month).to.eql(1);
			expect(res.day).to.eql(6);
			expect(res.hour).to.eql(0);
			expect(res.min).to.eql(0);
		})
	})	
})
