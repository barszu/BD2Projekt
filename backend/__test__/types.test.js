// import { Login, Email, Phone, PaymentStatus } from '../Types/types.js';
const { Login, Email, Phone, PaymentStatus } = require('../Types/types.js');

const supertest = require("supertest");

describe('Login', () => {
    it('should create a valid Login', () => {
        const login = new Login('user123');
        expect(login.toString()).toBe('user123');
    });

    it('should throw an error for an invalid Login', () => {
        expect(() => new Login('user!!!!')).toThrow('Invalid login');
    });
});

describe('Email', () => {
    it('should create a valid Email', () => {
        const email = new Email('user@example.com');
        expect(email.toString()).toBe('user@example.com');
    });

    it('should throw an error for an invalid Email', () => {
        expect(() => new Email('userexample.com')).toThrow('Invalid email');
    });
});

describe('Phone', () => {
    it('should create a valid Phone', () => {
        const phone = new Phone('+123456789');
        expect(phone.toString()).toBe('Phone: +123456789');
    });

    it('should throw an error for an invalid Phone', () => {
        expect(() => new Phone('123456789')).toThrow('Invalid phone number');
    });
    it('should throw an error for an invalid Phone', () => {
        expect(() => new Phone('1234alamako   ta')).toThrow('Invalid phone number');
    });
});

describe('PaymentStatus', () => {
    it('should create a valid PaymentStatus', () => {
        const status = new PaymentStatus('Paid');
        expect(status.toString()).toBe('Paid');
    });

    it('should throw an error for an invalid PaymentStatus', () => {
        expect(() => new PaymentStatus('Invalid')).toThrow('Invalid payment status');
    });

    it('should throw an error for an invalid PaymentStatus', () => {
        expect(() => new PaymentStatus("")).toThrow('Invalid payment status');
    });
});