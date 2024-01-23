let WALLET_CONNECTED = "";
let contractAddress = "0x40cD66052baf0B3117F2f55C46C8649A70833aa9";
let contractAbi = [
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "_candidateNames",
        "type": "string[]"
      },
      {
        "internalType": "uint256",
        "name": "_durationInMinutes",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "voteCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllVotesOfCandiates",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "voteCount",
            "type": "uint256"
          }
        ],
        "internalType": "struct Voting.Candidate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRemainingTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateIndex",
        "type": "uint256"
      }
    ],
    "name": "getVotesOfCandiate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVotingStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateIndex",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "voters",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "votingEnd",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "votingStart",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

function navigateToPage(url) {
  window.location.href = url;
}


const connectMetamask = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  WALLET_CONNECTED = await signer.getAddress();
  // var element = document.getElementById("metamasknotification");
  // element.innerHTML = "Metamask is connected " + WALLET_CONNECTED; 
  const para = document.createElement("p");
  const node = document.createTextNode(WALLET_CONNECTED);
  para.appendChild(node);
  const element = document.getElementById("header");
  element.appendChild(para);
  document.getElementById("button").remove();
  getAllCandidates();
}

const voteForCandidate = async (candidateID) => {
  if (WALLET_CONNECTED != 0) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    const tx = await contractInstance.vote(candidateID);
    await tx.wait();
  }
  else {
    console.log("Vote was not casted. Please try again!");
  }
};



const updateRemainingTime = async () => {
  if (WALLET_CONNECTED != 0) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    const remainingTimeElement = document.getElementById("remainingTime");
    const remaining = document.getElementById("remaining");
    const remainingTimeInSeconds = await contractInstance.getRemainingTime();
    // console.log(remainingTimeInSeconds);

    remainingTimeElement.textContent = formatRemainingTime(remainingTimeInSeconds);
    remaining.textContent = "Remaining";
  }
}
const formatRemainingTime = (timeInSeconds) => {
  const days = Math.floor(timeInSeconds / (3600 * 24));
  const hours = Math.floor((timeInSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);

  return `${days}d ${hours}h ${minutes}m`;

}

const getAllCandidates = async () => {
  if (WALLET_CONNECTED != 0) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    const candidates = await contractInstance.getAllVotesOfCandiates();

    const cardContainer = document.querySelector(".card-container");

    candidates.forEach((candidate, index) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const candidateName = document.createElement("h3");
      candidateName.textContent = candidate.name;

      const voteCount = document.createElement("p");
      voteCount.textContent = `Votes: ${candidate.voteCount}`;

      const voteButton = document.createElement("button");
      voteButton.textContent = "Vote";
      voteButton.classList.add("vote-btn");
      voteButton.addEventListener("click",async () => {
        let voted = await voteForCandidate(index);
        if (voted) {
          document.getElementById("finish").innerText = "Voted for candidate with ID: " + candidateID;
        } else {
          document.getElementById("finish").innerText = "Please select a candidate to vote.";
        }
       
      });

      card.appendChild(candidateName);
      card.appendChild(voteCount);
      card.appendChild(voteButton);

      cardContainer.appendChild(card);
    });
  }
};
updateRemainingTime();
setInterval(updateRemainingTime, 1000);