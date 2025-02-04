export const abiToken = [
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'symbol', type: 'string' },
      { internalType: 'address', name: 'adminAddress', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'InvalidShortString', type: 'error' },
  { inputs: [{ internalType: 'string', name: 'str', type: 'string' }], name: 'StringTooLong', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  { anonymous: false, inputs: [], name: 'EIP712DomainChanged', type: 'event' },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { indexed: true, internalType: 'bytes32', name: 'previousAdminRole', type: 'bytes32' },
      { indexed: true, internalType: 'bytes32', name: 'newAdminRole', type: 'bytes32' },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
    name: 'Unpaused',
    type: 'event',
  },
  {
    inputs: [],
    name: 'CONTROLLER_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { internalType: 'bytes1', name: 'fields', type: 'bytes1' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'version', type: 'string' },
      { internalType: 'uint256', name: 'chainId', type: 'uint256' },
      { internalType: 'address', name: 'verifyingContract', type: 'address' },
      { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
      { internalType: 'uint256[]', name: 'extensions', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'flashFee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'contract IERC3156FlashBorrower', name: 'receiver', type: 'address' },
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'flashLoan',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
    name: 'maxFlashLoan',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'nonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'pause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'unpause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
];

export const abiLendeeFi = [
  {
    inputs: [
      {
        internalType: 'uint24',
        name: 'initialFeePortion',
        type: 'uint24',
      },
      {
        internalType: 'address',
        name: 'obligationReceiptNft',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'promissoryNoteNft',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_wormholeRelayer',
        type: 'address',
      },
      {
        internalType: 'uint16',
        name: 'currentChainId',
        type: 'uint16',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ECDSAInvalidSignature',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'length',
        type: 'uint256',
      },
    ],
    name: 'ECDSAInvalidSignatureLength',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'ECDSAInvalidSignatureS',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'NotAnEvmAddress',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'loanHash',
        type: 'bytes32',
      },
    ],
    name: 'LoanCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'loanHash',
        type: 'bytes32',
      },
    ],
    name: 'LoanDefaulted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'loanHash',
        type: 'bytes32',
      },
    ],
    name: 'LoanRepaid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'root',
        type: 'bytes32',
      },
    ],
    name: 'RootDeactivated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'loanHash',
        type: 'bytes32',
      },
    ],
    name: 'StartLoanCreate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'loanHash',
        type: 'bytes32',
      },
    ],
    name: 'StartLoanDefault',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'loanHash',
        type: 'bytes32',
      },
    ],
    name: 'StartLoanRepay',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'loanHash',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'uint8',
        name: 'messageType',
        type: 'uint8',
      },
    ],
    name: 'WormholeMessageReceived',
    type: 'event',
  },
  {
    inputs: [],
    name: 'CURRENT_CHAIN_ID',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'HUB_CHAIN_ID',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'activateNewFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'activeLoans',
    outputs: [
      {
        internalType: 'contract IERC721',
        name: 'nftContract',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'nftId',
        type: 'uint256',
      },
      {
        internalType: 'uint16',
        name: 'nftChainId',
        type: 'uint16',
      },
      {
        internalType: 'contract IERC20',
        name: 'repayToken',
        type: 'address',
      },
      {
        internalType: 'uint16',
        name: 'repayChainId',
        type: 'uint16',
      },
      {
        internalType: 'uint256',
        name: 'loanAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint32',
        name: 'loanInterestRate',
        type: 'uint32',
      },
      {
        internalType: 'uint256',
        name: 'loanDuration',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loanStart',
        type: 'uint256',
      },
      {
        internalType: 'enum LendeefiCore.LoanStatus',
        name: 'loanStatus',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'calculateFrom',
        type: 'uint256',
      },
    ],
    name: 'calculateFee',
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
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loanPrincipal',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalInterestAmountPaid',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interestRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loanDuration',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loanStartTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastAccrualTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentTimestamp',
        type: 'uint256',
      },
    ],
    name: 'closeNowEffectiveInterestRate',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'contractIdentifier',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'lender',
            type: 'address',
          },
          {
            internalType: 'contract IERC721',
            name: 'nftContract',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'nftId',
            type: 'uint256',
          },
          {
            internalType: 'uint16',
            name: 'nftChainId',
            type: 'uint16',
          },
          {
            internalType: 'uint256',
            name: 'offerExpiration',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'collectionOffer',
            type: 'bool',
          },
          {
            internalType: 'contract IERC20',
            name: 'lendToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'lendAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint16',
            name: 'lendChainId',
            type: 'uint16',
          },
          {
            internalType: 'uint32',
            name: 'interestRate',
            type: 'uint32',
          },
          {
            internalType: 'uint256',
            name: 'loanDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanNonce',
            type: 'uint256',
          },
        ],
        internalType: 'struct LendeefiCore.LoanInput',
        name: '_input',
        type: 'tuple',
      },
      {
        internalType: 'bytes32',
        name: 'root',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32[]',
        name: 'proofs',
        type: 'bytes32[]',
      },
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes',
      },
      {
        internalType: 'uint256[]',
        name: '_costs',
        type: 'uint256[]',
      },
    ],
    name: 'createLoan',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'root',
        type: 'bytes32',
      },
    ],
    name: 'deactivateRoot',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'deactivatedRootsByLender',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'loanHash',
        type: 'bytes32',
      },
      {
        internalType: 'uint256[]',
        name: '_costs',
        type: 'uint256[]',
      },
    ],
    name: 'defaultLoan',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'totalInterestAmountPaid',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalTimeElapsed',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loanPrincipal',
        type: 'uint256',
      },
    ],
    name: 'effectiveInterestRate',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeFrozenUntil',
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
  {
    inputs: [],
    name: 'feePortion',
    outputs: [
      {
        internalType: 'uint24',
        name: '',
        type: 'uint24',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'whFormatAddress',
        type: 'bytes32',
      },
    ],
    name: 'fromWormholeFormat',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'lender',
            type: 'address',
          },
          {
            internalType: 'contract IERC721',
            name: 'nftContract',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'nftId',
            type: 'uint256',
          },
          {
            internalType: 'uint16',
            name: 'nftChainId',
            type: 'uint16',
          },
          {
            internalType: 'uint256',
            name: 'offerExpiration',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'collectionOffer',
            type: 'bool',
          },
          {
            internalType: 'contract IERC20',
            name: 'lendToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'lendAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint16',
            name: 'lendChainId',
            type: 'uint16',
          },
          {
            internalType: 'uint32',
            name: 'interestRate',
            type: 'uint32',
          },
          {
            internalType: 'uint256',
            name: 'loanDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanNonce',
            type: 'uint256',
          },
        ],
        internalType: 'struct LendeefiCore.LoanInput',
        name: '_input',
        type: 'tuple',
      },
    ],
    name: 'generateHash',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interestRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loanDuration',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loanStartTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastAccrualTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentTimestamp',
        type: 'uint256',
      },
    ],
    name: 'getProratedInterestAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'interestAmountDue',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'newFeePortion',
    outputs: [
      {
        internalType: 'uint24',
        name: '',
        type: 'uint24',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'obligationReceipt',
    outputs: [
      {
        internalType: 'contract IObligationReceipt',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC721Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'promissoryNote',
    outputs: [
      {
        internalType: 'contract IPromissoryNote',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint24',
        name: 'proposedFee',
        type: 'uint24',
      },
    ],
    name: 'proposeNewFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'targetChain',
        type: 'uint16',
      },
      {
        internalType: 'uint256',
        name: 'gasLimit',
        type: 'uint256',
      },
    ],
    name: 'quoteCrossChainInit',
    outputs: [
      {
        internalType: 'uint256',
        name: 'cost',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'payload',
        type: 'bytes',
      },
      {
        internalType: 'bytes[]',
        name: '',
        type: 'bytes[]',
      },
      {
        internalType: 'bytes32',
        name: 'sourceAddress',
        type: 'bytes32',
      },
      {
        internalType: 'uint16',
        name: 'sourceChain',
        type: 'uint16',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'receiveWormholeMessages',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'loanHash',
        type: 'bytes32',
      },
      {
        internalType: 'uint256[]',
        name: '_costs',
        type: 'uint256[]',
      },
    ],
    name: 'repayLoan',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'chainId',
        type: 'uint16',
      },
      {
        internalType: 'address',
        name: 'source',
        type: 'address',
      },
    ],
    name: 'setAllowedSource',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: '_gasLimit',
        type: 'uint64',
      },
    ],
    name: 'setGasLimit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'valueContract',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'takeFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_signer',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '_claim',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes',
      },
    ],
    name: 'validateSignature',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'wormholeRelayer',
    outputs: [
      {
        internalType: 'contract IWormholeRelayer',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const abiNftCollection = [
  {
    inputs: [
      { internalType: 'string', name: '_uriPrefix', type: 'string' },
      { internalType: 'string', name: '_uriPostfix', type: 'string' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'ERC721EnumerableForbiddenBatchMint', type: 'error' },
  {
    inputs: [
      { internalType: 'address', name: 'sender', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'address', name: 'owner', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'approver', type: 'address' }],
    name: 'ERC721InvalidApprover',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'operator', type: 'address' }],
    name: 'ERC721InvalidOperator',
    type: 'error',
  },
  { inputs: [{ internalType: 'address', name: 'owner', type: 'address' }], name: 'ERC721InvalidOwner', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'receiver', type: 'address' }],
    name: 'ERC721InvalidReceiver',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'sender', type: 'address' }],
    name: 'ERC721InvalidSender',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'index', type: 'uint256' },
    ],
    name: 'ERC721OutOfBoundsIndex',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'approved', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'operator', type: 'address' },
      { indexed: false, internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'claim', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'index', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const abiWormholeProxy = [
  {
    inputs: [{ internalType: 'address', name: 'impl', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'previousAdmin', type: 'address' },
      { indexed: false, internalType: 'address', name: 'newAdmin', type: 'address' },
    ],
    name: 'AdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'address', name: 'beacon', type: 'address' }],
    name: 'BeaconUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'address', name: 'implementation', type: 'address' }],
    name: 'Upgraded',
    type: 'event',
  },
  { stateMutability: 'payable', type: 'fallback' },
  { stateMutability: 'payable', type: 'receive' },
];

export const abiWormhole = [
  {
    inputs: [{ internalType: 'address', name: 'wormhole', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [{ internalType: 'bytes', name: 'failure', type: 'bytes' }], name: 'ContractUpgradeFailed', type: 'error' },
  { inputs: [], name: 'DeliveryProviderCannotReceivePayment', type: 'error' },
  {
    inputs: [{ internalType: 'uint8', name: 'keyType', type: 'uint8' }],
    name: 'DeliveryProviderDoesNotSupportMessageKeyType',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'relayer', type: 'address' },
      { internalType: 'uint16', name: 'chainId', type: 'uint16' },
    ],
    name: 'DeliveryProviderDoesNotSupportTargetChain',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'hash', type: 'bytes32' }],
    name: 'GovernanceActionAlreadyConsumed',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'LocalNative', name: 'msgValue', type: 'uint256' },
      { internalType: 'LocalNative', name: 'minimum', type: 'uint256' },
    ],
    name: 'InsufficientRelayerFunds',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'defaultDeliveryProvider', type: 'bytes32' }],
    name: 'InvalidDefaultDeliveryProvider',
    type: 'error',
  },
  { inputs: [{ internalType: 'string', name: 'reason', type: 'string' }], name: 'InvalidDeliveryVaa', type: 'error' },
  {
    inputs: [
      { internalType: 'bytes32', name: 'emitter', type: 'bytes32' },
      { internalType: 'bytes32', name: 'registered', type: 'bytes32' },
      { internalType: 'uint16', name: 'chainId', type: 'uint16' },
    ],
    name: 'InvalidEmitter',
    type: 'error',
  },
  { inputs: [], name: 'InvalidFork', type: 'error' },
  {
    inputs: [
      { internalType: 'uint16', name: 'parsed', type: 'uint16' },
      { internalType: 'uint16', name: 'expected', type: 'uint16' },
    ],
    name: 'InvalidGovernanceChainId',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'parsed', type: 'bytes32' },
      { internalType: 'bytes32', name: 'expected', type: 'bytes32' },
    ],
    name: 'InvalidGovernanceContract',
    type: 'error',
  },
  { inputs: [{ internalType: 'string', name: 'reason', type: 'string' }], name: 'InvalidGovernanceVM', type: 'error' },
  {
    inputs: [
      { internalType: 'LocalNative', name: 'msgValue', type: 'uint256' },
      { internalType: 'LocalNative', name: 'totalFee', type: 'uint256' },
    ],
    name: 'InvalidMsgValue',
    type: 'error',
  },
  { inputs: [], name: 'InvalidOverrideGasLimit', type: 'error' },
  { inputs: [], name: 'InvalidOverrideReceiverValue', type: 'error' },
  {
    inputs: [
      { internalType: 'uint8', name: 'parsed', type: 'uint8' },
      { internalType: 'uint8', name: 'expected', type: 'uint8' },
    ],
    name: 'InvalidPayloadAction',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'parsed', type: 'uint16' },
      { internalType: 'uint16', name: 'expected', type: 'uint16' },
    ],
    name: 'InvalidPayloadChainId',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint8', name: 'parsed', type: 'uint8' },
      { internalType: 'uint8', name: 'expected', type: 'uint8' },
    ],
    name: 'InvalidPayloadId',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'received', type: 'uint256' },
      { internalType: 'uint256', name: 'expected', type: 'uint256' },
    ],
    name: 'InvalidPayloadLength',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'parsed', type: 'bytes32' },
      { internalType: 'bytes32', name: 'expected', type: 'bytes32' },
    ],
    name: 'InvalidPayloadModule',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'keys', type: 'uint256' },
      { internalType: 'uint256', name: 'vaas', type: 'uint256' },
    ],
    name: 'MessageKeysLengthDoesNotMatchMessagesLength',
    type: 'error',
  },
  { inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], name: 'NotAnEvmAddress', type: 'error' },
  {
    inputs: [
      { internalType: 'address', name: 'msgSender', type: 'address' },
      { internalType: 'address', name: 'lockedBy', type: 'address' },
    ],
    name: 'ReentrantDelivery',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'uint16', name: 'targetChain', type: 'uint16' }],
    name: 'TargetChainIsNotThisChain',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'numMessageKeys', type: 'uint256' }],
    name: 'TooManyMessageKeys',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint8', name: 'version', type: 'uint8' },
      { internalType: 'uint8', name: 'expectedVersion', type: 'uint8' },
    ],
    name: 'UnexpectedExecutionInfoVersion',
    type: 'error',
  },
  { inputs: [{ internalType: 'uint8', name: 'index', type: 'uint8' }], name: 'VaaKeysDoNotMatchVaas', type: 'error' },
  {
    inputs: [
      { internalType: 'uint8', name: 'instructionVersion', type: 'uint8' },
      { internalType: 'uint8', name: 'overrideVersion', type: 'uint8' },
    ],
    name: 'VersionMismatchOverride',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'previousAdmin', type: 'address' },
      { indexed: false, internalType: 'address', name: 'newAdmin', type: 'address' },
    ],
    name: 'AdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'address', name: 'beacon', type: 'address' }],
    name: 'BeaconUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'oldContract', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newContract', type: 'address' },
    ],
    name: 'ContractUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'recipientContract', type: 'address' },
      { indexed: true, internalType: 'uint16', name: 'sourceChain', type: 'uint16' },
      { indexed: true, internalType: 'uint64', name: 'sequence', type: 'uint64' },
      { indexed: false, internalType: 'bytes32', name: 'deliveryVaaHash', type: 'bytes32' },
      { indexed: false, internalType: 'enum IWormholeRelayerDelivery.DeliveryStatus', name: 'status', type: 'uint8' },
      { indexed: false, internalType: 'Gas', name: 'gasUsed', type: 'uint256' },
      {
        indexed: false,
        internalType: 'enum IWormholeRelayerDelivery.RefundStatus',
        name: 'refundStatus',
        type: 'uint8',
      },
      { indexed: false, internalType: 'bytes', name: 'additionalStatusInfo', type: 'bytes' },
      { indexed: false, internalType: 'bytes', name: 'overridesInfo', type: 'bytes' },
    ],
    name: 'Delivery',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint64', name: 'sequence', type: 'uint64' },
      { indexed: false, internalType: 'LocalNative', name: 'deliveryQuote', type: 'uint256' },
      { indexed: false, internalType: 'LocalNative', name: 'paymentForExtraReceiverValue', type: 'uint256' },
    ],
    name: 'SendEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'address', name: 'implementation', type: 'address' }],
    name: 'Upgraded',
    type: 'event',
  },
  { inputs: [], name: 'checkAndExecuteUpgradeMigration', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [
      { internalType: 'bytes[]', name: 'encodedVMs', type: 'bytes[]' },
      { internalType: 'bytes', name: 'encodedDeliveryVAA', type: 'bytes' },
      { internalType: 'address payable', name: 'relayerRefundAddress', type: 'address' },
      { internalType: 'bytes', name: 'deliveryOverrides', type: 'bytes' },
    ],
    name: 'deliver',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'deliveryHash', type: 'bytes32' }],
    name: 'deliveryAttempted',
    outputs: [{ internalType: 'bool', name: 'attempted', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'deliveryHash', type: 'bytes32' }],
    name: 'deliveryFailureBlock',
    outputs: [{ internalType: 'uint256', name: 'blockNumber', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'deliveryHash', type: 'bytes32' }],
    name: 'deliverySuccessBlock',
    outputs: [{ internalType: 'uint256', name: 'blockNumber', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'bytes32', name: 'targetAddress', type: 'bytes32' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
      { internalType: 'TargetNative', name: 'receiverValue', type: 'uint256' },
      { internalType: 'LocalNative', name: '', type: 'uint256' },
      { internalType: 'bytes', name: 'encodedExecutionParameters', type: 'bytes' },
      { internalType: 'uint16', name: 'refundChain', type: 'uint16' },
      { internalType: 'bytes32', name: 'refundAddress', type: 'bytes32' },
      { internalType: 'address', name: 'deliveryProviderAddress', type: 'address' },
      {
        components: [
          { internalType: 'uint16', name: 'chainId', type: 'uint16' },
          { internalType: 'bytes32', name: 'emitterAddress', type: 'bytes32' },
          { internalType: 'uint64', name: 'sequence', type: 'uint64' },
        ],
        internalType: 'struct VaaKey[]',
        name: 'vaaKeys',
        type: 'tuple[]',
      },
      { internalType: 'uint8', name: 'consistencyLevel', type: 'uint8' },
    ],
    name: 'forward',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'address', name: 'targetAddress', type: 'address' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
      { internalType: 'TargetNative', name: 'receiverValue', type: 'uint256' },
      { internalType: 'Gas', name: 'gasLimit', type: 'uint256' },
    ],
    name: 'forwardPayloadToEvm',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'address', name: 'targetAddress', type: 'address' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
      { internalType: 'TargetNative', name: 'receiverValue', type: 'uint256' },
      { internalType: 'LocalNative', name: 'paymentForExtraReceiverValue', type: 'uint256' },
      { internalType: 'Gas', name: 'gasLimit', type: 'uint256' },
      { internalType: 'uint16', name: 'refundChain', type: 'uint16' },
      { internalType: 'address', name: 'refundAddress', type: 'address' },
      { internalType: 'address', name: 'deliveryProviderAddress', type: 'address' },
      {
        components: [
          { internalType: 'uint16', name: 'chainId', type: 'uint16' },
          { internalType: 'bytes32', name: 'emitterAddress', type: 'bytes32' },
          { internalType: 'uint64', name: 'sequence', type: 'uint64' },
        ],
        internalType: 'struct VaaKey[]',
        name: 'vaaKeys',
        type: 'tuple[]',
      },
      { internalType: 'uint8', name: 'consistencyLevel', type: 'uint8' },
    ],
    name: 'forwardToEvm',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'address', name: 'targetAddress', type: 'address' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
      { internalType: 'TargetNative', name: 'receiverValue', type: 'uint256' },
      { internalType: 'Gas', name: 'gasLimit', type: 'uint256' },
      {
        components: [
          { internalType: 'uint16', name: 'chainId', type: 'uint16' },
          { internalType: 'bytes32', name: 'emitterAddress', type: 'bytes32' },
          { internalType: 'uint64', name: 'sequence', type: 'uint64' },
        ],
        internalType: 'struct VaaKey[]',
        name: 'vaaKeys',
        type: 'tuple[]',
      },
    ],
    name: 'forwardVaasToEvm',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDefaultDeliveryProvider',
    outputs: [{ internalType: 'address', name: 'deliveryProvider', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint16', name: 'chainId', type: 'uint16' }],
    name: 'getRegisteredWormholeRelayerContract',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'defaultDeliveryProvider', type: 'address' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'TargetNative', name: 'receiverValue', type: 'uint256' },
      { internalType: 'bytes', name: 'encodedExecutionParameters', type: 'bytes' },
      { internalType: 'address', name: 'deliveryProviderAddress', type: 'address' },
    ],
    name: 'quoteDeliveryPrice',
    outputs: [
      { internalType: 'LocalNative', name: 'nativePriceQuote', type: 'uint256' },
      { internalType: 'bytes', name: 'encodedExecutionInfo', type: 'bytes' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'TargetNative', name: 'receiverValue', type: 'uint256' },
      { internalType: 'Gas', name: 'gasLimit', type: 'uint256' },
      { internalType: 'address', name: 'deliveryProviderAddress', type: 'address' },
    ],
    name: 'quoteEVMDeliveryPrice',
    outputs: [
      { internalType: 'LocalNative', name: 'nativePriceQuote', type: 'uint256' },
      { internalType: 'GasPrice', name: 'targetChainRefundPerGasUnused', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'TargetNative', name: 'receiverValue', type: 'uint256' },
      { internalType: 'Gas', name: 'gasLimit', type: 'uint256' },
    ],
    name: 'quoteEVMDeliveryPrice',
    outputs: [
      { internalType: 'LocalNative', name: 'nativePriceQuote', type: 'uint256' },
      { internalType: 'GasPrice', name: 'targetChainRefundPerGasUnused', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'LocalNative', name: 'currentChainAmount', type: 'uint256' },
      { internalType: 'address', name: 'deliveryProviderAddress', type: 'address' },
    ],
    name: 'quoteNativeForChain',
    outputs: [{ internalType: 'TargetNative', name: 'targetChainAmount', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: 'encodedVm', type: 'bytes' }],
    name: 'registerWormholeRelayerContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'uint16', name: 'chainId', type: 'uint16' },
          { internalType: 'bytes32', name: 'emitterAddress', type: 'bytes32' },
          { internalType: 'uint64', name: 'sequence', type: 'uint64' },
        ],
        internalType: 'struct VaaKey',
        name: 'deliveryVaaKey',
        type: 'tuple',
      },
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'TargetNative', name: 'newReceiverValue', type: 'uint256' },
      { internalType: 'bytes', name: 'newEncodedExecutionParameters', type: 'bytes' },
      { internalType: 'address', name: 'newDeliveryProviderAddress', type: 'address' },
    ],
    name: 'resend',
    outputs: [{ internalType: 'uint64', name: 'sequence', type: 'uint64' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'uint16', name: 'chainId', type: 'uint16' },
          { internalType: 'bytes32', name: 'emitterAddress', type: 'bytes32' },
          { internalType: 'uint64', name: 'sequence', type: 'uint64' },
        ],
        internalType: 'struct VaaKey',
        name: 'deliveryVaaKey',
        type: 'tuple',
      },
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'TargetNative', name: 'newReceiverValue', type: 'uint256' },
      { internalType: 'Gas', name: 'newGasLimit', type: 'uint256' },
      { internalType: 'address', name: 'newDeliveryProviderAddress', type: 'address' },
    ],
    name: 'resendToEvm',
    outputs: [{ internalType: 'uint64', name: 'sequence', type: 'uint64' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'bytes32', name: 'targetAddress', type: 'bytes32' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
      { internalType: 'TargetNative', name: 'receiverValue', type: 'uint256' },
      { internalType: 'LocalNative', name: 'paymentForExtraReceiverValue', type: 'uint256' },
      { internalType: 'bytes', name: 'encodedExecutionParameters', type: 'bytes' },
      { internalType: 'uint16', name: 'refundChain', type: 'uint16' },
      { internalType: 'bytes32', name: 'refundAddress', type: 'bytes32' },
      { internalType: 'address', name: 'deliveryProviderAddress', type: 'address' },
      {
        components: [
          { internalType: 'uint16', name: 'chainId', type: 'uint16' },
          { internalType: 'bytes32', name: 'emitterAddress', type: 'bytes32' },
          { internalType: 'uint64', name: 'sequence', type: 'uint64' },
        ],
        internalType: 'struct VaaKey[]',
        name: 'vaaKeys',
        type: 'tuple[]',
      },
      { internalType: 'uint8', name: 'consistencyLevel', type: 'uint8' },
    ],
    name: 'send',
    outputs: [{ internalType: 'uint64', name: 'sequence', type: 'uint64' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'bytes32', name: 'targetAddress', type: 'bytes32' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
      { internalType: 'TargetNative', name: 'receiverValue', type: 'uint256' },
      { internalType: 'LocalNative', name: 'paymentForExtraReceiverValue', type: 'uint256' },
      { internalType: 'bytes', name: 'encodedExecutionParameters', type: 'bytes' },
      { internalType: 'uint16', name: 'refundChain', type: 'uint16' },
      { internalType: 'bytes32', name: 'refundAddress', type: 'bytes32' },
      { internalType: 'address', name: 'deliveryProviderAddress', type: 'address' },
      {
        components: [
          { internalType: 'uint8', name: 'keyType', type: 'uint8' },
          { internalType: 'bytes', name: 'encodedKey', type: 'bytes' },
        ],
        internalType: 'struct MessageKey[]',
        name: 'messageKeys',
        type: 'tuple[]',
      },
      { internalType: 'uint8', name: 'consistencyLevel', type: 'uint8' },
    ],
    name: 'send',
    outputs: [{ internalType: 'uint64', name: 'sequence', type: 'uint64' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'address', name: 'targetAddress', type: 'address' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
      { internalType: 'TargetNative', name: 'receiverValue', type: 'uint256' },
      { internalType: 'Gas', name: 'gasLimit', type: 'uint256' },
      { internalType: 'uint16', name: 'refundChain', type: 'uint16' },
      { internalType: 'address', name: 'refundAddress', type: 'address' },
    ],
    name: 'sendPayloadToEvm',
    outputs: [{ internalType: 'uint64', name: 'sequence', type: 'uint64' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'address', name: 'targetAddress', type: 'address' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
      { internalType: 'TargetNative', name: 'receiverValue', type: 'uint256' },
      { internalType: 'Gas', name: 'gasLimit', type: 'uint256' },
    ],
    name: 'sendPayloadToEvm',
    outputs: [{ internalType: 'uint64', name: 'sequence', type: 'uint64' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'address', name: 'targetAddress', type: 'address' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
      { internalType: 'TargetNative', name: 'receiverValue', type: 'uint256' },
      { internalType: 'LocalNative', name: 'paymentForExtraReceiverValue', type: 'uint256' },
      { internalType: 'Gas', name: 'gasLimit', type: 'uint256' },
      { internalType: 'uint16', name: 'refundChain', type: 'uint16' },
      { internalType: 'address', name: 'refundAddress', type: 'address' },
      { internalType: 'address', name: 'deliveryProviderAddress', type: 'address' },
      {
        components: [
          { internalType: 'uint16', name: 'chainId', type: 'uint16' },
          { internalType: 'bytes32', name: 'emitterAddress', type: 'bytes32' },
          { internalType: 'uint64', name: 'sequence', type: 'uint64' },
        ],
        internalType: 'struct VaaKey[]',
        name: 'vaaKeys',
        type: 'tuple[]',
      },
      { internalType: 'uint8', name: 'consistencyLevel', type: 'uint8' },
    ],
    name: 'sendToEvm',
    outputs: [{ internalType: 'uint64', name: 'sequence', type: 'uint64' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'address', name: 'targetAddress', type: 'address' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
      { internalType: 'TargetNative', name: 'receiverValue', type: 'uint256' },
      { internalType: 'LocalNative', name: 'paymentForExtraReceiverValue', type: 'uint256' },
      { internalType: 'Gas', name: 'gasLimit', type: 'uint256' },
      { internalType: 'uint16', name: 'refundChain', type: 'uint16' },
      { internalType: 'address', name: 'refundAddress', type: 'address' },
      { internalType: 'address', name: 'deliveryProviderAddress', type: 'address' },
      {
        components: [
          { internalType: 'uint8', name: 'keyType', type: 'uint8' },
          { internalType: 'bytes', name: 'encodedKey', type: 'bytes' },
        ],
        internalType: 'struct MessageKey[]',
        name: 'messageKeys',
        type: 'tuple[]',
      },
      { internalType: 'uint8', name: 'consistencyLevel', type: 'uint8' },
    ],
    name: 'sendToEvm',
    outputs: [{ internalType: 'uint64', name: 'sequence', type: 'uint64' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'address', name: 'targetAddress', type: 'address' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
      { internalType: 'TargetNative', name: 'receiverValue', type: 'uint256' },
      { internalType: 'Gas', name: 'gasLimit', type: 'uint256' },
      {
        components: [
          { internalType: 'uint16', name: 'chainId', type: 'uint16' },
          { internalType: 'bytes32', name: 'emitterAddress', type: 'bytes32' },
          { internalType: 'uint64', name: 'sequence', type: 'uint64' },
        ],
        internalType: 'struct VaaKey[]',
        name: 'vaaKeys',
        type: 'tuple[]',
      },
    ],
    name: 'sendVaasToEvm',
    outputs: [{ internalType: 'uint64', name: 'sequence', type: 'uint64' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: 'targetChain', type: 'uint16' },
      { internalType: 'address', name: 'targetAddress', type: 'address' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
      { internalType: 'TargetNative', name: 'receiverValue', type: 'uint256' },
      { internalType: 'Gas', name: 'gasLimit', type: 'uint256' },
      {
        components: [
          { internalType: 'uint16', name: 'chainId', type: 'uint16' },
          { internalType: 'bytes32', name: 'emitterAddress', type: 'bytes32' },
          { internalType: 'uint64', name: 'sequence', type: 'uint64' },
        ],
        internalType: 'struct VaaKey[]',
        name: 'vaaKeys',
        type: 'tuple[]',
      },
      { internalType: 'uint16', name: 'refundChain', type: 'uint16' },
      { internalType: 'address', name: 'refundAddress', type: 'address' },
    ],
    name: 'sendVaasToEvm',
    outputs: [{ internalType: 'uint64', name: 'sequence', type: 'uint64' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: 'encodedVm', type: 'bytes' }],
    name: 'setDefaultDeliveryProvider',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: 'encodedVm', type: 'bytes' }],
    name: 'submitContractUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
