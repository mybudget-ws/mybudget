import { GraphQLClient } from 'graphql-request';

const ENDPOINT = {
  development: 'http://localhost:3000/graphql',
  production: 'https://2.mybudget.ws/graphql'
}[process.env.NODE_ENV];

export default {
  // ---------------------------------
  // User
  // ---------------------------------

  async login(email, password) {
    const query = `
      query($email:String!, $password:String!) {
        user:signIn(email: $email, password: $password) {
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

  // ---------------------------------
  // Account
  // ---------------------------------

  async accounts(token) {
    const query = '{ items:accounts { id name color balance currency { name } } }';
    const data = await this.client(token).request(query);
    this.log(query, data);

    return data.items;
  },

  async createAccount(token, { name, color, rest, currency }) {
    const query = `
      mutation($name:String!, $color:String!, $rest:String!, $currency:String!) {
        createAccount(
          name: $name,
          color: $color,
          rest: $rest,
          currency: $currency
        ) { id name color balance currency { name } }
      }
    `;
    const vars = { name, color, rest, currency };
    const data = await this.client(token).request(query, vars);
    this.log('createAccount', data);

    return data.createAccount;
  },

  // ---------------------------------
  // Project
  // ---------------------------------

  async projects(token) {
    const query = '{ items:projects { id name color balance income spending } }';
    const data = await this.client(token).request(query);
    this.log(query, data);

    return data.items;
  },

  async createProject(token, { name, color }) {
    const query = `
      mutation($name:String!, $color:String!) {
        createProject(
          name: $name,
          color: $color
        ) { id name color balance income spending }
      }
    `;
    const vars = { name, color };
    const data = await this.client(token).request(query, vars);
    this.log('createProject', data);

    return data.createProject;
  },

  // ---------------------------------
  // Transaction
  // ---------------------------------

  async transactions(token, { page }) {
    const query = `
      query($page:Int) {
        items:transactions(page: $page) {
          id
          amount
          description
          dateAt
          account { name }
        }
      }
    `;
    const vars = { page };
    const data = await this.client(token).request(query, vars);
    this.log('transactions', data);

    return data.items;
  },

  // ---------------------------------
  // Common
  // ---------------------------------

  async currencies() {
    const query = '{ items:currencies { id name description usdRate } }';
    const data = await this.client().request(query);
    this.log(query, data);

    return data.items;
  },

  async colors() {
    const query = '{ items:colors { id name } }';
    const data = await this.client().request(query);
    this.log(query, data);

    return data.items;
  },

  // ---------------------------------
  // Test
  // ---------------------------------

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

  // ---------------------------------
  // Helpers
  // ---------------------------------

  client(token) {
    return new GraphQLClient(ENDPOINT, { headers: this.headers(token) });
  },

  headers(token) {
    if (process.env.NODE_ENV == 'development') { console.log(`Token: ${token}`); }
    return token ? { authorization: `Bearer ${token}` } : {};
  },

  log(query, data) {
    if (!process.env.NODE_ENV == 'development') { return; }

    if (data != null) {
      console.log(query, JSON.stringify(data, undefined, 2));
    } else {
      console.log(query, 'Data is NULL!');
    }
  }
};
