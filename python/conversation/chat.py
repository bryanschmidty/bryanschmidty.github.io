import openai
import sys
import os
from colorama import Fore, init
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Set your OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Define the personalities
personality1 = "Albert Einstein"
personality2 = "William Shakespeare"

# Set the number of rounds for the conversation
number_of_rounds = 3

# The topic or question provided as a command-line argument
conversation_topic = sys.argv[1]

# Initialize the conversation with a system message and the conversation topic
conversation_history = [
    {"role": "system", "content": f"You are a helpful assistant that speaks like {personality1}."},
    {"role": "system", "content": f"You are a helpful assistant that speaks like {personality2}."},
    {"role": "user", "content": conversation_topic},
]

# Function to send a message to the OpenAI API
def send_message(content, role):
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt={
            "role": role,
            "content": content,
            "messages": conversation_history
        },
        temperature=0.7,
        max_tokens=150,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
    )

    return response.choices[0].text

# Function to simulate the conversation between the two personalities
def simulate_conversation():
    for i in range(number_of_rounds * 2):
        role = personality1 if i % 2 == 0 else personality2

        message = send_message(conversation_topic, role)
        conversation_history.append({"role": role, "content": message})

        colored_message = Fore.BLUE if role == personality1 else Fore.GREEN
        print(colored_message + f"{role}: {message}")

# Initialize colorama
init(autoreset=True)

# Start the conversation
simulate_conversation()
