# UmojaTickets

UmojaTickets is a web-based ticketing service developed using Next.js, Convex, and Clerk. It provides a seamless platform for event organizers to manage ticket sales and for attendees to purchase tickets online.

## Features

- **Event Management**: Create and manage events with detailed information.
- **Ticket Sales**: Sell tickets with various pricing tiers and quantities.
- **User Authentication**: Secure user authentication and management using Clerk.
- **Real-time Data**: Utilize Convex for real-time data updates and storage.

## Technologies Used

- [Next.js](https://nextjs.org/): A React framework for server-side rendering and static site generation.
- [Convex](https://convex.dev/): A backend platform for data storage and real-time updates.
- [Clerk](https://clerk.dev/): User management and authentication service.
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for styling.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Ochiengmorris/umojatickets.git
   cd umojatickets
   ```

2. **Install Dependencies**:

   Ensure you have [Node.js](https://nodejs.org/) installed. Then, run:

   ```bash
   npm install
   ```

3. **Set Up Convex**:

   - Install the Convex CLI:

     ```bash
     npm install -g convex
     ```

   - Log in to Convex:

     ```bash
     convex login
     ```

   - Initialize Convex:

     ```bash
     convex init
     ```

4. **Set Up Clerk**:

   - Sign up for a Clerk account at [Clerk.dev](https://clerk.dev/).
   - Obtain your Clerk API keys and configure them in your environment variables.

5. **Set Up Environment Variables**:

   ```bash
       NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
     # convex keys
     # Deployment used by `npx convex dev`
       CONVEX_DEPLOYMENT=
       NEXT_PUBLIC_CONVEX_URL=
       CONVEX_DEPLOY_KEY=
     # mpesa keys
       MPESA_CONSUMER_KEY=
       MPESA_CONSUMER_SECRET=
       MPESA_PASSKEY=
       MPESA_CALLBACK_URL=
       MPESA_SHORTCODE=
   ```

6. **Start the Application**:

   ```bash
   npm run dev
   ```

This will start the Next.js development server. You can then access the app at `http://localhost:3000`.

## Project Structure

- **`/convex`**: Convex backend functions and configuration.
- **`/public`**: Public assets such as images and icons.
- **`/src`**: Contains the main application source code.
  - **`/app`**: Next.js pages and API routes.
  - **`/components`**: Reusable components used throughout the app.
  - **`/constants`**: Constants for the project.
  - **`/lib`**: Utility functions and helpers.
  - **`/actiions`**: Server Actions

## Contributing

We welcome contributions to enhance the UmojaTickets platform. To contribute:

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature-name
   ```

3. Make your changes and commit them:

   ```bash
   git commit -m "Description of feature"
   ```

4. Push to your forked repository:

   ```bash
   git push origin feature-name
   ```

5. Open a pull request detailing your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact

For questions or support, please contact [Ochieng Morris](mailto:ochiengmorris@example.com).
