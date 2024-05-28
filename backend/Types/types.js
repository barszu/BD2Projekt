class Login {
    constructor(login) {
        const pattern = /^[a-zA-Z0-9]{5,}$/; // przykładowy wzorzec
        // co najmniej 5 znako alfanumerycznych
        if (!pattern.test(login)) {
            throw new Error('Invalid login');
        }
        this.login = login;
    }

    toString() {
        return this.login;
    }
}

class Email {
    constructor(email) {
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // przykładowy wzorzec
        // czy zaczyna sie od znaków alfanumerycznych, potem @, potem znaki alfanumeryczne, potem kropka, potem znaki alfanumeryczne
        if (!pattern.test(email)) {
            throw new Error('Invalid email');
        }
        this.email = email;
    }

    toString() {
        return this.email;
    }
}

class Phone {
    constructor(phone) {
        const pattern = /^\+(?:[0-9] ?){6,14}[0-9]$/; // przykładowy wzorzec
        if (!pattern.test(phone)) {
            throw new Error('Invalid phone number');
        }
        this.phone = phone;
    }

    toString() {
        return `Phone: ${this.phone}`;
    }
}

class PaymentStatus { //no enum's in JS
    options = ['Paid', 'Pending', 'Failed'];

    constructor(status) {
        if (!this.options.includes(status)) {
            throw new Error('Invalid payment status');
        }
        this.status = status;
    }

    toString() {return this.status;}
}

export { Login, Email, Phone, PaymentStatus }
// module.exports = { Login, Email, Phone, PaymentStatus } // zmiana dla testów