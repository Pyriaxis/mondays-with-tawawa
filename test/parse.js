const expect = require('chai').expect;
const TawawaTwitter = require('../util/twitter');
const jpUtil = require('../util/jpUtil');

let twitterUtil = new TawawaTwitter();

describe('twitterParse', function(){

    describe('Parse Tweet Text', function(){
        
        before(function(){
           this.resultArray = TawawaTwitter.parseTwitterText('月曜日のたわわ　その２０４ 『大人になる日』 https://t.co/1ahazh3XD3');
        });
        
        it('should return an array', function(){
            expect(this.resultArray).to.be.an('array');
        });
        it('should have the correct length', function(){
            expect(this.resultArray).to.have.lengthOf(4);
        });
        it('should return the entire string in the first index.', function(){
            expect(this.resultArray[0]).to.equal('月曜日のたわわ　その２０４ 『大人になる日』 https://t.co/1ahazh3XD3');
        });
        it('should return the number(integer) in the second index.', function(){
            expect(this.resultArray[1]).to.equal(204);
        });
        it('should return the title in the third index.', function(){
            expect(this.resultArray[2]).to.equal('大人になる日');
        });
        it('should return the link in the fourth index', function(){
            expect(this.resultArray[3]).to.equal('https://t.co/1ahazh3XD3');
        })
    });

    describe('Parse incorrect Tweet Text', function(){
        it('should throw an error upon parsing malformed strings', function(){
            expect(function(){TawawaTwitter.parseTwitterText('月曜のたわわ??その２０４ 『大人になる日』 https://t.co/ahazh3XD3')}).to.throw();
        });
    });
});

describe('jpNumeralConversion', function(){
   it('should change 0-9 into integers 0-9.', function(){
        expect(jpUtil.convertJpToInt('１')).to.equal(1);
       expect(jpUtil.convertJpToInt('２')).to.equal(2);
       expect(jpUtil.convertJpToInt('３')).to.equal(3);
       expect(jpUtil.convertJpToInt('４')).to.equal(4);
       expect(jpUtil.convertJpToInt('５')).to.equal(5);
       expect(jpUtil.convertJpToInt('６')).to.equal(6);
       expect(jpUtil.convertJpToInt('７')).to.equal(7);
       expect(jpUtil.convertJpToInt('８')).to.equal(8);
       expect(jpUtil.convertJpToInt('９')).to.equal(9);
       expect(jpUtil.convertJpToInt('０')).to.equal(0);
   });

   it('should change long numbers into correct integers', function(){
       expect(jpUtil.convertJpToInt('１５０２９６７３')).to.equal(15029673);
       expect(jpUtil.convertJpToInt('２７４８３')).to.equal(27483);
       expect(jpUtil.convertJpToInt('０００')).to.equal(0);
   });

   it('reverse test', function(){
       expect(jpUtil.convertIntToJp(1234567890)).to.equal('１２３４５６７８９０');
   })
});
