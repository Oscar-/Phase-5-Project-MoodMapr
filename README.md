# Mood Mapr: Terminal Setup Instructions

## Step 1: Clone the Project Repository
1. Open your terminal.
2. Run the following command to clone the repository (replace `yourusername` with your GitHub username):
   ```bash
   git clone https://github.com/yourusername/mood-mapr.git


3. Change to the project directory:

   ```bash
   cd mood-mapr

## Step 2: Set Up the Backend (Flask)
2.1: Install Backend Dependencies
Use Pipenv to install the required packages:
      ```bash
      pipenv install --dev

2.2: Start the Flask Server
1. Activate the virtual environment:
   
      ```bash
      pipenv shell

2. Run the Flask server on port 5555:
   
      ```bash
      flask run --port 5555

The backend should now be running at http://127.0.0.1:5555.

## Step 3: Set Up the Frontend (React)
3.1: Navigate to the Frontend Directory
If your React app is in a separate folder (e.g., client), navigate to that directory:

      ```bash
      cd client

3.2: Install Frontend Dependencies
Install the required Node.js packages:

      ```bash
      npm install

3.3: Start the React Development Server
Run the React app:

      ```bash
      npm start

Your React app should now be running at http://localhost:3000.

## Step 4: API Key Setup Instructions
Obtain Your OpenAI API Key (Optional):

If you'd like to use your own OpenAI API key, go to the OpenAI website and sign up or log in to your account.
Navigate to the API section to generate your own API key. However, for testing purposes, you can use the provided key.
Set Up the .env File:

In the root directory of your project, there should already be a .env file. Open this file in a text editor.
Add the following line to the .env file:
plaintext
      ```bash
      OPENAI_API_KEY=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

Make sure to save the changes to the .env file.
Usage:

When running the app, the application will access the OpenAI API key from the .env file.

## Step 5: Using the App
Open your web browser.

Go to http://localhost:3000 to access the Mood Mapr app.

Troubleshooting
If you encounter issues, check the following:

Ensure the Flask server is running at http://127.0.0.1:5555.
Make sure you have installed all dependencies for both the backend and frontend.
Verify your API keys are correctly set in the existing .env file.

1. A one sentence **description** of your app:
   
MoodMapr: A personalized travel app that curates destinations and experiences based on your current mood, helping you discover the perfect places that match how you feel.

2. A **wireframe** using Figma, DrawIO, etc:
   
<img width="462" alt="Screenshot 2024-09-30 at 2 42 49 PM" src="https://github.com/user-attachments/assets/cc2b9ff4-cabb-4a5e-85d4-329d3cfb0c14">


<img width="440" alt="Screenshot 2024-09-30 at 2 42 59 PM" src="https://github.com/user-attachments/assets/bde2255f-a32a-43f8-bf49-a853f8b8feec">


<img width="547" alt="Screenshot 2024-09-30 at 2 43 08 PM" src="https://github.com/user-attachments/assets/90ad9069-88f9-4769-afba-ff55c78154ad">


<img width="402" alt="Screenshot 2024-09-30 at 2 43 19 PM" src="https://github.com/user-attachments/assets/13cedc28-ea9b-4ac8-b8d5-336516e3681c">


<img width="433" alt="Screenshot 2024-09-30 at 2 43 27 PM" src="https://github.com/user-attachments/assets/bb0d57a7-d627-43d9-be21-b085c33f9146">


<img width="431" alt="Screenshot 2024-09-30 at 2 43 37 PM" src="https://github.com/user-attachments/assets/08e50357-cfbf-44ea-b44b-0386004111c4">






3. **User Stories**:

<img width="540" alt="Screenshot 2024-09-30 at 1 33 37 PM" src="https://github.com/user-attachments/assets/2c2e3981-f72a-4ce4-a4fc-857749f88290">




4. A React **tree diagram**: recommend sketch out properties/states/callback functions:

<img width="723" alt="Screenshot 2024-09-30 at 2 00 59 PM" src="https://github.com/user-attachments/assets/77d79e5b-9593-49b4-97bb-856bc2969cc8">



5. A screenshot of your **schema**: include validations/constraints/anything else:

<img width="1432" alt="Screenshot 2024-09-30 at 2 56 59 PM" src="https://github.com/user-attachments/assets/f77d54ac-aec8-4819-ad76-2d81e706bdad">



6. A list of your **API routes** (includes HTTP Verb, Endpoint, Purpose):

<img width="729" alt="Screenshot 2024-09-30 at 2 17 11 PM" src="https://github.com/user-attachments/assets/8b40d75f-5a08-454f-bef8-7b689b4b459a">


React Routes: 

<img width="632" alt="Screenshot 2024-09-30 at 3 03 14 PM" src="https://github.com/user-attachments/assets/20b51616-8b76-47f6-8f23-3bfa357b493e">



7. Three **stretch goals**:

   - Integrate OpenAI API for AI Chatbot Interaction
   - Allow Users to Share Itineraries
   - Allow Users to Recommend New Places
   - Notify Users of New Places
   - Plan Future Trips
   - Allow Reservations to Be Placed Using the App
   - Use Reservation Data to Advise Places on Incoming Traffic
   - Add a Map to Display Locations & Places
   - Add the Following Models to Enhance the App: Review,Activity, Category, Recommendation, Visit History, Image, Tag, Location Type
    
    

8. **Kanban board**:

![Screenshot 2024-09-17 at 9 21 04 AM](https://github.com/user-attachments/assets/36b07eb1-c23d-4160-8e4c-07170dd4c57d)


9. What new **tech** you will be using and how: ex. CSS packages (Material-UI, ReactBootstrap, Tailwind), deployment, useContext/Redux, etc:

OpenAI api

GoogleMaps or similar 

