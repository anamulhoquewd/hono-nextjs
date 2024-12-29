# Catering Management System

The **Catering Management System** is a web-based application designed to help catering businesses streamline their operations. This system allows admins, managers, and delivery personnel to manage various aspects of the business, including orders and customers.

---

## Technologies Used

- **Hono.js**: Backend framework for high-performance server-side logic.
- **Next.js**: Frontend framework for building a dynamic user interface.
- **MongoDB**: NoSQL database for storing application data.
- **npm**: Package manager for JavaScript dependencies.
- **shadcn/ui**: UI library for consistent and reusable components.
- **axios**: HTTP client for API requests.
- **nodemailer**: For sending emails to users.
- **Cloudinary**: For managing media uploads, such as images.

---

## Application Features

### Roles and Permissions

1. **Admin**:
   - Can perform all actions, including adding, updating, and deleting managers, delivery personnel, customers, and orders.

2. **Manager**:
   - Can add customers and orders.
   - Can add delivery personnel but cannot delete any data.
   - See profile page and update data

3. **Delivery Man**:
   - Can only view assigned orders.
   - See profile page and update data

---

### Registration Workflow

- When a new user is registered, no password is required.
- The system will send a **custom password** to the user's registered email using **nodemailer**.
- Users can log in with the provided password and change it later from their profile.

---

## Installation and Setup

### Prerequisites

- Node.js and npm installed on your system.
- MongoDB instance set up and running.

### Steps to Run the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/anamulhoquewd/hono-nextjs
