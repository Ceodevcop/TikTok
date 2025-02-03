// Load configuration from config.json
fetch('config.json')
    .then(response => response.json())
    .then(config => {
        // Initialize Monnify payment
        window.payWithMonnify = function () {
            const amount = document.getElementById('amount').value;
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const description = document.getElementById('description').value;

            if (!amount || !fullName || !email || !description) {
                showMessage("Please fill in all fields.", "error");
                return;
            }

            MonnifySDK.initialize({
                amount: parseFloat(amount),
                currency: config.CURRENCY,
                reference: `ref-${Date.now()}`,
                customerFullName: fullName,
                customerEmail: email,
                apiKey: config.API_KEY,
                contractCode: config.CONTRACT_CODE,
                paymentDescription: description,
                paymentMethods: config.PAYMENT_METHODS,
                metadata: config.METADATA,
                onLoadStart: () => showMessage("Loading payment gateway..."),
                onLoadComplete: () => console.log("Monnify SDK loaded"),
                onComplete: (response) => {
                    if (response.paymentStatus === "PAID") {
                        showMessage(`Payment successful! Transaction ID: ${response.transactionReference}`, "success");
                    }
                },
                onClose: (data) => {
                    if (data.responseCode === "USER_CANCELLED") {
                        showMessage("Payment cancelled by user", "error");
                    }
                }
            });
        };

        // Function to display messages
        window.showMessage = function (text, type = "info") {
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = text;
            messageDiv.className = `message ${type === 'error' ? 'error' : 'success'}`;

            // Clear message after 5 seconds
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'message';
            }, 5000);
        };
    })
    .catch(error => {
        console.error("Failed to load configuration:", error);
    });
