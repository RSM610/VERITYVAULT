# VerityVault - Blockchain Document Verification System

## Overview

VerityVault is a blockchain-based platform designed to securely verify and store documents, ensuring authenticity and immutability for academic certificates, legal documents, and other critical records. Each document is assigned a unique digital ID recorded on the Ethereum blockchain (Sepolia Testnet). Users can scan a document's QR code or enter its ID to verify its authenticity, combating document fraud and fostering trust.

## Features

- Secure login system with role-based authentication (Administrator, Issuer, Verifier, User)
- Document upload and storage with blockchain integration
- QR code generation and scanning for document verification
- Wallet integration (MetaMask) for blockchain transactions
- Profile management for authorised users
- Document update functionality for authorised users
- Admin tools for account management

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js (Express)
- **Blockchain**: Ethereum (Solidity, Sepolia Testnet)
- **Database**: PostgreSQL
- **Version Control**: GitHub, IntelliJ IDE
- **Project Management**: Jira
- **Wallet**: MetaMask

## Prerequisites

- Node.js (&gt;= 16.x)
- PostgreSQL (&gt;= 13.x)
- MetaMask browser extension
- Ethereum client (e.g., Sepolia Testnet via Infura or Alchemy)
- Git
- Camera-enabled device for QR code scanning

## Installation

1. **Clone the Repository**:

   ```bash
   gh repo clone RSM610/VERITYVAULT
   ```

2. **Install Dependencies**:

   - Backend:

     ```bash
     cd .\pookie-backend-node\  
     npm i
     
     ```
   - Frontend:

     ```bash
     cd .\pookie-frontend-react\
     npm i
   
     ```


3. **Initialize the Database**:

   - Run the SQL schema scripts to set up tables:

     ```sql
     CREATE TABLE public.auth (
         username VARCHAR(50) NOT NULL,
         password VARCHAR(50) NOT NULL,
         id SERIAL,
         role VARCHAR(50) NOT NULL,
         PRIMARY KEY (id, username)
     );
     
     CREATE TABLE public.profile (
         name VARCHAR(50),
         description VARCHAR(500),
         username VARCHAR(50) NOT NULL,
         website VARCHAR,
         location VARCHAR(50),
         image VARCHAR(50),
         role VARCHAR(50),
         id SERIAL PRIMARY KEY
     );
     
     CREATE TABLE public.document (
         documentId VARCHAR(50) NOT NULL PRIMARY KEY,
         name VARCHAR(50),
         documentHash VARCHAR(100)
     );
     ```


4. **Start the Application**:

   - Backend:

     ```bash
     cd .\pookie-backend-node\  
     node postgres.js
     ```
   - Frontend:

     ```bash
      cd .\pookie-frontend-react\
     npm start
     ```

## Usage

### Normal User (Unauthorised)

1. Scan a document's QR code using a camera-enabled device.
2. Connect your MetaMask wallet to view document details and verify authenticity.
3. Complete the wallet connection process.

### Authorised User (General)

1. Log in to the system with your credentials.
2. Connect your MetaMask wallet.
3. Check your profile details.
4. Scan a document's QR code to view its details.
5. Update documents if permitted by your role.

### Administrator (Authorised)

1. Log in with admin credentials.
2. Add new accounts for users, issuers, or verifiers.
3. Manage existing accounts (e.g., update roles, deactivate accounts).

### Issuer (Authorised)

1. Log in with issuer credentials.
2. Connect your MetaMask wallet.
3. Add a document to the blockchain by uploading it.
4. Pay the transaction fees via MetaMask.
5. Download the generated QR code for the document.
6. Log out when finished.

### Verifier (Authorised)

1. Log in sustains
2. Connect your MetaMask wallet.
3. Check your profile details.
4. Scan a document's QR code to view its details and verify authenticity.

## Project Structure

```
university-portal/
├── backend/                # Node.js/Express server and API logic
├── blockchain/             # Solidity smart contracts
├── frontend/               # React.js frontend
├── db/                     # Database schemas
└── README.md
```

## Challenges Faced

- Navigating Jira for project management
- Camera lag during QR code scanning
- Using deprecated blockchain library documentation, requiring older, less secure versions
- Variable refactoring for consistent naming conventions
- Initial difficulties connecting to the Sepolia Testnet
- Acquiring initial Sepolia Ethereum for transactions

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For issues or inquiries, please open a ticket on our GitHub Issues page.

## Acknowledgments

- Faculty of Cyber Security, Ghulam Ishaq Khan Institute
- Team Members: Rida Shahid Malik, Ummama Khan
- Supervisor: Sir Said Nabi
