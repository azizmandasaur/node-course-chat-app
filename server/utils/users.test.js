const expect = require('expect');

const {Users} = require('./users');

let users = new Users();

beforeEach(() => {
    users.users = [{
        id: '1',
        name: 'Aziz',
        room: 'Node Course'
    }, {
        id: '2',
        name: 'Moin',
        room: 'TeraData Course'
    }, {
        id: '3',
        name: 'Aalind',
        room: 'Node Course'
    }];
});

describe('Test Users Class', () => {
    it('should add a new user', () => {
        let user = {
            id: '12',
            name: 'Mustan',
            room: 'Lights'
        };
        let users = new Users();

        let newUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });

    it('should get User List for Node Course', () => {
        let namesArray = users.getUserList('Node Course');

        expect(namesArray).toEqual(['Aziz', 'Aalind']);
    });
    it('should get User List for TeraData Course', () => {
        let namesArray = users.getUserList('TeraData Course');

        expect(namesArray).toEqual(['Moin']);
    });

    it('should find user', () => {
        let userId = '2';
        let user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });
    it('should not find user', () => {
        let userId = '564';
        let user = users.getUser(userId);

        expect(user).toBeFalsy();
    });

    it('should remove user', () => {
        let userId = '1';
        let user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });
    it('should not remove user', () => {
        let userId = '54';
        let user = users.removeUser(userId);

        expect(user).toBeFalsy();
        expect(users.users.length).toBe(3);
    });
});