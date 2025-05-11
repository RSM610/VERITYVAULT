const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client } = require('pg')
const path = require('path');
const multer = require('multer');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "earlgraytea56",
    database: "verityvault-postgres-database"
})

client.connect()


async function ensureAdminExists() {
    try {
        // Check if admin user exists
        const adminCheck = await client.query('SELECT * FROM auth WHERE username = $1', ['admin']);

        if (adminCheck.rows.length === 0) {
            // Admin doesn't exist, create it
            await client.query('INSERT INTO auth (username, password, role) VALUES ($1, $2, $3)',
                ['admin', 'admin', 'admin']);
            console.log('Default admin user created');

            // Create admin profile
            await client.query('INSERT INTO profile (username, name, description, role) VALUES ($1, $2, $3, $4)',
                ['admin', 'System Administrator', 'Default system administrator account', 'admin']);
            console.log('Default admin profile created');
        } else {
            console.log('Admin user already exists');
        }
    } catch (err) {
        console.error('Error ensuring admin exists:', err.message);
    }
}

// Call this function after database connection is established
client.connect().then(() => {
    console.log('Connected to database');
    ensureAdminExists();

    // Start the server after ensuring admin exists
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(err => {
    console.error('Error connecting to database:', err.message);
});
// ======================
// AUTH FUNCTIONS
// ======================

function createAccount(username, password, role){
    const res = client.query('INSERT INTO auth (username, password, role) VALUES ($1, $2, $3)', [username, password, role], (err, res)=>{
        if(err){
            console.log(err.message);
        }else{
            console.log('Authentication data inserted successfully');
        }
    })
}

function changePassword(username, password){
    const res = client.query('UPDATE auth SET password = $1 WHERE username = $2', [password, username], (err, res)=>{
        if(err){
            console.log(err.message);
        }else{
            console.log('Password updated successfully');
        }
    })
}

// ======================
// PROFILE FUNCTIONS
// ======================

function createProfile(username, name, description, website, location, image, role){
    client.query('INSERT INTO profile (username, name, description, website, location, image, role) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [username, name, description, website, location, image, role], (err, res)=>{
            if(err){
                console.log(err.message);
            }else{
                console.log('Profile data inserted successfully');
            }
        })
}

function updateProfile(username, name, description, website, location, image){
    client.query('UPDATE profile SET name = $1, description = $2, website = $3, location = $4, image = $5 WHERE username = $6',
        [name, description, website, location, image, username], (err, res)=>{
            if(err){
                console.log(err.message);
            }else{
                console.log('Profile data updated successfully');
            }
        })
}

// ======================
// DOCUMENT FUNCTIONS
// ======================

function addDocument(documentId, name, documentHash){
    client.query('INSERT INTO document (documentId, name, documentHash) VALUES ($1, $2, $3)',
        [documentId, name, documentHash], (err, res)=>{
            if(err){
                console.log(err.message);
            }else{
                console.log('Document data inserted successfully');
            }
        })
}

function updateDocumentHash(documentId, documentHash){
    client.query('UPDATE document SET documentHash = $1 WHERE documentId = $2',
        [documentHash, documentId], (err, res)=>{
            if(err){
                console.log(err.message);
            }else{
                console.log('Document hash updated successfully');
            }
        })
}

// ======================
// STORAGE CONFIGURATIONS
// ======================

const storageDocument = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads/document'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const storageProfile = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads/profile'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

// ======================
// AUTH ROUTES
// ======================

app.get('/authAll', async (req, res) => {
    const data = await client.query('SELECT * FROM auth');
    res.header('Access-Control-Allow-Credentials', true);
    res.send(data.rows);
    console.log("Auth data sent successfully");
});

app.post('/auth/:username/:password', async (req, res) => {
    const {username, password} = req.params;
    // Warning: This is vulnerable to SQL injection. Use parameterized queries instead
    const data = await client.query(`SELECT * FROM auth WHERE username = '${username}' AND password = '${password}'`);
    res.send(data.rows);
    console.log("Auth verification data sent successfully");
});

app.post('/addaccount', (req, res) => {
    const {username, password, role} = req.body;
    createAccount(username, password, role);
    res.send('Account created successfully');
});

app.post('/changepsw', (req, res) => {
    const {username, password} = req.body;
    changePassword(username, password);
    res.send('Password updated successfully');
});

// ======================
// PROFILE ROUTES
// ======================

app.get('/profileAll', async (req, res) => {
    const data = await client.query('SELECT * FROM profile');
    res.header('Access-Control-Allow-Credentials', true);
    res.send(data.rows);
    console.log("All profile data sent successfully");
});

app.get('/profile/:username', async (req, res) => {
    const {username} = req.params;
    // Warning: This is vulnerable to SQL injection. Use parameterized queries instead
    const data = await client.query(`SELECT * FROM profile WHERE username = '${username}'`);
    res.send(data.rows);
    console.log("Profile data sent successfully");
});

app.post('/addprofile', (req, res) => {
    const {username, name, description, website, location, image, role} = req.body;
    createProfile(username, name, description, website, location, image, role);
    res.send('Profile created successfully');
});

app.put('/updateprofile', (req, res) => {
    const {username, name, description, website, location, image} = req.body;
    updateProfile(username, name, description, website, location, image);
    res.send('Profile updated successfully');
});

// ======================
// DOCUMENT ROUTES
// ======================

app.get('/documentAll', async (req, res) => {
    const data = await client.query('SELECT * FROM document');
    res.header('Access-Control-Allow-Credentials', true);
    res.send(data.rows);
    console.log("All document data sent successfully");
});

app.get('/document/:documentId', async (req, res) => {
    const {documentId} = req.params;
    const data = await client.query('SELECT * FROM document WHERE documentId = $1', [documentId]);
    res.send(data.rows);
    console.log("Document data sent successfully");
});

app.post('/adddocument', (req, res) => {
    const {documentId, name, documentHash} = req.body;
    addDocument(documentId, name, documentHash);
    res.send('Document added successfully');
});

app.put('/updatedocumenthash', (req, res) => {
    const {documentId, documentHash} = req.body;
    updateDocumentHash(documentId, documentHash);
    res.send('Document hash updated successfully');
});

// ======================
// FILE UPLOAD ROUTES
// ======================

app.post('/upload/profile', (req, res) => {
    let upload = multer({ storage: storageProfile }).single('image');

    upload(req, res, (err) => {
        if(!req.file){
            return res.send('Please select an image to upload');
        } else if (err instanceof multer.MulterError){
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }
        return res.send('Profile image uploaded successfully');
    });
});

app.post('/upload/document', (req, res) => {
    let upload = multer({ storage: storageDocument }).single('file');

    upload(req, res, (err) => {
        if(!req.file){
            return res.send('Please select a document to upload');
        } else if (err instanceof multer.MulterError){
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }
        return res.send('Document uploaded successfully');
    });
});

// ======================
// FILE ACCESS ROUTES
// ======================

app.get('/file/profile/:fileName', function (req, res) {
    const {fileName} = req.params;
    const filePath = path.join(__dirname, 'public/uploads/profile', fileName);
    res.sendFile(filePath);
});

app.get('/file/document/:fileName', function (req, res) {
    const {fileName} = req.params;
    const filePath = path.join(__dirname, 'public/uploads/document', fileName);
    res.sendFile(filePath);
});



// ======================
// SERVER INITIALIZATION
// ======================

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
