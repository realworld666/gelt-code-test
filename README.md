# MASH Game - Vue TypeScript Implementation

A modern implementation of the classic children's fortune-telling game MASH (Mansion, Apartment, Shack, House) built with Vue 3 and TypeScript.

## Game Rules

MASH is a fortune-telling game where players:
1. Choose categories (Life Partner, Number of Kids, Job, Salary, Car, Where You Live)
2. Add 4-5 options for each category (with a "terrible" option added by a friend)
3. Use a random number (3-10) to eliminate options through counting
4. Continue until only one option remains in each category
5. Read your complete fortune!

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

## How to Play

1. **Setup Phase:**
   - Click on category buttons to select which category to fill out
   - Add 4-5 options for each category
   - A "terrible" option will be automatically added
   - Complete all 6 categories

2. **Game Phase:**
   - A random number (3-10) is selected
   - Watch the animation count through all options
   - Options are eliminated one by one
   - Categories are completed when only one option remains

3. **Results Phase:**
   - View your complete MASH fortune
   - Click "New Game" to play again


## Follow up questions

1. **What additional features or improvements could be added to enhance the game experience?**
   1. The game could allow a second player to add the bad options rather than the app filling them in
   2. The game could allow for a selection of different categories or for the player to type their own
   3. The game could store its state so it doesnt reset on a page reload
   4. Responsive UI so the game would display properly on mobile devices
   5. UI layout could do with additional work so that its easy to see everything at once when watching the animation 
   6. Skip Animation button. I started implementing this but ran out of time. I think it would be a good feature to have.
2. How could AI be leveraged to make the game more engaging or personalized?
   1. AI could be used to generate the bad options rather than having a pre-defined list
   2. It could also take the final results and generate a short story based on them
3. What infrastructure would be required to support AI-enhanced functionality?
   1. To support the above, which would be a fairly simple GPT call, an API endpoint that invokes OpenAI API (or equivalent) would be required
4. How would you ensure that any AI-generated content or recommendations are accurate and appropriate?
   1. A good set of prompts and instructions on the initial request to limit the scope of the AI output
   2. While unlikely with a good prompt, additional checks on the output to ensure it is appropriate such as bad or offensive word filtering
   3. Checking the input from the game to ensure it doesn't contain instructions to the AI to go off the rails
   4. An ingame report tool to report any bad output from the AI
5. If users wanted to save and revisit their previous game results, how would you design this feature?
   1. The game would need an authentication system. This could be a hidden anonymous authentication that uses the device ID but this would limit the ability to share results between devices. A more traditional username/password or social login would be better but adds complexity.
   2. An API would be required to store game results once the game is completed to a database. This API would also be used to retrieve the game results by user ID
   3. The game UI would need to be modified to allow the user to load a previous game
