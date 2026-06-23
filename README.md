# FreshCart - E-Commerce Web App

This is my graduation project for the Front End Development course with Route Academy. It's a fully functional e-commerce website built with modern web technologies. Users can browse products, leave reviews, and manage their shopping carts.

## Features

- **User Authentication** - Register and login securely with form validation
- **Product Catalog** - Browse products by category, filter and search functionality
- **Product Details** - View product images, descriptions, prices, and reviews
- **Reviews System** - Users can add, edit, or delete their own product reviews with star ratings
- **Shopping Cart** - Add/remove products, manage quantities, and proceed to checkout
- **Wishlist** - Save favorite products for later
- **Responsive Design** - Fully responsive layout that works on mobile, tablet, and desktop
- **Order Management** - Users can view their order history

## Technology Stack

- **Frontend Framework** - Next.js 16 (React) with App Router
- **State Management** - Redux Toolkit with RTK Query for data fetching
- **Styling** - Tailwind CSS for utility-first styling
- **UI Components** - Shadcn/ui for pre-built accessible components
- **Icons** - Lucide React for SVG icons
- **Notifications** - Sonner for toast notifications
- **Language** - TypeScript for type safety
- **API** - RouteMisr E-Commerce API (REST)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd e-commerce-project
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file (if needed for API keys):

```bash
# Add any required environment variables here
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

The app will auto-refresh as you make changes to the code.

### Building for Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js pages and layout
│   ├── (auth)/         # Authentication pages
│   ├── products/       # Product pages
│   ├── cart/           # Cart page
│   ├── wishlist/       # Wishlist page
│   └── checkout/       # Checkout page
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   └── custom/         # Custom components
├── hooks/              # Custom React hooks
├── store/              # Redux store setup
├── types/              # TypeScript type definitions
└── lib/                # Utility functions
```

## Key Features Explained

### Reviews System

Users can submit reviews with star ratings and comments. Only the review author can edit or delete their own reviews. The app prevents duplicate reviews from the same user.

### Shopping Cart

The cart is managed through the API. Users can add products, adjust quantities, and the total is calculated automatically.

### Authentication

User authentication uses JWT tokens stored securely. The app verifies tokens on page load to maintain user sessions.

## API Integration

This project uses the RouteMisr E-Commerce API with the following endpoints:

- Authentication: Sign up, login, password reset
- Products: Get all products, get product by ID
- Categories: Get all categories
- Cart: Add, update, view, clear cart items
- Reviews: Add, update, delete product reviews
- Wishlist: Add, remove, view wishlist items
- Orders: Create and view orders

## Challenges Overcome

During development, I had to solve several challenges:

- Implementing a robust authentication system with token verification
- Handling complex API responses and transforming data for the UI
- Building a responsive design that works on all screen sizes
- Managing global state with Redux for cart and auth data
- Preventing duplicate reviews with client-side validation

## Lessons Learned

- The importance of proper error handling and user feedback
- How to structure a large-scale React/Next.js application
- Working with REST APIs and managing asynchronous data fetching
- Using TypeScript for catching bugs early
- Building responsive layouts with Tailwind CSS

## Future Improvements

- Add product search with autocomplete
- Implement product pagination
- Add user profile customization
- Include payment gateway integration
- Add order tracking
- Implement review moderation system
- Add product recommendations based on browsing history

## Deployment

The app is deployed on Vercel, which provides seamless integration with Next.js. Deployments happen automatically when pushing to the main branch.

## License

This is a student project created for educational purposes.

## Contact

For questions about this project, please reach out to me.

---

**Made with ❤️ as a Web Development graduation project**
