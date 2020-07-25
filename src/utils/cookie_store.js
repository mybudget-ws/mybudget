import cookies from 'browser-cookies';

const DOMAIN = {
  development: 'localhost',
  production: 'mybudget.ws'
}[process.env.NODE_ENV];

export default {
  set(name, key, value) {
    cookies.set(
      `${name}_${key}`,
      JSON.stringify(value), { expires: 365, domain: DOMAIN, samesite: 'Lax' }
    );
  },
  get(name, key, defaultValue) {
    const value = cookies.get(`${name}_${key}`);

    return value ?
      JSON.parse(value) :
      defaultValue;
  }
};
