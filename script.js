'use strict'
const account1 = {
    userName: 'Дмитрий Николаев',
    transactions: [500, 250, -300, 5000, -850, -110, -170, 1100],
    transactionsDate: [
        '2021-11-13T11:48:50.942Z',
        '2021-11-14T12:00:50.942Z',
        '2021-12-01T14:12:50.942Z',
        '2021-12-26T18:08:50.942Z',
        '2022-01-02T13:02:00.942Z',
        '2022-01-26T13:08:50.942Z',
        '2022-02-02T10:02:15.942Z',
        '2022-02-26T14:08:50.942Z'
    ],
    pin: 1111,
};

const account2 = {
    userName: 'Анна Смирнова',
    transactions: [2000, 6400, -1350, -70, -210, -2000, 5500, -30],
    transactionsDate: [
        '2022-01-13T11:48:50.942Z',
        '2022-01-14T12:00:50.942Z',
        '2022-01-17T14:12:50.942Z',
        '2022-01-26T18:08:50.942Z',
        '2022-02-02T13:02:00.942Z',
        '2022-03-26T13:08:50.942Z',
        '2022-03-02T10:02:15.942Z',
        '2022-03-12T14:08:50.942Z'
    ],
    pin: 2222,
};

const account3 = {
    userName: 'Сергей Ковалев',
    transactions: [900, -200, 280, 300, -200, 150, 1400, -400],
    transactionsDate: [
        '2021-12-13T11:48:50.942Z',
        '2021-12-14T12:00:50.942Z',
        '2021-12-01T14:12:50.942Z',
        '2021-12-26T18:08:50.942Z',
        '2022-01-02T13:02:00.942Z',
        '2022-01-26T13:08:50.942Z',
        '2022-02-02T10:02:15.942Z',
        '2022-03-02T14:08:50.942Z'
    ],
    pin: 3333,
};

const account4 = {
    userName: 'Елена Федорова',
    transactions: [530, 1300, 500, 40, 190],
    transactionsDate: [
        '2021-10-11T10:00:50.942Z',
        '2021-11-14T15:00:50.942Z',
        '2021-11-25T14:12:50.942Z',
        '2021-12-02T08:08:50.942Z',
        '2022-01-23T19:02:00.942Z'
    ],
    pin: 4444,
};

const account5 = {
    userName: 'Андрей Иванов',
    transactions: [630, 800, 300, 50, 120],
    transactionsDate: [
        '2022-02-01T06:40:50.942Z',
        '2022-02-14T22:04:50.942Z',
        '2022-02-01T14:12:50.942Z',
        '2022-03-06T12:08:50.942Z',
        '2022-03-10T13:02:00.942Z'
    ],
    pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];



const form = document.forms.form
const infoDate = document.querySelector('.info-date')
const transactions = document.querySelector('.bank-item1')
const balans = document.querySelector('.balans')
const btnSort = document.querySelector('.btn--sort');
const transfer = document.querySelector('#but2')
const loanBtn = document.querySelector('#but3')
const closeBtn = document.querySelector('#but4')
const reg = document.querySelector('.registr')
const bank = document.querySelector('.bank')


let currentAccount;
let sorted = false;



form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements.name.value;
    const pass = +form.elements.pass.value
    const head = document.querySelector('.head')
    const date = new Date().toLocaleDateString()
    currentAccount = accounts.find(item => item.userName === name)
    if (currentAccount) {
        if (currentAccount.pin === pass) {
            reg.style.display = 'none';
            bank.style.display = 'block'

            head.innerHTML = `Добро пожаловать в наш сервис, ${name}`
            infoDate.innerHTML = `На ${date}`
            displayTransactions()
            displayTotal()
        } else {
            alert('Неверный пароль')
            form.elements.pass.value = ''
        }
    } else {
        alert('Такого пользователя не существует')

    }
    form.elements.pass.value = ''
     form.elements.name.value = ''
    
})


function displayTransactions() {
    transactions.innerHTML = '';
    currentAccount.transactions.forEach((item, ind) => {
        const date = new Date(currentAccount.transactionsDate[ind]).toLocaleDateString()
        const type = item > 0 ? 'deposit' : 'withdrawal';
        transactions.innerHTML += `
        <div class='transactions__row'>
        <div class = 'typeDate'> 
          <div class='transactions__date'>${date}</div>
          <div class='transactions__type--${type}'>${type == 'deposit' ? 'Депозит' : 'Вывод средств (перевод)'}</div> 
        </div> 
          <div class='transactions__value'>${item}$</div>
        </div>`
    })
}




function displayTotal() {
    const total = currentAccount.transactions.reduce((a, b) => a + b);
    currentAccount.total = total;
    balans.innerHTML = `${total} $`;
    const deposit = currentAccount.transactions.filter(i => i > 0).reduce((a, b) => a + b);
    let withdrawal = currentAccount.transactions.filter(i => i < 0);
    if (withdrawal.length > 0) {
        withdrawal = withdrawal.reduce((a, b) => a + b)
    } 
    document.querySelector('.total__value--in').innerHTML = `${deposit}$`;
    document.querySelector('.total__value--out').innerHTML = `${Array.isArray(withdrawal) ? '0$' : `${-withdrawal}$`}`
}

btnSort.addEventListener('click', () => {
    sorted = !sorted;
    let sortTransactions;
    if (sorted) {
      sortTransactions = currentAccount.transactions.sort((a, b) => b-a);
    } else {
      sortTransactions = currentAccount.transactions.sort((a, b) => a-b);
    }
    displayTransactions(sortTransactions)
  })

  

  transfer.addEventListener('click', (e) => {
    e.preventDefault();
    const transferUser = document.querySelector('#recipient');
    const transferAmmount = document.querySelector('#sum');
    const name = transferUser.value;
    const ammout = +transferAmmount.value;
    if (accounts.find((obj) => obj.userName === name) && name !== currentAccount.name) {
      if (ammout < currentAccount.total) {
        currentAccount.transactions.push(-ammout);
        currentAccount.transactionsDate.push(new Date().toISOString())
        displayTransactions()
        displayTotal()
        const a = document.querySelectorAll('.transactions__type--withdrawal')
        a[a.length-1].innerHTML = 'Перевод (списание)';
        transferAmmount.value = '';
        transferUser.value = '';
      } else {
        alert('Недостаточно средств')
        transferAmmount.value = '';
        transferUser.value = '';
      }
    } else {
      alert('Такого пользователя нет');
      transferAmmount.value = '';
      transferUser.value = '';
    }
      
  })

  loanBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const loan = document.querySelector('#recipient3');
    const loanAmount = +loan.value;
    if (currentAccount.transactions.some(i => i >= loanAmount * 0.1)) {
      currentAccount.transactions.push(loanAmount);
      currentAccount.transactionsDate.push(new Date().toISOString())
      displayTransactions()
      displayTotal()
      const a = document.querySelectorAll('.transactions__type--deposit')
      a[a.length-1].innerHTML = 'ЗАЙМ';
      loan.value = ''
    } else {
      alert('Запрос отклонен')
    }
  })

  closeBtn.addEventListener('click', e => {
    e.preventDefault()
    const user = document.querySelector('#rep_name')
    const pin = document.querySelector('#pin')
    if (user.value === currentAccount.userName && +pin.value === currentAccount.pin) {
        reg.style.display = 'flex';
        bank.style.display = 'none'
    } else {
        alert('Неверный логин или пароль')
    }
    user.value =''
    pin.value =''
  })



  





