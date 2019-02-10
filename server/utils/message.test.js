const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        let from = 'Aziz';
        let text = 'Hello there'

        let message = generateMessage(from, text);

        expect(message).toMatchObject({
            from,
            text
        });
        expect(typeof message.createdAt).toBe('number');
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location message object', () => {
        let from = 'Aziz';
        let latitude = 38;
        let longitude = 42;
        let url = 'https://www.google.com/maps?q=38,42';

        let message = generateLocationMessage(from, latitude, longitude);

        expect(message).toMatchObject({
            from,
            url
        });
        expect(typeof message.createdAt).toBe('number');
    });
});