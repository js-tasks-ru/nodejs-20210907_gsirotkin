const Validator = require('../Validator');
const expect = require('chai').expect;



describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {

    it('валидатор проверяет строковые поля', () => {
      
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        }
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('валидатор проверяет нижний порог числовых полей', () => {

      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({ age: 5 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too small, expect 18, got 5');
    });

    it('валидатор проверяет верхний порог числовых полей', () => {

      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({ age: 35 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 27, got 35');
    });

    it('валидатор проверяет поля не правильного типа', () => {

      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ age: 'go' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });

    it('валидатор проверяет несколько полей', () => {

      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({ age: 1, name: 1 });

      expect(errors).to.have.length(2);
    });
  
  });
});