// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract VerityVault {
    address public owner;

    constructor() {
        owner = msg.sender;

        // Create default admin user
        users["admin"] = User({
            username: "admin",
            role: "admin",
            isActive: true
        });

        emit UserRegistered("admin", "admin");
    }

    // Modifier to restrict certain functions to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // User struct matching the auth and profile tables
    struct User {
        string username;
        string role;     // admin, issuer, verifier, user
        bool isActive;
    }

    // Document struct matching the document table
    struct Document {
        string documentId;
        string name;
        string documentHash;
        uint256 timestamp;
        string issuer;   // username of the document issuer
    }

    // DocumentVerification struct for tracking verifications
    struct DocumentVerification {
        uint id;
        string documentId;
        string verifier;  // username of verifier
        uint256 timestamp;
        bool isVerified;
    }

    // DocumentHistory struct for tracking changes
    struct DocumentHistory {
        uint id;
        string documentId;
        string username;   // who made the change
        string prevHash;
        string newHash;
        uint256 timestamp;
    }

    // Store users by username
    mapping(string => User) public users;

    // Store documents by documentId
    mapping(string => Document) public documents;

    // Store document verifications
    mapping(string => DocumentVerification[]) public documentVerifications;

    // Store document histories
    mapping(string => DocumentHistory[]) public documentHistories;

    // Counter for verification and history IDs
    mapping(string => uint) public verificationCounter;
    mapping(string => uint) public historyCounter;

    // Events for off-chain listening
    event UserRegistered(string username, string role);
    event DocumentRegistered(string documentId, string name, string documentHash, string issuer);
    event DocumentVerified(string documentId, string verifier, bool isVerified);
    event DocumentHashUpdated(string documentId, string username, string prevHash, string newHash);

    // Register a new user
    function registerUser(string memory _username, string memory _role) public {
        // Check if user already exists
        require(bytes(users[_username].username).length == 0, "User already exists");

        // Create new user
        users[_username] = User({
            username: _username,
            role: _role,
            isActive: true
        });

        emit UserRegistered(_username, _role);
    }

    // Register a new document
    function registerDocument(string memory _documentId, string memory _name, string memory _documentHash, string memory _issuer) public {
        // Check if document already exists
        require(bytes(documents[_documentId].documentId).length == 0, "Document already exists");

        // Check if issuer exists and has issuer role
        require(bytes(users[_issuer].username).length > 0, "Issuer does not exist");
        require(keccak256(bytes(users[_issuer].role)) == keccak256(bytes("issuer")) ||
        keccak256(bytes(users[_issuer].role)) == keccak256(bytes("admin")),
            "User is not authorized to issue documents");

        // Create new document
        documents[_documentId] = Document({
            documentId: _documentId,
            name: _name,
            documentHash: _documentHash,
            timestamp: block.timestamp,
            issuer: _issuer
        });

        // Initialize counters
        verificationCounter[_documentId] = 0;
        historyCounter[_documentId] = 0;

        // Add first history entry
        _addDocumentHistory(_documentId, _issuer, "", _documentHash);

        emit DocumentRegistered(_documentId, _name, _documentHash, _issuer);
    }

    // Update document hash
    function updateDocumentHash(string memory _documentId, string memory _username, string memory _newHash) public {
        // Check if document exists
        require(bytes(documents[_documentId].documentId).length > 0, "Document does not exist");

        // Check if user exists and has issuer role or is the original issuer
        require(bytes(users[_username].username).length > 0, "User does not exist");
        require(keccak256(bytes(users[_username].role)) == keccak256(bytes("issuer")) ||
        keccak256(bytes(users[_username].role)) == keccak256(bytes("admin")) ||
        keccak256(bytes(documents[_documentId].issuer)) == keccak256(bytes(_username)),
            "User is not authorized to update document");

        // Store the previous hash
        string memory prevHash = documents[_documentId].documentHash;

        // Update document hash
        documents[_documentId].documentHash = _newHash;
        documents[_documentId].timestamp = block.timestamp;

        // Add history entry
        _addDocumentHistory(_documentId, _username, prevHash, _newHash);

        emit DocumentHashUpdated(_documentId, _username, prevHash, _newHash);
    }

    // Internal function to add document history
    function _addDocumentHistory(string memory _documentId, string memory _username, string memory _prevHash, string memory _newHash) internal {
        // Increment history counter
        historyCounter[_documentId]++;

        // Create history entry
        DocumentHistory memory history = DocumentHistory({
            id: historyCounter[_documentId],
            documentId: _documentId,
            username: _username,
            prevHash: _prevHash,
            newHash: _newHash,
            timestamp: block.timestamp
        });

        // Add to histories
        documentHistories[_documentId].push(history);

        console.log("Document History added - ID: %s, User: %s", historyCounter[_documentId], _username);
    }

    // Verify a document
    function verifyDocument(string memory _documentId, string memory _verifier, bool _isVerified) public {
        // Check if document exists
        require(bytes(documents[_documentId].documentId).length > 0, "Document does not exist");

        // Check if verifier exists and has verifier role
        require(bytes(users[_verifier].username).length > 0, "Verifier does not exist");
        require(keccak256(bytes(users[_verifier].role)) == keccak256(bytes("verifier")) ||
        keccak256(bytes(users[_verifier].role)) == keccak256(bytes("admin")),
            "User is not authorized to verify documents");

        // Increment verification counter
        verificationCounter[_documentId]++;

        // Create verification entry
        DocumentVerification memory verification = DocumentVerification({
            id: verificationCounter[_documentId],
            documentId: _documentId,
            verifier: _verifier,
            timestamp: block.timestamp,
            isVerified: _isVerified
        });

        // Add to verifications
        documentVerifications[_documentId].push(verification);

        emit DocumentVerified(_documentId, _verifier, _isVerified);
    }

    // Get document information
    function getDocument(string memory _documentId) public view returns (
        string memory, // documentId
        string memory, // name
        string memory, // documentHash
        uint256,       // timestamp
        string memory  // issuer
    ) {
        require(bytes(documents[_documentId].documentId).length > 0, "Document does not exist");
        Document memory doc = documents[_documentId];
        return (doc.documentId, doc.name, doc.documentHash, doc.timestamp, doc.issuer);
    }

    // Get document history count
    function getDocumentHistoryCount(string memory _documentId) public view returns (uint) {
        return documentHistories[_documentId].length;
    }

    // Get document verification count
    function getDocumentVerificationCount(string memory _documentId) public view returns (uint) {
        return documentVerifications[_documentId].length;
    }

    // Get document history at index
    function getDocumentHistoryAtIndex(string memory _documentId, uint _index) public view returns (
        uint, // id
        string memory, // documentId
        string memory, // username
        string memory, // prevHash
        string memory, // newHash
        uint256 // timestamp
    ) {
        require(_index < documentHistories[_documentId].length, "Index out of bounds");
        DocumentHistory memory history = documentHistories[_documentId][_index];
        return (history.id, history.documentId, history.username, history.prevHash, history.newHash, history.timestamp);
    }

    // Get document verification at index
    function getDocumentVerificationAtIndex(string memory _documentId, uint _index) public view returns (
        uint, // id
        string memory, // documentId
        string memory, // verifier
        uint256, // timestamp
        bool // isVerified
    ) {
        require(_index < documentVerifications[_documentId].length, "Index out of bounds");
        DocumentVerification memory verification = documentVerifications[_documentId][_index];
        return (verification.id, verification.documentId, verification.verifier, verification.timestamp, verification.isVerified);
    }

    // Check if a document has been verified by a specific verifier
    function isDocumentVerifiedBy(string memory _documentId, string memory _verifier) public view returns (bool) {
        for(uint i = 0; i < documentVerifications[_documentId].length; i++) {
            if(keccak256(bytes(documentVerifications[_documentId][i].verifier)) == keccak256(bytes(_verifier))) {
                return documentVerifications[_documentId][i].isVerified;
            }
        }
        return false;
    }

    // Check if a document hash matches the stored hash
    function verifyDocumentHash(string memory _documentId, string memory _hash) public view returns (bool) {
        if(bytes(documents[_documentId].documentId).length == 0) {
            return false;
        }
        return keccak256(bytes(documents[_documentId].documentHash)) == keccak256(bytes(_hash));
    }
}