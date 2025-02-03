// Monnify API credentials
const apiKey = 'MK_TEST_U7KS6AM684'; // Replace with your API Key
const secretKey = 'FCAHPT9PR3SZFVC51NE63M33517PDXES'; // Replace with your Secret Key
const baseUrl = 'https://sandbox.monnify.com'; // Replace with live URL if needed
const contractCode = 'YOUR_CONTRACT_CODE'; // Replace with your contract code

// Function to generate Basic Auth token
function generateAuthToken() {
    const token = btoa(`${apiKey}:${secretKey}`);
    return `Basic ${token}`;
}

// Function to create a mandate
async function createMandate(event) {
    event.preventDefault();

    const accountName = document.getElementById('accountName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const bvn = document.getElementById('bvn').value;
    const bankCode = document.getElementById('bankCode').value;
    const accountNumber = document.getElementById('accountNumber').value;

    const authToken = generateAuthToken();
    const endpoint = `${baseUrl}/api/v1/merchant/subaccounts`;

    const mandateData = {
        accountReference: "ref_" + Math.random().toString(36).substring(7),
        accountName: accountName,
        currencyCode: "NGN",
        contractCode: contractCode,
        customerEmail: customerEmail,
        customerName: accountName,
        bvn: bvn,
        bankCode: bankCode,
        accountNumber: accountNumber,
    };

    try {
        const response = await axios.post(endpoint, mandateData, {
            headers: {
                'Authorization': authToken,
                'Content-Type': 'application/json'
            }
        });

        showMessage('Mandate created successfully!', 'success');
        console.log('Mandate Created:', response.data);
    } catch (error) {
        showMessage(`Error creating mandate: ${error.response ? error.response.data.responseMessage : error.message}`, 'error');
        console.error('Error creating mandate:', error.response ? error.response.data : error.message);
    }
}

// Function to get mandate status
async function getMandateStatus(accountReference) {
    const authToken = generateAuthToken();
    const endpoint = `${baseUrl}/api/v1/merchant/subaccounts/${accountReference}`;

    try {
        const response = await axios.get(endpoint, {
            headers: {
                'Authorization': authToken,
                'Content-Type': 'application/json'
            }
        });

        console.log('Mandate Status:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching mandate status:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Function to debit a mandate
async function debitMandate(accountReference, amount) {
    const authToken = generateAuthToken();
    const endpoint = `${baseUrl}/api/v1/merchant/transactions/init-transaction`;

    const debitData = {
        amount: amount, // Amount in kobo
        customerName: "John Doe",
        customerEmail: "johndoe@example.com",
        paymentReference: "ref_" + Math.random().toString(36).substring(7), // Unique reference
        paymentDescription: "Mandate Debit",
        currencyCode: "NGN",
        redirectUrl: "https://yourwebsite.com/payment-callback",
        accountReference: accountReference, // Reference of the mandate
    };

    try {
        const response = await axios.post(endpoint, debitData, {
            headers: {
                'Authorization': authToken,
                'Content-Type': 'application/json'
            }
        });

        console.log('Debit Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error debiting mandate:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Function to get debit status
async function getDebitStatus(paymentReference) {
    const authToken = generateAuthToken();
    const endpoint = `${baseUrl}/api/v1/merchant/transactions/query/${paymentReference}`;

    try {
        const response = await axios.get(endpoint, {
            headers: {
                'Authorization': authToken,
                'Content-Type': 'application/json'
            }
        });

        console.log('Debit Status:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching debit status:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Function to update (cancel) a mandate
async function updateMandate(accountReference, status) {
    const authToken = generateAuthToken();
    const endpoint = `${baseUrl}/api/v1/merchant/subaccounts/${accountReference}`;

    const updateData = {
        status: status, // "INACTIVE" to cancel the mandate
    };

    try {
        const response = await axios.put(endpoint, updateData, {
            headers: {
                'Authorization': authToken,
                'Content-Type': 'application/json'
            }
        });

        console.log('Mandate Updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating mandate:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Function to display messages
function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.style.color = type === 'error' ? 'red' : 'green';
}

// Attach form submission handler
document.getElementById('mandateForm').addEventListener('submit', createMandate);
