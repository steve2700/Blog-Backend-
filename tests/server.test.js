const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Server', () => {
  it('should return Hello World on the root path', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Welcome to the API!');
        done();
      });
  });
});




