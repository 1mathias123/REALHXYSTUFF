const hxy_to_hxb_multiplier = 1e3;
const hxy_multiplier = 1e8; // ERC20 Decimals
const hxb_multiplier = 1e8; // ERC20 Decimals
const hxyt_multiplier = 1e8; // TRC20 Decimals
const contract_abi = [
  {
    constant: false,
    inputs: [
      {
        name: 'amount',
        type: 'uint256',
      },
      {
        name: 'receiver',
        type: 'string',
      },
    ],
    name: 'triggerTransfer',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        name: '_hxy',
        type: 'address',
      },
      {
        name: '_hxb',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            name: 'id',
            type: 'uint256',
          },
          {
            name: 'tokens',
            type: 'uint256',
          },
          {
            name: 'sender',
            type: 'address',
          },
          {
            name: 'receiver',
            type: 'string',
          },
        ],
        indexed: false,
        name: 'transferGroup',
        type: 'tuple',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    constant: true,
    inputs: [],
    name: 'HXB',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'HXBCost',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'HXY',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'nextId',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'ready',
    outputs: [
      {
        name: 'hxy_ready',
        type: 'bool',
      },
      {
        name: 'hxb_ready',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    name: 'transferGroups',
    outputs: [
      {
        name: 'id',
        type: 'uint256',
      },
      {
        name: 'tokens',
        type: 'uint256',
      },
      {
        name: 'sender',
        type: 'address',
      },
      {
        name: 'receiver',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];
const hxy_abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
const hxb_abi = hxy_abi;

const contract_address = '0xA2df4BC13d6DA4A1Bc4eC2266DC2c5CfdfA3773f';
const hxy_address = '0xf131c994DDCDd91A922A2DBc866Ae99a74afCd45';
const hxb_address = '0xe18FFcb37caf55FAA68C1b70AEBCaAf7b46d1996';

const hxyt_address = 'TAPh8DYVSYFRQWo6G4fvnKDxKXJLw1Vtnu';

const setConnected = async () => {
  await ethereum.send('eth_requestAccounts');
  $('#connect-mm span').text('Connected');
  window.web3 = new Web3(window.web3.currentProvider);
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const numberToCurrency = (label, amount) => {
  return currencyFormatter.format(amount).replace('$', label);
};

const syncBalances = async () => {
  let a, b, c, HXY, HXB, HXYT;
  a = b = c = true;

  setInterval(async () => {
    if ((!HXY || !HXB) && window.ethereum) {
      HXY = new web3.eth.Contract(hxy_abi, hxy_address);
      HXB = new web3.eth.Contract(hxb_abi, hxb_address);
    }

    if (!HXYT && window.tronWeb) {
      HXYT = await window.tronWeb.contract().at(hxyt_address);
    }

    if (a && HXY) {
      a = false;
      HXY.methods
        .balanceOf(ethereum.selectedAddress)
        .call({ from: ethereum.selectedAddress })
        .then((res) => {
          const value = res / hxy_multiplier;
          const formatted = numberToCurrency('', value);
          $('#hxy-balance').text(formatted);
          a = true;
        });
    }
    if (b && HXB) {
      b = false;
      HXB.methods
        .balanceOf(ethereum.selectedAddress)
        .call({ from: ethereum.selectedAddress })
        .then((res) => {
          const value = res / hxb_multiplier;
          const formatted = numberToCurrency('', value);
          $('#hxb-balance').text(formatted);
          b = true;
        });
    }
    if (c && !!HXYT) {
      c = false;
      HXYT.balanceOf(window.tronWeb.defaultAddress.base58)
        .call({})
        .then((res) => {
          const value = res / hxyt_multiplier;
          const formatted = numberToCurrency('', value);
          $('#hxyt-balance').text(formatted);
          c = true;
        });
    }
  }, 2000);
};

$(document).ready(() => {
  if (window.ethereum && window.ethereum.isConnected()) {
    console.log('connected');
    setConnected();
  }

  // Keep balances up-to-date
  syncBalances();
});

(() => {
  $('#connect-mm').click(async () => {
    console.log(window.ethereum);
    if (!window.ethereum) {
      alert('Install/Activate MetaMask');
      return;
    }

    if (window.ethereum.isConnected()) {
      console.log('connected');
      setConnected();
      return;
    } else {
      setConnected();
      return;
    }
  });

  $('#hxy-input').on('change paste keyup', (val) => {
    $('#hxb-input').val(
      parseFloat($('#hxy-input').val()) * hxy_to_hxb_multiplier
    );
    return;
  });

  $('#close-approval').click(() => {
    $('#approval').css('display', 'none');
  });

  $(window).click((event) => {
    if (event.target == $('#approval').get(0)) {
      $('#approval').css('display', 'none');
    }
  });

  $('#approve-hxy').click(async () => {
    const hxy = parseFloat($('#hxy-input').val());
    const hxb = hxy * hxy_to_hxb_multiplier;
    const hxy_scaled = hxy * hxy_multiplier;

    const HXY = new web3.eth.Contract(hxy_abi, hxy_address);
    await HXY.methods
      .approve(contract_address, hxy_scaled.toString())
      .send({ from: ethereum.selectedAddress });
  });

  $('#approve-hxb').click(async () => {
    const hxy = parseFloat($('#hxy-input').val());
    const hxb = hxy * hxy_to_hxb_multiplier;
    const hxb_scaled = hxb * hxb_multiplier;

    const HXB = new web3.eth.Contract(hxb_abi, hxb_address);
    await HXB.methods
      .approve(contract_address, hxb_scaled.toString())
      .send({ from: ethereum.selectedAddress });
  });

  $('#wrap-it').click(async () => {
    const receiver = $('#tron-address').val();
    const hxy = parseFloat($('#hxy-input').val());

    if (!receiver || !hxy) {
      alert('Invalid form data');
      return;
    }

    const hxb = hxy * hxy_to_hxb_multiplier;
    const hxy_scaled = hxy * hxy_multiplier;
    const hxb_scaled = hxb * hxb_multiplier;

    const HXY = new web3.eth.Contract(hxy_abi, hxy_address);
    const HXB = new web3.eth.Contract(hxb_abi, hxb_address);
    const CCT = new web3.eth.Contract(contract_abi, contract_address);

    $('#approval').css('display', 'block');

    const ready = await CCT.methods
      .ready(hxy_scaled.toString())
      .call({ from: ethereum.selectedAddress });

    if (!ready.hxy_ready)
      await HXY.methods
        .approve(contract_address, hxy_scaled.toString())
        .send({ from: ethereum.selectedAddress });

    if (!ready.hxb_ready)
      await HXB.methods
        .approve(contract_address, hxb_scaled.toString())
        .send({ from: ethereum.selectedAddress });

    const interval = setInterval(async () => {
      const status = await CCT.methods
        .ready(hxy_scaled.toString())
        .call({ from: ethereum.selectedAddress });

      if (status.hxy_ready) {
        $('#hxy-state').text('Complete');
        $('#hxy-trailing').text('.');
      } else {
        let val = $('#hxy-trailing').text();
        if (val === '...') val = '..';
        else if (val === '..') val = '.';
        else if (val === '.') val = '...';
        $('#hxy-trailing').text(val);
      }

      if (status.hxb_ready) {
        $('#hxb-state').text('Complete');
        $('#hxb-trailing').text('.');
      } else {
        let val = $('#hxb-trailing').text();
        if (val === '...') val = '..';
        else if (val === '..') val = '.';
        else if (val === '.') val = '...';
        $('#hxb-trailing').text(val);
      }

      if (status.hxy_ready && status.hxb_ready) {
        $('#trigger-transfer').attr('disabled', false);
        clearInterval(interval);
      }
    }, 1000);
  });

  $('#trigger-transfer').click(async () => {
    const receiver = $('#tron-address').val();
    const hxy = parseFloat($('#hxy-input').val());

    if (!receiver || !hxy) {
      alert('Invalid form data');
      return;
    }

    const hxb = hxy * hxy_to_hxb_multiplier;
    const hxy_scaled = hxy * hxy_multiplier;

    const CCT = new web3.eth.Contract(contract_abi, contract_address);

    const ready = await CCT.methods
      .ready(hxy_scaled.toString())
      .call({ from: ethereum.selectedAddress });
    console.log('ready', ready);

    if (!ready.hxy_ready || !ready.hxb_ready) {
      alert('HXY or HXB approval not completed');
      return;
    }

    // Set pending state somewhere
    await CCT.methods
      .triggerTransfer(hxy_scaled.toString(), receiver)
      .send({ from: ethereum.selectedAddress });
    // Set interval for pending state (need to hook up with tronweb)
  });
})();
