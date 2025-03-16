require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    try {
        const { customerId } = JSON.parse(event.body);

        if (!customerId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing customerId' }),
            };
        }

        // Fetch the customer’s subscriptions
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
        });

        const isPremium = subscriptions.data.length > 0;

        return {
            statusCode: 200,
            body: JSON.stringify({ isPremium }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};