export default function handler(req, res) {
    // Handle POST requests
    if (req.method === 'POST') {
        const data = req.body; // Access the data sent in the request

        // Example: Log the received data (you can replace this with saving logic)
        console.log('Received character data:', data);

        if (data) {
            // Send a success response
            res.status(200).json({ status: 'success', message: 'Character saved successfully!' });
        } else {
            // Handle error case
            res.status(400).json({ status: 'error', message: 'Failed to save character data.' });
        }
    } else {
        // Respond with an error if the method is not POST
        res.status(405).json({ status: 'error', message: 'Method Not Allowed.' });
    }
}
