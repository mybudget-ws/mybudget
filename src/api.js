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

  async resetPassword({ email }) {
    const query = `
      mutation($email:String!) {
        action:resetPassword(input: { email: $email }) {
          error
        }
      }
    `;
    const vars = { email };
    const { action } = await this.client().request(query, vars);
    this.log('reset_password', action);

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
      items:accounts {
        id name color kind isFavourite isHidden balance balanceBase position
        currency { name }
      }
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
      item:account(id:$id) { id name color kind balance currency { name } position }
    }`;
    const vars = { id };
    const data = await this.client(token).request(query, vars);
    this.log(query, data);

    return data.item;
  },

  async createAccount(token, { name, color, kind, currency }) {
    const query = `
      mutation($name:String!, $color:String!, $kind:String!, $currency:String!) {
        createAccount(
          name: $name,
          color: $color,
          kind: $kind,
          currency: $currency
        ) { id name color balance currency { name } }
      }
    `;
    const vars = { name, color, kind, currency };
    const data = await this.client(token).request(query, vars);
    this.log('createAccount', data);

    return data.createAccount;
  },

  async updateAccount(token, { id, name, color, kind, currency, position }) {
    const query = `
      mutation(
        $id:ID!,
        $name:String!,
        $color:String!,
        $kind:String!,
        $currency:String!,
        $position:Int!
      ) {
        action:updateAccount(
          id: $id,
          name: $name,
          color: $color,
          kind: $kind,
          currency: $currency,
          position: $position
        ) { id name color currency { name } position }
      }
    `;
    const vars = { id, name, color, kind, currency, position };
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
          amountPerMonth
          currency { name }
          dueDateOn
          dueMonths
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
          position
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

  async updateGoal(token, { id, name, amount, dueDateOn, accountIds, position }) {
    const query = `
      mutation(
        $id:ID!,
        $name:String!,
        $amount:String!,
        $dueDateOn:String!,
        $accountIds:[Int!]!,
        $position:Int!
      ) {
        action:updateGoal(
          id: $id,
          name: $name,
          amount: $amount,
          dueDateOn: $dueDateOn,
          accountIds: $accountIds,
          position: $position
        ) { id name position }
      }
    `;
    const vars = { id, name, amount, dueDateOn, accountIds, position };
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
    const query = 'query($id:ID!) { item:project(id:$id) { id name color position } }';
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

  async updateProject(token, { id, name, color, position }) {
    const query = `
      mutation($id:ID!, $name:String!, $color:String!, $position:Int!) {
        action:updateProject(
          id: $id,
          name: $name,
          color: $color,
          position: $position
        ) { id name color }
      }
    `;
    const vars = { id, name, color, position };
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
  // Property
  // ---------------------------------

  async propertiesFilter(token) {
    const query = '{ items:properties { id name isHidden } }';
    const data = await this.client(token).request(query);
    this.log(query, data);

    return data.items;
  },

  async properties(token) {
    const query = `
      {
        items:properties {
          id
          name
          kind
          color
          price
          isHidden
          currency { name }
        }
      }
    `;
    const data = await this.client(token).request(query);
    this.log(query, data);

    return data.items;
  },

  async createProperty(token, { name, color, kind, currency, amount }) {
    const query = `
      mutation($name:String!, $color:String!, $kind:String!, $currency:String!, $amount:String!) {
        action:createProperty(
          name: $name,
          color: $color,
          kind: $kind,
          currency: $currency,
          amount: $amount
        ) { id name color kind price currency { name } }
      }
    `;
    const vars = { name, color, kind, currency, amount };
    const data = await this.client(token).request(query, vars);
    this.log('createProperty', data);

    return data.action;
  },

  async property(token, { id }) {
    const query = `query($id:ID!) {
      item:property(id:$id) {
        id name color kind amount:price currency { name }
        position
        totalIncome
        totalExpense
        transactions {
          id
          amount
          description
          dateAt
          account { id name color currency { name } }
          categories { id name color }
          project { id name color }
          property { id name color }
          isTransfer
        }
        prices {
          id
          date:dateOn
          amount
          description
          currency { name }
        }
      }
    }`;
    const vars = { id };
    const data = await this.client(token).request(query, vars);
    this.log(query, data);

    return data.item;
  },

  async updateProperty(token, { id, name, color, kind, currency, amount, position }) {
    const query = `
      mutation(
        $id:ID!,
        $name:String!,
        $color:String!,
        $kind:String!,
        $currency:String!,
        $amount:String!,
        $position:Int!
      ) {
        action:updateProperty(
          id: $id,
          name: $name,
          color: $color,
          kind: $kind,
          currency: $currency
          amount: $amount,
          position: $position
        ) { id }
      }
    `;
    const vars = { id, name, color, kind, currency, amount, position };
    const data = await this.client(token).request(query, vars);
    this.log('updateProperty', data);

    return data.action;
  },

  async destroyProperty(token, id) {
    const query = `
      mutation($id:ID!) { action:destroyProperty(id: $id) { id } }
    `;
    const data = await this.client(token).request(query, { id });
    this.log('destroyProperty', data);

    return data.action;
  },

  async createPropertyPrice(token, { amount, date, propertyId, description }) {
    const query = `
      mutation($propertyId:ID!, $amount:String!, $date:String!, $description:String) {
        action:createPropertyPrice(
          propertyId: $propertyId,
          date: $date,
          amount: $amount,
          description: $description
        ) { id }
      }
    `;
    const vars = { amount, date, propertyId, description };
    const data = await this.client(token).request(query, vars);
    this.log('createPropertyPrice', data);

    return data.action;
  },

  async updatePropertyPrice(token, { amount, date, propertyId, id, description }) {
    const query = `
      mutation($propertyId:ID!, $id:ID!, $amount:String!, $date:String!, $description:String) {
        action:updatePropertyPrice(
          propertyId: $propertyId,
          id: $id,
          date: $date,
          amount: $amount,
          description: $description
        ) { id }
      }
    `;
    const vars = { amount, date, propertyId, id, description };
    const data = await this.client(token).request(query, vars);
    this.log('updatePropertyPrice', data);

    return data.action;
  },

  async destroyPropertyPrice(token, { propertyId, id }) {
    const query = `
      mutation($propertyId:ID!, $id:ID!) {
        action:destroyPropertyPrice(
          propertyId: $propertyId,
          id: $id
        ) { id }
      }
    `;
    const data = await this.client(token).request(query, { propertyId, id });
    this.log('destroyPropertyPrice', data);

    return data.action;
  },

  // ---------------------------------
  // Transaction
  // ---------------------------------

  async transactions(token, { page, perPage, filters }) {
    const query = `
      query(
        $page:Int, $perPage:Int,
        $accountIds:[Int!], $categoryIds:[Int!],
        $projectIds:[Int!], $propertyIds:[Int!]
      ) {
        items:transactions(
          page: $page,
          perPage: $perPage,
          accountIds: $accountIds,
          categoryIds: $categoryIds,
          projectIds: $projectIds,
          propertyIds: $propertyIds
        ) {
          id
          amount
          description
          dateAt
          account { id name color currency { name } }
          categories { id name color }
          project { id name color }
          property { id name color }
          isTransfer
        }
      }
    `;
    const { accountIds, categoryIds, projectIds, propertyIds } = filters;
    const vars = { page, perPage, accountIds, categoryIds, projectIds, propertyIds };
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
          property { id name color }
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
    { amount, isIncome, date, description, accountId, categoryIds, projectId, propertyId }
  ) {
    const query = `
      mutation(
        $amount:String!,
        $isIncome:Boolean!,
        $date:String!,
        $categoryIds:[Int!]!,
        $description:String,
        $accountId:String!,
        $projectId:String,
        $propertyId:String
      ) {
        action:createTransaction(
          amount: $amount,
          isIncome: $isIncome,
          date: $date,
          categoryIds: $categoryIds,
          description: $description,
          accountId: $accountId,
          projectId: $projectId,
          propertyId: $propertyId
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
      projectId: (projectId && projectId.toString() || null),
      propertyId: (propertyId && propertyId.toString() || null)
    };
    const data = await this.client(token).request(query, vars);
    this.log('createTransaction', data);

    return data.action;
  },

  async updateTransaction(
    token,
    { id, amount, isIncome, date, description, accountId, categoryIds, projectId, propertyId }
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
        $projectId:String,
        $propertyId:String
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
          propertyId: $propertyId
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
      projectId: (projectId && projectId.toString() || null),
      propertyId: (propertyId && propertyId.toString() || null)
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

  async donuts(token, params) {
    const url = DOMAIN + '/charts/donuts?' + params;
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

  async propertyPricesChart(token, propertyId) {
    const url = DOMAIN + '/charts/property_prices/' + propertyId;
    const response = await fetch(url, {
      headers: this.headers(token)
    });
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
        items:currencies(base: $base) {
          id
          name
          displayName
          description
          usdRate
          baseRate
        }
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
    if (process.env.NODE_ENV != 'development') { return; }

    if (data != null) {
      console.log('query: %s', query, JSON.stringify(data, undefined, 2));
    } else {
      console.log('query: %s', query, 'Data is NULL!');
    }
  }
};
