require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    try {
        const { sessionId } = JSON.parse(event.body);

        if (!sessionId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing sessionId' }),
            };
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        return {
            statusCode: 200,
            body: JSON.stringify({ customerId: session.customer }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};