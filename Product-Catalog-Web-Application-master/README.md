# Full-Stack Product Catalog Web Application
        A complete MERN-stack application featuring a product catalog with user/admin roles, authentication, CRUD operations for products (including image uploads), and advanced filtering/sorting. Deployed using a modern Jamstack architecture.

**Live Demo(Deployed Link): https://product-catalog-gnut.onrender.com/login.html**

**Features**

      User Authentication: Secure signup and login system using email and password. Passwords are securely hashed using bcrypt.
      
      Role-Based Access Control: Distinct views and permissions for regular 'users' and 'admins'.
      
      Admin Management: Admins can Create, Read, Update, and Delete products via a dedicated UI.
      
      Product Image Uploads: Admins can upload product images, which are stored and served by the backend.
      
      Product Detail View: Users can click on products to see a detailed page with more information.
      
      Advanced Filtering & Sorting: Users can filter products by search term, category, minimum price, and maximum price. Results can be sorted by newest, price (low/high), or rating.
      
      Pagination: Implemented with a "Load More" button for a smooth user experience.
      
      Responsive UI: Designed to work well on different screen sizes.
      
      Loading States: Skeleton loaders provide a better UX while data is being fetched.
      
      Feedback: Toast notifications confirm admin actions.

**Technology Stack**

        Frontend: React.js (via CDN), HTML5, CSS3
        
        Backend: Node.js, Express.js
        
        Database: MongoDB (with Mongoose ODM)
        
        Authentication: bcrypt for password hashing
        
        File Uploads: multer for handling image uploads

**Local Setup Guide**

        Follow these steps to run the project on your local machine.
        
        Prerequisites
        
        Node.js (v18 or later recommended)
        
        npm (usually comes with Node.js)
        
        MongoDB installed locally OR a MongoDB Atlas account
        
        Installation & Setup
        
        Clone the Repository:
        
        git clone [Your GitHub Repository URL]
        cd [Your Repository Folder Name] 
        
        
        Install Backend Dependencies:
        Navigate to the project's root directory (where server.js is located) and run:
        
        npm install
        
        
        Set Up Environment Variables:
        
        Create a file named .env in the project root directory.
        
        Add the following lines, replacing the placeholder values:
        
        # Your MongoDB connection string (local or Atlas)
        MONGO_URI=mongodb://127.0.0.1:27017/productCatalogDB 
        # MONGO_URI=mongodb+srv://<user>:<password>@<your-atlas-cluster>...
        
        Note: Use your local MongoDB connection string if running MongoDB locally. If using Atlas for local development, use your Atlas connection string.
        
        Seed the Database (Optional but Recommended):
        Run the following command in the root directory to populate your database with sample products and create the necessary collections:
        
        node seed.js
        
        
        (Make sure your MongoDB server is running locally or that your .env file points to Atlas before running this).
        
        Create Uploads Directory:
        Manually create a folder named uploads in the project root directory. This is where uploaded images will be stored locally.
        
        Start the Backend Server:
        
        node server.js
        
        
        The server should start, and you'll see "Successfully connected to MongoDB!" in the console. It will typically run on http://localhost:3000.
        
        Access the Frontend:
        
        Open your web browser.
        
        Navigate to the signup.html file within the project folder ([Your Repository Folder Name]/client/public/signup.html). You can usually do this by dragging the file into your browser or using a simple local server if you have one (like VS Code's Live Server extension pointing to the client/public directory).
        
        Alternatively, if the backend is running, you might be able to access it via http://localhost:3000/signup.html because the server is also serving static files.

**Creating Users**

        Use the signup page to create your first user. Select the "Admin" role and enter the ADMIN_SECRET_KEY from your .env file (SuperSecretAdminKey123!).
        
        Create subsequent users by selecting the "User" role (no key needed).
        
        (Note: The free Render backend instance may take 30-60 seconds to "wake up" on the first request after a period of inactivity.)
