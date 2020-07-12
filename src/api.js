import { GraphQLClient } from 'graphql-request';


const DOMAIN = {
  development: 'http://localhost:3000',
  production: 'https://api.mybudget.ws'
}[process.env.NODE_ENV];

const ENDPOINT = DOMAIN + '/graphql';

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
          defaultCurrency { name }
        }
      }
    `;
    const vars = { email, password };
    const data = await this.client().request(query, vars);
    this.log('login', data);

    return data;
  },

  async registration(token, { email, password }) {
    const query = `
      mutation($email:String!, $password:String!) {
        action:signUp(input: { email: $email, password: $password }) {
          user {
            email
            token
            defaultCurrency { name }
          }
          error
        }
      }
    `;
    const vars = { email, password };
    const { action } = await this.client(token).request(query, vars);
    this.log('registration', action);

    return action;
  },

  async autoSignUp() {
    const query = `
      query {
        user:autoSignUp {
          email
          token
          defaultCurrency { name }
        }
      }
    `;
    const data = await this.client().request(query);
    this.log('autoSignUp', data);

    return data;
  },

  async fetchProfile(token) {
    const query = `
      query {
        user:fullProfile { email defaultCurrency { id name } }
      }
    `;
    const data = await this.client(token).request(query);
    this.log('fetchProfile', data);

    return data.user;
  },

  async updateProfile(token, { currency }) {
    const query = `
      mutation($currency:String!) {
        action:updateUserProfile(
          currency: $currency
        ) { email token defaultCurrency { id name } }
      }
    `;
    const vars = { currency };
    const data = await this.client(token).request(query, vars);
    this.log('updateProfile', data);

    return data.action;
  },

  async updateEmail(token, { password, newEmail }) {
    const query = `
      mutation($password:String!, $newEmail:String!) {
        action:updateUserEmail(input: {
          password: $password,
          newEmail: $newEmail
        }) {
          user { email token }
          error
        }
      }
    `;
    const vars = { password, newEmail };
    const { action } = await this.client(token).request(query, vars);
    this.log('updateEmail', action);

    return action;
  },

  async updatePassword(token, { password, newPassword }) {
    const query = `
      mutation($oldPassword:String!, $newPassword:String!) {
        action:updateUserPassword(
          oldPassword: $oldPassword,
          newPassword: $newPassword
        ) { email token }
      }
    `;
    const vars = { oldPassword: password, newPassword };
    const data = await this.client(token).request(query, vars);
    this.log('updatePassword', data);

    return data.action;
  },

  // ---------------------------------
  // Account
  // ---------------------------------

  async accounts(token) {
    const query = `{
      items:accounts { id name color isFavourite isHidden balance currency { name } }
    }`;
    const data = await this.client(token).request(query);
    this.log(query, data);

    return data.items;
  },

  async accountsFilter(token) {
    const query = `{
      items:accounts { id name color isFavourite isHidden currency { name } }
    }`;
    const data = await this.client(token).request(query);
    this.log(query, data);

    return data.items;
  },

  async account(token, { id }) {
    const query = `query($id:ID!) {
      item:account(id:$id) { id name color currency { name } }
    }`;
    const vars = { id };
    const data = await this.client(token).request(query, vars);
    this.log(query, data);

    return data.item;
  },

  async createAccount(token, { name, color, currency }) {
    const query = `
      mutation($name:String!, $color:String!, $currency:String!) {
        createAccount(
          name: $name,
          color: $color,
          currency: $currency
        ) { id name color balance currency { name } }
      }
    `;
    const vars = { name, color, currency };
    const data = await this.client(token).request(query, vars);
    this.log('createAccount', data);

    return data.createAccount;
  },

  async updateAccount(token, { id, name, color, currency }) {
    const query = `
      mutation($id:ID!, $name:String!, $color:String!, $currency:String!) {
        action:updateAccount(
          id: $id,
          name: $name,
          color: $color,
          currency: $currency
        ) { id name color currency { name } }
      }
    `;
    const vars = { id, name, color, currency };
    const data = await this.client(token).request(query, vars);
    this.log('updateAccount', data);

    return data.action;
  },

  async destroyAccount(token, id) {
    const query = `
      mutation($id:ID!) { action:destroyAccount(id: $id) { id } }
    `;
    const data = await this.client(token).request(query, { id });
    this.log('destroyAccount', data);

    return data.action;
  },

  // ---------------------------------
  // Category
  // ---------------------------------

  async categories(token) {
    const query = '{ items:categories { id name color isFavourite isHidden } }';
    const data = await this.client(token).request(query);
    this.log(query, data);

    return data.items;
  },

  async category(token, { id }) {
    const query = 'query($id:ID!) { item:category(id:$id) { id name color } }';
    const vars = { id };
    const data = await this.client(token).request(query, vars);
    this.log(query, data);

    return data.item;
  },

  async createCategory(token, { name, color }) {
    const query = `
      mutation($name:String!, $color:String!) {
        action:createCategory(
          name: $name,
          color: $color
        ) { id name color }
      }
    `;
    const vars = { name, color };
    const data = await this.client(token).request(query, vars);
    this.log('createCategory', data);

    return data.action;
  },

  async updateCategory(token, { id, name, color }) {
    const query = `
      mutation($id:ID!, $name:String!, $color:String!) {
        action:updateCategory(
          id: $id,
          name: $name,
          color: $color
        ) { id name color }
      }
    `;
    const vars = { id, name, color };
    const data = await this.client(token).request(query, vars);
    this.log('updateCategory', data);

    return data.action;
  },

  async destroyCategory(token, id) {
    const query = 'mutation($id:ID!) { action:destroyCategory(id: $id) { id } }';
    const data = await this.client(token).request(query, { id });
    this.log('destroyCategory', data);

    return data.action;
  },

  // ---------------------------------
  // Goal
  // ---------------------------------

  async goals(token) {
    const query = `
      {
        items:goals {
          id
          name
          accounts { id name color }
          amount
          currency { name }
          dueDateOn
          percentage
          balance
        }
      }
    `;
    const data = await this.client(token).request(query);
    this.log(query, data);

    return data.items;
  },

  async goal(token, { id }) {
    const query = `
      query($id:ID!) {
        item:goal(id:$id) {
          id
          name
          amount
          dueDateOn
          accounts { id name color }
        }
      }
    `;
    const vars = { id };
    const data = await this.client(token).request(query, vars);
    this.log(query, data);

    return data.item;
  },

  async createGoal(token, { name, amount, dueDateOn, accountIds }) {
    const query = `
      mutation($name:String!, $amount:String!, $dueDateOn:String!, $accountIds:[Int!]!) {
        action:createGoal(
          name: $name,
          amount: $amount,
          dueDateOn: $dueDateOn,
          accountIds: $accountIds
        ) { id name dueDateOn }
      }
    `;
    const vars = { name, amount, dueDateOn, accountIds };
    const data = await this.client(token).request(query, vars);
    this.log('createGoal', data);

    return data.action;
  },

  async updateGoal(token, { id, name, amount, dueDateOn, accountIds }) {
    const query = `
      mutation($id:ID!, $name:String!, $amount:String!, $dueDateOn:String!, $accountIds:[Int!]!) {
        action:updateGoal(
          id: $id,
          name: $name,
          amount: $amount,
          dueDateOn: $dueDateOn,
          accountIds: $accountIds
        ) { id name }
      }
    `;
    const vars = { id, name, amount, dueDateOn, accountIds };
    const data = await this.client(token).request(query, vars);
    this.log('updateGoal', data);

    return data.action;
  },

  async destroyGoal(token, id) {
    const query = 'mutation($id:ID!) { action:destroyGoal(id: $id) { id } }';
    const data = await this.client(token).request(query, { id });
    this.log('destroyGoal', data);

    return data.action;
  },

  // ---------------------------------
  // Project
  // ---------------------------------

  async projectsFilter(token) {
    const query = '{ items:projects { id name isHidden } }';
    const data = await this.client(token).request(query);
    this.log(query, data);

    return data.items;
  },

  async projects(token) {
    const query = `
      {
        items:projects {
          id
          name
          isHidden
          color
          balances {
            amount
            amountBase
            currency { name }
            currencyBase { name }
          }
        }
      }
    `;
    const data = await this.client(token).request(query);
    this.log(query, data);

    return data.items;
  },

  async project(token, { id }) {
    const query = 'query($id:ID!) { item:project(id:$id) { id name color } }';
    const vars = { id };
    const data = await this.client(token).request(query, vars);
    this.log(query, data);

    return data.item;
  },

  async createProject(token, { name, color }) {
    const query = `
      mutation($name:String!, $color:String!) {
        action:createProject(
          name: $name,
          color: $color
        ) { id name color balances { amount amountBase currency { name } currencyBase { name } } }
      }
    `;
    const vars = { name, color };
    const data = await this.client(token).request(query, vars);
    this.log('createProject', data);

    return data.action;
  },

  async updateProject(token, { id, name, color }) {
    const query = `
      mutation($id:ID!, $name:String!, $color:String!) {
        action:updateProject(
          id: $id,
          name: $name,
          color: $color
        ) { id name color }
      }
    `;
    const vars = { id, name, color };
    const data = await this.client(token).request(query, vars);
    this.log('updateProject', data);

    return data.action;
  },

  async destroyProject(token, id) {
    const query = `
      mutation($id:ID!) { action:destroyProject(id: $id) { id } }
    `;
    const data = await this.client(token).request(query, { id });
    this.log('destroyProject', data);

    return data.action;
  },

  // ---------------------------------
  // Transaction
  // ---------------------------------

  async transactions(token, { page, perPage, filters }) {
    const query = `
      query($page:Int, $perPage:Int, $accountIds:[Int!], $categoryIds:[Int!], $projectIds:[Int!]) {
        items:transactions(
          page: $page,
          perPage: $perPage,
          accountIds: $accountIds,
          categoryIds: $categoryIds,
          projectIds: $projectIds
        ) {
          id
          amount
          description
          dateAt
          account { id name color currency { name } }
          categories { id name color }
          project { id name color }
          isTransfer
        }
      }
    `;
    const { accountIds, categoryIds, projectIds } = filters;
    const vars = { page, perPage, accountIds, categoryIds, projectIds };
    const data = await this.client(token).request(query, vars);
    this.log('transactions', data);
    return data.items;
  },

  async transaction(token, { id }) {
    const query = `
      query($id:ID!) {
        item:transaction(id:$id) {
          id
          amount
          description
          dateAt
          account { id name color currency { name } }
          categories { id name color }
          project { id name color }
        }
      }
    `;
    const vars = { id };
    const data = await this.client(token).request(query, vars);
    this.log(query, data);

    return data.item;
  },

  async createTransaction(
    token,
    { amount, isIncome, date, description, accountId, projectId, categoryIds }
  ) {
    const query = `
      mutation(
        $amount:String!,
        $isIncome:Boolean!,
        $date:String!,
        $categoryIds:[Int!]!,
        $description:String,
        $accountId:String!,
        $projectId:String
      ) {
        action:createTransaction(
          amount: $amount,
          isIncome: $isIncome,
          date: $date,
          categoryIds: $categoryIds,
          description: $description,
          accountId: $accountId,
          projectId: $projectId,
        )
      }
    `;
    const vars = {
      amount,
      isIncome,
      date,
      categoryIds,
      description,
      accountId: accountId.toString(),
      projectId: projectId.toString()
    };
    const data = await this.client(token).request(query, vars);
    this.log('createTransaction', data);

    return data.action;
  },

  async updateTransaction(
    token,
    { id, amount, isIncome, date, description, accountId, projectId, categoryIds }
  ) {
    const query = `
      mutation(
        $id:ID!,
        $amount:String!,
        $isIncome:Boolean!,
        $date:String!,
        $categoryIds:[Int!]!,
        $description:String,
        $accountId:String!,
        $projectId:String
      ) {
        action:updateTransaction(
          id: $id,
          amount: $amount,
          isIncome: $isIncome,
          date: $date,
          categoryIds: $categoryIds,
          description: $description,
          accountId: $accountId,
          projectId: $projectId,
        ) { id }
      }
    `;
    const vars = {
      id,
      amount,
      isIncome,
      date,
      categoryIds,
      description,
      accountId: accountId.toString(),
      projectId: projectId.toString()
    };
    const data = await this.client(token).request(query, vars);
    this.log('updateTransaction', data);

    return data.action;
  },

  async destroyTransaction(token, id) {
    const query = `
      mutation($id:ID!) { action:destroyTransaction(id: $id) { id } }
    `;
    const data = await this.client(token).request(query, { id });
    this.log('destroyTransaction', data);

    return data.action;
  },

  async createTransactionTransfer(
    token,
    { amountSrc, amountDst, accountIdSrc, accountIdDst, date, description }
  ) {
    const query = `
      mutation(
        $amountSrc:String!,
        $amountDst:String!,
        $accountIdSrc:String!,
        $accountIdDst:String!,
        $date:String!,
        $description:String
      ) {
        action:createTransactionTransfer(
          amountSrc: $amountSrc,
          amountDst: $amountDst,
          accountIdSrc: $accountIdSrc,
          accountIdDst: $accountIdDst,
          date: $date,
          description: $description
        )
      }
    `;
    const vars = {
      amountSrc,
      amountDst,
      accountIdSrc: accountIdSrc.toString(),
      accountIdDst: accountIdDst.toString(),
      date,
      description
    };
    const data = await this.client(token).request(query, vars);
    this.log('createTransactionTransfer', data);

    return data.action;
  },

  // ---------------------------------
  // Favourite
  // ---------------------------------

  async toggleIsFavourite(token, id, model) {
    const query = `
      mutation($id:Int!, $model:String!) {
        action:toggleIsFavourite(id: $id, model: $model)
      }
    `;
    const data = await this.client(token).request(query, { id, model });
    this.log('toggleIsFavourite', data);

    return data.action;
  },

  // ---------------------------------
  // Hidden
  // ---------------------------------

  async toggleIsHidden(token, id, model) {
    const query = `
      mutation($id:Int!, $model:String!) {
        action:toggleIsHidden(id: $id, model: $model)
      }
    `;
    const data = await this.client(token).request(query, { id, model });
    this.log('toggleIsHidden', data);

    return data.action;
  },

  // ---------------------------------
  // Reports
  // ---------------------------------

  async balances(token, params) {
    const url = DOMAIN + '/charts/balances?' + params;
    const response = await fetch(url, {
      headers: this.headers(token)
    });
    const data = await response.json();
    this.log(url, data);

    return data;
  },

  async columns(token, params) {
    const url = DOMAIN + '/charts/columns?' + params;
    const response = await fetch(url, {
      headers: this.headers(token)
    });
    const data = await response.json();
    this.log(url, data);

    return data;
  },

  async currenciesChart(name, base = 'RUB') {
    const url = `${DOMAIN}/charts/currencies/${name}.json?base=${base}`;
    const response = await fetch(url);
    const data = await response.json();
    this.log(url, data);

    return data;
  },

  // ---------------------------------
  // Common
  // ---------------------------------

  async currencies(base = 'RUB') {
    const query = `
      query($base:String!) {
        items:currencies(base: $base) { id name description usdRate baseRate }
      }
    `;
    const vars = { base };
    const data = await this.client().request(query, vars);
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
