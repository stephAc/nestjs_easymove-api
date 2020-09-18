const fetch = require('node-fetch');
const URL = 'http://localhost:3000/api/v1/';

module.exports = {
  register: async function (user) {
    console.log("Un utilisateur s'enregistre");

    let headers = {
      'Content-Type': 'application/json',
    };

    return await fetch(`${URL}auth/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        return data.savedUser;
      })
      .catch((err) => console.log(err));
  },

  login: async function (login) {
    console.log('Un utilisateur se connecte');

    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(login),
    };

    return await fetch(`${URL}auth/login`, init)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        return data.token;
      })
      .catch((err) => console.log(err));
  },

  addWallet: async function (data, token) {
    console.log(`Ajoute la somme de ${data.money} au portefeuille`);

    const init = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    return await fetch(`${URL}users/add_wallet`, init)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  },

  removeWallet: async function (data, token) {
    console.log(`Retire la somme de ${data.money} du portefeuille`);

    const init = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    return await fetch(`${URL}users/remove_wallet`, init)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  },

  ticketRate: async function (token) {
    console.log(`Visualise le prix d'un ticket`);

    const init = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    return await fetch(`${URL}ticket/rate`, init)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  },

  buyTicket: async function (token) {
    console.log(`L'utilisateur achète un ticket`);

    const init = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    return await fetch(`${URL}ticket/buy`, init)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  },

  getUser: async function (user, token) {
    console.log(`Récupère l'utilisateur`);

    const init = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    return await fetch(`${URL}users/${user.id}`, init)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((err) => console.log(err));
  },

  getUserTicket: async function (token) {
    console.log(`L'utilisateur visualise ses tickets`);

    const init = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    return await fetch(`${URL}ticket/user`, init)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((err) => console.log(err));
  },

  refundTicket: async function (ticketID, token) {
    console.log(`L'utilisateur se fait rembourser un ticket`);

    const init = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    return await fetch(`${URL}ticket/refund/${ticketID}`, init)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  },

  navigoRate: async function (token) {
    console.log(`L'utilisateur visualise le prix d'un passe`);

    const init = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    return await fetch(`${URL}navigo`, init)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  },

  subscribeNavigo: async function (token) {
    console.log(`L'utilisateur s'abonne pour un mois`);

    const init = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    return await fetch(`${URL}navigo/MONTH`, init)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  },

  paymentHistorique: async function (token) {
    console.log(`L'utilisateur visualise son historique d'achat`);

    const init = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    return await fetch(`${URL}historyPay`, init)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  },

  deleteUser: async function (user, token) {
    console.log(`Supprime l'utilisateur ${user.username}`);

    const init = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    return await fetch(`${URL}users/${user.id}`, init)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  },
};
