import { GraphQLClient } from 'graphql-request';

const ENDPOINT = {
  development: 'http://localhost:3000/graphql',
  production: 'https://2.mybudget.ws/graphql'
}[process.env.NODE_ENV];

export default {
  async ping() {
    const query = '{ ping }';
    const data = await this.client().request(query);
    this.log('ping', data);

    return data;
  },

  async pingMutation() {
    const query = 'mutation { pingMutation }';
    const data = await this.client().request(query);
    this.log('pingMutation', data);

    return data;
  },

  async login(email, password) {
    const query = `
      query($email:String!, $password:String!) {
        user:loginByPassword(email: $email, password: $password) {
          email
          token
        }
      }
    `;
    const vars = { email, password };

    const data = await this.client().request(query, vars);
    this.log('login', data);

    return data;
  },

  async currencies() {
    const query = '{ items:currencies { id name description usdRate } }';
    const data = await this.client().request(query);
    this.log('currencies', data);

    return data.items;
  },

  // async openDoor(token, slot) {
  //   const query = `
  //     mutation($slot:Int!) {
  //       openDoor(slot: $slot)
  //     }
  //   `;
  //   const vars = { slot };
  //   const data = await this.client(token).request(query, vars);
  //   this.log('openDoor', data);

  //   return data;
  // },

  client(token) {
    return new GraphQLClient(ENDPOINT, { headers: this.headers(token) });
  },

  headers(token) {
    if (process.env.NODE_ENV == 'development') { console.log(`Token: ${token}`); }
    return token ? { authorization: `Bearer ${token}` } : {};
  },

  log(method, data) {
    if (!process.env.NODE_ENV == 'development') { return; }

    if (data != null) {
      console.log(method, JSON.stringify(data, undefined, 2));
    } else {
      console.log(method, 'Data is NULL!');
    }
  }
};
