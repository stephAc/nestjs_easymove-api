const functions = require('./functions');

const USER = {
  email: 'marioBro11@bros.com',
  username: 'mario',
  password: 'password',
};

const delayInms = 5000;

async function delay() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

async function main() {
  let user = null;
  let token = null;

  user = await functions.register(USER);
  await delay();

  token = await functions.login({ email: USER.email, password: USER.password });
  await delay();

  await functions.addWallet({ money: 300 }, token);
  await delay();

  await functions.removeWallet({ money: 100 }, token);
  await delay();

  await functions.ticketRate(token);
  await delay();

  await functions.buyTicket(token);
  await delay();

  await functions.buyTicket(token);
  await delay();

  let tickets = await functions.getUserTicket(token);
  await delay();

  await functions.refundTicket(tickets[0].id, token);
  await delay();

  tickets = await functions.getUserTicket(token);
  await delay();

  await functions.navigoRate(token);
  await delay();

  await functions.subscribeNavigo(token);
  await delay();

  await functions.paymentHistorique(token);
  await delay();

  await functions.getUser(user, token);
  await delay();

  await functions.deleteUser(user, token);
  await delay();

  await functions.login({ email: USER.email, password: USER.password });
}

main();
