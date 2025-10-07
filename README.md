# QuickCard-E-ecommerce

A full-stack e-commerce web application for QuickCard. This project features a React frontend and a Python (Flask) backend, with a SQLite database for data storage.

## Features

# QuickCard-E-ecommerce

A full-stack e-commerce web application for QuickCard. This project features a React frontend and a Python (Flask) backend, with a SQLite database for data storage.

## Features

### 1️⃣ Home / Landing Page
- Banner/hero section with promotions or featured products
- Carousel/slider for featured products
- Quick links to product categories

### 2️⃣ Product Listing / Shop Page
- Grid or list view of products
- Product cards with:
	- Image
	- Name
	- Price
	- Short description
	- Add to cart button
- Filters:
	- Category
	- Price range
	- Rating
- Search bar to search products by name
- Pagination or infinite scroll for large catalogs

### 3️⃣ Product Detail Page
- Detailed product description
- Multiple images / gallery view
- Price, stock status, and rating
- Add to cart and quantity selector
- Related or recommended products

### 4️⃣ Cart / Shopping Bag
- List of products added to the cart
- Quantity management (increase/decrease/remove)
- Display subtotal, shipping estimate, and total price
- Proceed to checkout button

### 5️⃣ Checkout / Order Placement
- Form to collect shipping details
- Payment integration (Stripe, PayPal, or mock)
- Order summary and final price confirmation
- Confirmation page with order ID

### 6️⃣ User Authentication (Optional)
- Signup / Login forms
- Authentication via email/password
- User dashboard to view past orders

### 7️⃣ Responsive Design
- Fully functional on desktop, tablet, and mobile devices
- Mobile-friendly menus and buttons

## Project Structure
```
project/
├── backend/        # Flask backend API
│   ├── app.py      # Main backend application
│   ├── models.py   # Database models
│   ├── seed.py     # Seed script for database
│   ├── requirements.txt
│   └── instance/
│       └── quickcart.db
├── frontend/       # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context providers
│   │   ├── lib/             # Utility libraries
│   │   ├── pages/           # Application pages
│   │   └── assets/          # Static assets
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── ...
└── README.md
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
1. Navigate to the backend folder:
	```bash
	cd backend
	```
2. Install Python dependencies:
	```bash
	pip install -r requirements.txt
	```
3. (Optional) Seed the database:
	```bash
	python seed.py
	```
4. Run the backend server:
	```bash
	python app.py
	```

### Frontend Setup
1. Navigate to the frontend folder:
	```bash
	cd frontend
	```
2. Install Node.js dependencies:
	```bash
	npm install
	# or
	yarn install
	```
3. Start the frontend development server:
	```bash
	npm run dev
	# or
	yarn dev
	```

## Usage
- Access the frontend at `http://localhost:5173` (default Vite port)
- The backend API runs at `http://localhost:5000` (default Flask port)
- Register, log in, browse flights, add to cart/wishlist, and checkout.

## Technologies Used
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Flask, SQLite
- **Other:** Supabase (for authentication), ESLint, PostCSS

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
