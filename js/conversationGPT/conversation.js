// Import required dependencies
import chalk from 'chalk';
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

// Set your OpenAI API key\
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Define the personalities
const personality1 = 'Albert Einstein';
const personality2 = 'William Shakespeare';

// Set the number of rounds for the conversation
const numberOfRounds = 3;

// The topic or question provided as a command-line argument
const conversationTopic = process.argv[2];

// Initialize the conversation with a system message and the conversation topic
const conversationHistory = [
    {
        role: 'system',
        content: `You are a helpful assistant that speaks like ${personality1}.`,
    },
    {
        role: 'system',
        content: `You are a helpful assistant that speaks like ${personality2}.`,
    },
    {
        role: 'user',
        content: conversationTopic,
    },
];

// Function to send a message to the OpenAI API
async function sendMessage(content, role) {
    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        prompt: {
            role,
            content,
            messages: conversationHistory,
        },
        temperature: 0.7,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    return response.choices[0].text;
}

// Function to simulate the conversation between the two personalities
async function simulateConversation() {
    for (let i = 0; i < numberOfRounds * 2; i++) {
        const role = i % 2 === 0 ? personality1 : personality2;

        const message = await sendMessage(conversationTopic, role);
        conversationHistory.push({ role, content: message });

        const coloredMessage = role === personality1 ? chalk.blue : chalk.green;
        console.log(coloredMessage(`${role}: ${message}`));
    }
}

// Start the conversation
(async () => {
    await simulateConversation();
})();
