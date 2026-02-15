    # 🌱 Sangha Seeds

    **A full-stack warehouse & order management system for a potato seed distribution business.** Sangha Seeds streamlines the end-to-end workflow of managing warehouses, seed inventory (lots), potato varieties, and dispatch orders — with a robust role-based access control system that enforces strict permissions across every level of the application.

    ---

    ## Table of Contents

    - [Product Overview](#-product-overview)
    - [Key Features](#-key-features)
    - [User Roles & Permissions](#-user-roles--permissions)
    - [Order Lifecycle](#-order-lifecycle)
    - [Tech Stack](#-tech-stack)
    - [Architecture](#-architecture)
    - [Database Design](#-database-design)
    - [API Reference](#-api-reference)
    - [Frontend Architecture](#-frontend-architecture)
    - [Security](#-security)
    - [Getting Started](#-getting-started)
    - [Seed Data](#-seed-data)
    - [Project Structure](#-project-structure)

    ---

    ## 🧑‍🌾 Product Overview

    Sangha Seeds is built for agricultural seed distribution companies that operate a network of cold-storage warehouses. It manages the full lifecycle of:

    - **Warehouses** — cold-storage facilities with storage and drying capacity limits, each assigned to a manager and a team of employees.
    - **Potato Varieties** — named seed cultivars (e.g., Kufri Jyoti, Kufri Pukhraj, Lady Rosetta, Atlantic) that are tracked across lots.
    - **Lots** — physical batches of seed potatoes stored in warehouses, tracked by variety, size grade, quantity, storage date, and expiry date.
    - **Orders** — dispatch instructions to move seed quantities from a lot to a destination, with a tracked lifecycle from placement through acknowledgment to completion.

    The system is designed for **daily operational use** — managers create orders in the morning, employees acknowledge and complete them throughout the day, and administrator oversees everything.

    ---

    ## ✨ Key Features

    ### Inventory Management

    - **Multi-warehouse support** with storage and drying capacity tracking
    - **Lot tracking** with lot numbers, variety, quantity, size grade, storage date, and expiry date
    - **Quantity-on-hold system** — when an order is placed, the ordered quantity is moved from "available" to "on hold" atomically via database transactions
    - **Lot availability checking** — real-time available quantity = `quantity - quantityOnHold`
    - **7 potato size grades**: Seed, Soot12, Soot11, Soot10, Soot8, Soot4to6, Soot4to8

    ### Order Management

    - **Full order lifecycle**: Placed → Acknowledged → Completed
    - **Database transactions** ensure atomic inventory updates on create, update, complete, and delete
    - **Completed orders cannot be deleted** — business rule enforced at the API level
    - **Order assignment** — each order has a creator, an assigned manager, and assigned employee(s)
    - **Order timeline tracking** — timestamps for creation, acknowledgment, and completion, with "by whom" attribution
    - **Destination tracking** for dispatch logistics

    ### Dashboard & Reporting

    - **Personal dashboard** showing placed, acknowledged, and completed orders for the logged-in user
    - **Flexible date range filtering** — Today, This Week, This Month, Last 2 Months, or Custom Range
    - **Order statistics** — total orders grouped by status, filterable by warehouse and date range

    ### Global Search

    - **Cross-entity search** across users, warehouses, lots, orders, and varieties
    - **Filter chips** to narrow search to a specific entity type
    - **Keyboard shortcuts** — `Ctrl+K` / `Cmd+K` to open, `Esc` to close, arrow keys to navigate
    - **Debounced search** (300ms) for responsive performance
    - **Type-specific result rendering** with contextual details

    ### Advanced Filtering

    - **Multi-criteria filter modal** for orders with filters for status, warehouse, lot, variety, manager, employee, date range, and more
    - **"My Orders" vs "All Orders" toggle** for admin/manager roles
    - **Paginated API responses** with configurable sort field and direction

    ### User Management

    - **Complete user CRUD** (Administrator only)
    - **Tabbed user listing** — Administrators, Managers (including ReadOnly), Employees
    - **Warehouse assignment** for employees
    - **Area of responsibility** tracking for managers and employees

    ### Responsive Design

    - **Desktop**: Collapsible sidebar navigation with animated active indicators
    - **Mobile**: Bottom navigation bar with sliding indicator for employees; floating action button (FAB) with popup menu for admins/managers
    - **Earthy, warm theme** — muted browns, sage greens, and warm beige tones designed for comfortable daily use

    ---

    ## 👥 User Roles & Permissions

    The system enforces **four roles** with hierarchical permissions. Every API endpoint and UI element respects these roles.

    | Capability                                    | Administrator | Manager | ReadOnlyManager | Employee |
    | --------------------------------------------- | :-----------: | :-----: | :-------------: | :------: |
    | **View Dashboard**                            |      ✅       |   ✅    |       ✅        |    ✅    |
    | **View Own Orders (My Orders)**               |      ✅       |   ✅    |       ✅        |    ✅    |
    | **View All Orders**                           |      ✅       |   ✅    |       ✅        |    ❌    |
    | **Create Orders**                             |      ✅       |   ✅    |       ❌        |    ❌    |
    | **Update/Delete Orders**                      |      ✅       |   ✅    |       ❌        |    ❌    |
    | **Acknowledge/Complete Orders** ¹             |      ❌       |   ✅ ¹  |       ❌        |    ✅ ¹  |
    | **Assign Employees to Orders**                |      ✅       |   ✅    |       ❌        |    ❌    |
    | **Assign Managers to Orders**                 |      ✅       |   ❌    |       ❌        |    ❌    |
    | **Navigate to Order Edit (click order card)** |      ✅       |   ✅    |       ❌        |    ❌    |
    | **View All Users**                            |      ✅       |   ✅    |       ✅        |    ❌    |
    | **Create/Update/Delete Users**                |      ✅       |   ❌    |       ❌        |    ❌    |
    | **Create Warehouses**                         |      ✅       |   ❌    |       ❌        |    ❌    |
    | **View Warehouses**                           |      ✅       |   ✅    |       ✅        |    ✅    |
    | **Create/Update Lots**                        |      ✅       |   ✅    |       ❌        |    ❌    |
    | **Delete Lots**                               |      ✅       |   ❌    |       ❌        |    ❌    |
    | **View Lots**                                 |      ✅       |   ✅    |       ✅        |    ❌    |
    | **Create/Update/Delete Varieties**            |      ✅       |   ❌    |       ❌        |    ❌    |
    | **View Varieties**                            |      ✅       |   ✅    |       ✅        |    ❌    |
    | **View Lots/Varieties/Users/Warehouses Nav**  |      ✅       |   ✅    |       ✅        |    ❌    |
    | **Global Search**                             |      ✅       |   ✅    |       ✅        |    ✅    |

    > [!IMPORTANT]
    > ¹ **Acknowledge/Complete is assignment-based, not role-based.** The "Mark as Acknowledged" and "Mark as Completed" buttons only appear for users who are **personally assigned** to that order — either as the `assignedManager` or as one of the `assignedEmployees`. The Administrator role does not participate in order fulfillment; they create and oversee orders but do not acknowledge or complete them. A Manager only sees these buttons on orders where they are the assigned manager.

    ### Role Details

    - **Administrator**: System overseer. Creates users, warehouses, varieties, and orders. Assigns managers to orders. Can view all data and edit/delete orders. **Does not participate in order fulfillment** (acknowledge/complete) — that is the responsibility of assigned managers and employees.
    - **Manager**: Operational lead. Creates and manages orders, creates/updates lots, assigns employees to orders. Can acknowledge and complete orders **only when they are the assigned manager** for that order. Cannot manage users, warehouses, or varieties.
    - **ReadOnlyManager**: Oversight role (e.g., audit, compliance, analytics). Can view all data that managers can view, but cannot create, update, or delete anything. Cannot acknowledge or complete orders. Useful for supervisors who need visibility without write access.
    - **Employee**: Field worker. Can only see their own assigned orders (via "My Orders") and their dashboard. Can acknowledge and complete orders **only when they are an assigned employee** for that order. Cannot view global order lists, lots, varieties, or user management pages.

    ### How Permissions Are Enforced

    Permissions are enforced at **three layers**:

    1. **Backend Middleware** — Four Express middleware functions gate every route:
    - `authmiddleware` — Verifies JWT token, attaches `userId` to request. Applied globally to all routes except `/auth`.
    - `adminMiddleware` — Allows only `Administrator` role.
    - `managerMiddleware` — Allows `Manager` and `Administrator` roles.
    - `readOnlyMiddleware` — Allows `Manager`, `ReadOnlyManager`, and `Administrator` roles.

    2. **Frontend Route Protection** — The `ProtectedRoute` component checks for a JWT token in `localStorage`; unauthenticated users are redirected to `/login`.

    3. **Frontend UI Conditional Rendering** — Buttons, navigation items, and page sections are conditionally rendered based on the user's role stored in `localStorage`. For example:
    - The **"Create Order" button** is only visible to `Administrator` and `Manager` roles.
    - **Order cards** are only clickable (to navigate to edit form) for `Administrator` and `Manager` roles.
    - The **sidebar/navbar** shows additional pages (Lots, Varieties, Warehouses, Users) only to non-Employee roles.
    - **Acknowledge/Complete buttons** on order cards are shown only to users who are **assigned** to that order (`isAssignedEmployee || isAssignedManager`), regardless of their role.
    - **Employees** see a simplified 3-tab mobile navbar (Orders, Dashboard, Profile) instead of the admin FAB menu.

    ---

    ## 🔄 Order Lifecycle

    Orders follow a strict three-stage lifecycle. Each transition is tracked with timestamps and the user who performed it.

    ```mermaid
    stateDiagram-v2
        [*] --> Placed: Admin/Manager creates order
        Placed --> Acknowledged: Assigned manager/employee acknowledges
        Acknowledged --> Completed: Assigned manager/employee completes
        Placed --> Deleted: Manager/Admin deletes (returns qty to lot)
        Acknowledged --> Deleted: Manager/Admin deletes (returns qty to lot)
        Completed --> [*]: Order is final (cannot be deleted)
    ```

    ### What Happens at Each Stage

    #### 1. Order Placed

    - **Who can do it**: Administrator, Manager
    - **What happens**:
    - The system validates that the lot has sufficient available quantity
    - A Prisma `$transaction` atomically:
        1. Decreases `lot.quantity` by the order amount
        2. Increases `lot.quantityOnHold` by the order amount
        3. Creates the order record
    - The order is assigned a manager and optionally one or more employees
    - Status is set to `placed`

    #### 2. Order Acknowledged

    - **Who can do it**: The assigned manager or assigned employee(s) of the order only (checked in the frontend via `isAssignedEmployee || isAssignedManager`; the backend route has no role restriction — just `authmiddleware`)
    - **Who cannot do it**: Administrator (unless they happen to be the assigned manager), ReadOnlyManager
    - **What happens**:
    - Sets `status` to `acknowledged`
    - Records `acknowledgedAt` timestamp and `acknowledgedById`
    - The "Mark as Acknowledged" button in the UI is replaced with "Mark as Completed"

    #### 3. Order Completed

    - **Who can do it**: The assigned manager or assigned employee(s) of the order only (same assignment-based check as acknowledge)
    - **Who cannot do it**: Administrator (unless assigned), ReadOnlyManager
    - **What happens**:
    - A Prisma `$transaction` atomically:
        1. Decreases `lot.quantityOnHold` by the order amount (releasing the hold)
        2. Updates the order with `status: completed`, `completedAt`, and `completedById`
    - **Completed orders cannot be deleted** — the API explicitly checks and rejects deletion

    #### Order Deletion

    - **Who can do it**: Administrator, Manager
    - **What happens**:
    - Only non-completed orders can be deleted
    - A Prisma `$transaction` atomically:
        1. Restores `lot.quantity` by adding back the order amount
        2. Decreases `lot.quantityOnHold` by the order amount
        3. Deletes the order record

    #### Order Update (Quantity Change)

    - **Who can do it**: Administrator, Manager
    - **What happens**:
    - When the quantity changes, a Prisma `$transaction` atomically:
        1. Adjusts `lot.quantity` by the difference (`oldQty - newQty`)
        2. Adjusts `lot.quantityOnHold` by the difference (`newQty - oldQty`)
        3. Updates the order record

    ---

    ## 🛠️ Tech Stack

    ### Backend

    | Technology                  | Purpose                                            |
    | --------------------------- | -------------------------------------------------- |
    | **Node.js** + **Express 5** | HTTP server and REST API framework                 |
    | **TypeScript**              | Type-safe backend code                             |
    | **Prisma ORM**              | Database access, migrations, and schema management |
    | **PostgreSQL**              | Relational database                                |
    | **Zod**                     | Runtime request validation (25+ schemas)           |
    | **bcrypt**                  | Password hashing (10 salt rounds)                  |
    | **JSON Web Tokens**         | Stateless authentication (24h expiry)              |
    | **pnpm**                    | Package management                                 |

    ### Frontend

    | Technology          | Purpose                                        |
    | ------------------- | ---------------------------------------------- |
    | **React 19**        | UI library                                     |
    | **TypeScript**      | Type-safe frontend code                        |
    | **Vite 7**          | Build tool and dev server                      |
    | **Tailwind CSS 4**  | Utility-first CSS framework                    |
    | **React Router v7** | Client-side routing with nested layouts        |
    | **Axios**           | HTTP client with interceptor for JWT injection |
    | **Zod**             | Shared validation schemas                      |
    | **react-icons**     | Icon library (Font Awesome & Ionicons)         |

    ---

    ## 🏛️ Architecture

    ### High-Level Architecture

    ```mermaid
    graph TB
        subgraph Frontend ["Frontend (React + Vite)"]
            UI[React Components]
            Router[React Router v7]
            API_Layer[API Layer / Axios]
            Theme[Theme System]
            Store[LocalStorage - JWT & User]
        end

        subgraph Backend ["Backend (Express + Prisma)"]
            Express[Express 5 Server]
            Auth_MW[Auth Middleware - JWT]
            Role_MW[Role Middleware - Admin/Manager/ReadOnly]
            Routes[Route Handlers]
            Validation[Zod Validation]
            Prisma[Prisma Client]
            Transactions[DB Transactions]
        end

        subgraph Database ["Database"]
            PG[(PostgreSQL)]
        end

        UI --> Router
        Router --> API_Layer
        API_Layer -->|HTTP + Bearer Token| Express
        Express --> Auth_MW
        Auth_MW --> Role_MW
        Role_MW --> Routes
        Routes --> Validation
        Validation --> Prisma
        Prisma --> Transactions
        Transactions --> PG
        Prisma --> PG
    ```

    ### Request Flow

    ```mermaid
    sequenceDiagram
        participant U as User (Browser)
        participant A as Axios Interceptor
        participant E as Express Server
        participant AM as Auth Middleware
        participant RM as Role Middleware
        participant R as Route Handler
        participant Z as Zod Validator
        participant P as Prisma + Transaction
        participant DB as PostgreSQL

        U->>A: HTTP Request
        A->>A: Inject JWT from localStorage
        A->>E: Request + Bearer Token
        E->>AM: Verify JWT
        AM->>AM: Decode token, attach userId
        AM->>RM: Check role (admin/manager/readOnly)
        RM->>RM: Query user role from DB
        RM->>R: Authorized request
        R->>Z: Validate request body/params
        Z-->>R: Validation result
        R->>P: Database operation
        P->>DB: SQL query (possibly transactional)
        DB-->>P: Result
        P-->>R: Data
        R-->>U: JSON response
    ```

    ---

    ## 💾 Database Design

    ### Entity Relationship Diagram

    ```mermaid
    erDiagram
        User ||--o{ Order : "creates"
        User ||--o{ Order : "manages"
        User ||--o{ Order : "acknowledges"
        User ||--o{ Order : "completes"
        User }o--o{ Order : "assigned as employee"
        User }o--o| Warehouse : "assigned to"
        User ||--o{ Warehouse : "manages"

        Warehouse ||--o{ Lot : "stores"
        Warehouse ||--o{ Order : "originates"

        Variety ||--o{ Lot : "categorizes"

        Lot ||--o{ Order : "fulfills"

        User {
            uuid id PK
            string name
            string email UK
            string password
            string mobile
            enum role
            string areaOfResponsibility
            uuid warehouseid FK
            string remarks
        }

        Warehouse {
            uuid id PK
            string name
            string location
            string maxStorageCapacity
            string maxDryingCapacity
            uuid assignedManagerId FK
            string remarks
        }

        Variety {
            uuid id PK
            string name UK
        }

        Lot {
            uuid id PK
            string lotNo
            uuid varietyId FK
            int quantity
            int quantityOnHold
            enum size
            datetime storageDate
            datetime expiryDate
            uuid warehouseId FK
            string remarks
        }

        Order {
            uuid id PK
            string destination
            uuid lotId FK
            int quantity
            uuid warehouseId FK
            uuid createdById FK
            uuid assignedManagerId FK
            datetime createdAt
            datetime updatedAt
            datetime completedAt
            boolean isComplete
            uuid completedById FK
            boolean isAcknowledged
            uuid acknowledgedById FK
            datetime acknowledgedAt
            string remarks
            enum status
        }
    ```

    ### Enums

    | Enum          | Values                                                                | Purpose                   |
    | ------------- | --------------------------------------------------------------------- | ------------------------- |
    | `UserRoles`   | `Administrator`, `Manager`, `ReadOnlyManager`, `Employee`             | Role-based access control |
    | `PotatoSizes` | `Seed`, `Soot12`, `Soot11`, `Soot10`, `Soot8`, `Soot4to6`, `Soot4to8` | Seed size grading system  |
    | `OrderStatus` | `placed`, `acknowledged`, `completed`                                 | Order lifecycle stages    |

    ### Database Transactions

    The system uses Prisma interactive transactions (`prisma.$transaction`) in four critical places to ensure data consistency:

    1. **Order Creation** — Atomically validates lot availability, deducts quantity, increases on-hold, and creates the order.
    2. **Order Update (qty change)** — Atomically adjusts lot quantity and on-hold when order quantity is modified.
    3. **Order Completion** — Atomically releases the on-hold quantity and marks the order as completed.
    4. **Order Deletion** — Atomically restores lot quantity, decreases on-hold, and deletes the order. Rejects deletion of completed orders.

    ---

    ## 📡 API Reference

    All API routes are prefixed with `/api/v1`. Authentication is required for all routes except `/auth/login`.

    ### Authentication

    | Method | Endpoint      | Middleware | Description                            |
    | ------ | ------------- | ---------- | -------------------------------------- |
    | `POST` | `/auth/login` | None       | Login with email/password, returns JWT |

    ### Users

    | Method   | Endpoint           | Middleware | Description                                    |
    | -------- | ------------------ | ---------- | ---------------------------------------------- |
    | `GET`    | `/user`            | readOnly   | List users (filter by role, warehouse, search) |
    | `GET`    | `/user/me`         | auth       | Get current authenticated user profile         |
    | `POST`   | `/user/create`     | admin      | Create a new user                              |
    | `PATCH`  | `/user/update/:id` | admin      | Update user details                            |
    | `DELETE` | `/user/delete/:id` | admin      | Delete a user                                  |

    ### Warehouses

    | Method | Endpoint                      | Middleware | Description                                            |
    | ------ | ----------------------------- | ---------- | ------------------------------------------------------ |
    | `GET`  | `/warehouse`                  | auth       | List warehouses (filter by location, search, capacity) |
    | `POST` | `/warehouse/create-warehouse` | admin      | Create a new warehouse                                 |

    ### Lots

    | Method   | Endpoint                | Middleware | Description                                                     |
    | -------- | ----------------------- | ---------- | --------------------------------------------------------------- |
    | `GET`    | `/lot`                  | readOnly   | List lots (filter by warehouse, variety, size, quantity, dates) |
    | `GET`    | `/lot/:id`              | readOnly   | Get lot details (include variety, warehouse, or orders)         |
    | `GET`    | `/lot/:id/availability` | readOnly   | Get available quantity (quantity − quantityOnHold)              |
    | `POST`   | `/lot`                  | manager    | Create a new lot                                                |
    | `PATCH`  | `/lot/:id`              | manager    | Update lot (quantityOnHold cannot be changed directly)          |
    | `DELETE` | `/lot/:id`              | admin      | Delete a lot                                                    |

    ### Orders

    | Method   | Endpoint                     | Middleware | Description                                                  |
    | -------- | ---------------------------- | ---------- | ------------------------------------------------------------ |
    | `GET`    | `/order`                     | readOnly   | List all orders (15+ filter parameters, pagination, sorting) |
    | `GET`    | `/order/my-orders`           | auth       | List orders involving the current user                       |
    | `GET`    | `/order/stats`               | readOnly   | Order statistics grouped by status                           |
    | `POST`   | `/order/create`              | manager    | Create order (**uses transaction**)                          |
    | `PATCH`  | `/order/update/:id`          | manager    | Update order (**uses transaction** if qty changes)           |
    | `POST`   | `/order/acknowledge/:id`     | auth       | Acknowledge an order                                         |
    | `POST`   | `/order/complete/:id`        | auth       | Complete an order (**uses transaction**)                     |
    | `POST`   | `/order/assign-manager/:id`  | admin      | Assign a manager to an order                                 |
    | `POST`   | `/order/assign-employee/:id` | manager    | Assign an employee to an order                               |
    | `DELETE` | `/order/delete/:id`          | manager    | Delete order (**uses transaction**, rejects completed)       |

    ### Varieties

    | Method   | Endpoint               | Middleware | Description                                        |
    | -------- | ---------------------- | ---------- | -------------------------------------------------- |
    | `GET`    | `/variety`             | readOnly   | List varieties (search, filter by hasLots)         |
    | `GET`    | `/variety/:name`       | readOnly   | Get variety by name (include lots with pagination) |
    | `GET`    | `/variety/variety/:id` | readOnly   | Get variety by ID                                  |
    | `POST`   | `/variety`             | admin      | Create a variety                                   |
    | `PATCH`  | `/variety/:id`         | admin      | Update a variety                                   |
    | `DELETE` | `/variety/:id`         | admin      | Delete a variety                                   |

    ### Search

    | Method | Endpoint  | Middleware | Description                       |
    | ------ | --------- | ---------- | --------------------------------- |
    | `GET`  | `/search` | auth       | Global search across all entities |

    ### Query Parameter Features

    - **Pagination**: `page` and `limit` on all list endpoints (default: page 1, limit 10)
    - **Sorting**: `sortBy` and `order` (asc/desc) on all list endpoints
    - **Date Range Filtering**: `createdFrom`, `createdTo`, `completedFrom`, `completedTo`
    - **Case-insensitive search**: All text searches use Prisma's `mode: "insensitive"`
    - **Include related data**: `?include=` parameter on detail endpoints

    ---

    ## 🖥️ Frontend Architecture

    ### Page Structure

    ```mermaid
    graph TD
        App[App.tsx]
        App --> Login["/login — LoginPage"]
        App --> PR[ProtectedRoute]
        PR --> Layout[Layout - Header + Navbar]
        Layout --> Dash["/ — Dashboard"]
        Layout --> Orders["/orders — Orders"]
        Layout --> OrderForm["/orders/form — OrderForm"]
        Layout --> Profile["/profile — ProfilePage"]
        Layout --> Warehouses["/warehouses — Warehouses"]
        Layout --> CreateWH["/warehouses/create — CreateWarehouse"]
        Layout --> Users["/users — Users"]
        Layout --> UserForm["/users/form — UserForm"]
        Layout --> Varieties["/varieties — Varieties"]
        Layout --> VarForm["/varieties/form — VarietyForm"]
        Layout --> Lots["/lots — Lots"]
        Layout --> LotForm["/lots/form — LotForm"]
    ```

    ### Component Library

    The frontend includes a **custom UI component library** (`src/components/ui/`):

    | Component             | Description                                     |
    | --------------------- | ----------------------------------------------- |
    | `Calendar`            | Date picker with min/max constraints            |
    | `Checkbox`            | Styled checkbox                                 |
    | `Dropdown`            | Custom select dropdown with search              |
    | `Input`               | Text input with label and validation            |
    | `MultiSelectDropdown` | Multi-select with chips                         |
    | `NumberInput`         | Numeric input                                   |
    | `TextArea`            | Multi-line text input                           |
    | `Toast`               | Notification toast with success/error variants  |
    | `ToastProvider`       | Context provider for global toast notifications |

    ### Key Components

    | Component        | Description                                                                                                                                  |
    | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
    | `OrderCard`      | Rich order card with status badge, key info grid, timeline accordion, assignment accordion, and inline action buttons (Acknowledge/Complete) |
    | `DashboardCard`  | Summary card showing order count by status                                                                                                   |
    | `WarehouseCard`  | Detailed warehouse card with employee list, lot summary, and order statistics                                                                |
    | `LotCard`        | Lot detail card with variety, quantity, size, and dates                                                                                      |
    | `FilterModal`    | Multi-criteria filter dialog for orders                                                                                                      |
    | `GlobalSearch`   | Full-screen search modal with entity-type chips and keyboard navigation                                                                      |
    | `ProtectedRoute` | Route guard that redirects to login if no JWT token exists                                                                                   |

    ### Theme System

    The app uses a centralized TypeScript theme (`src/theme.ts`) instead of CSS variables:

    - **Earthy color palette** — muted browns, sage greens, warm beige
    - **Status colors** — soft terracotta (error), muted teal (info), gentle green (success), warm ochre (warning)
    - **Consistent border radius scale** — sm through full
    - **Spacing scale** — 2xs (2px) through 3xl (48px)

    ### API Layer

    - **Axios instance** with request interceptor that automatically injects the JWT token from `localStorage` into every request's `Authorization: Bearer` header.
    - **Typed API functions** for every backend endpoint, providing type-safe request/response handling.
    - **Intelligent user fetching** — the "Managers" tab combines `Manager` and `ReadOnlyManager` roles with deduplication by user ID.

    ### Navigation

    - **Desktop**: Collapsible sidebar with icon-only (64px) or full (192px) mode. Active link has an animated left-side indicator bar.
    - **Mobile (Employee)**: Bottom tab bar with 3 items (Orders, Dashboard, Profile) and a sliding active indicator.
    - **Mobile (Admin/Manager/ReadOnly)**: Bottom bar with Dashboard, a central **floating action button (FAB)** that expands into a popup menu with animated items (Orders, Lots, Varieties, Warehouses, Users), and Profile.

    ---

    ## 🔒 Security

    - **Password Hashing**: All passwords are hashed with bcrypt (10 salt rounds) before storage. Passwords are never returned in API responses (excluded via destructuring in the `/me` endpoint).
    - **JWT Authentication**: Tokens expire after 24 hours. The JWT secret is stored in environment variables.
    - **Role-Based Middleware**: Every API endpoint is gated by the appropriate middleware function — no route relies solely on frontend checks.
    - **Input Validation**: All request bodies and query parameters are validated with Zod schemas. Invalid requests are rejected with `400 Bad Request` before any database access.
    - **Token Storage**: JWT is stored in `localStorage` and automatically attached to all API requests via Axios interceptor.

    ---

    ## 🚀 Getting Started

    ### Prerequisites

    - **Node.js** ≥ 18
    - **pnpm** ≥ 10
    - **PostgreSQL** database

    ### 1. Clone the Repository

    ```bash
    git clone https://github.com/rahmatdeep/sangha-seeds.git
    cd sangha-seeds
    ```

    ### 2. Backend Setup

    ```bash
    cd backend
    pnpm install
    ```

    Create a `.env` file:

    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    JWT_SECRET="your-secret-key"
    PORT=3000
    ```

    Run database migrations and seed:

    ```bash
    npx prisma migrate dev
    npx prisma db seed
    ```

    Start the backend:

    ```bash
    pnpm run dev
    ```

    ### 3. Frontend Setup

    ```bash
    cd frontend
    pnpm install
    ```

    The API base URL is configured in `src/config.ts`. Update it if your backend runs on a different port:

    ```typescript
    export const API_BASE_URL = "http://localhost:3000/api/v1";
    ```

    Start the frontend:

    ```bash
    pnpm run dev
    ```

    ---

    ## 🌾 Seed Data

    The seed script (`prisma/seed.js`) populates the database with realistic demo data:

    | Entity         | Count | Details                                                                                             |
    | -------------- | ----- | --------------------------------------------------------------------------------------------------- |
    | **Users**      | 17    | 1 Administrator, 2 Managers, 4 ReadOnly Managers, 10 Employees                                      |
    | **Warehouses** | 4     | Ludhiana, Jalandhar, Amritsar, Patiala (all Punjab)                                                 |
    | **Varieties**  | 7     | Kufri Jyoti, Kufri Pukhraj, Kufri Chandramukhi, Kufri Badshah, Kufri Ashoka, Lady Rosetta, Atlantic |
    | **Lots**       | 85    | Spread across all warehouses and date ranges (2025-2026)                                            |
    | **Orders**     | 115   | Mix of placed, acknowledged, and completed orders                                                   |

    ### Test Credentials

    | Role             | Email                        | Password      |
    | ---------------- | ---------------------------- | ------------- |
    | Administrator    | `admin@example.com`          | `password123` |
    | Manager          | `rajesh.kumar@example.com`   | `password123` |
    | ReadOnly Manager | `sneha.reddy@example.com`    | `password123` |
    | Employee         | `harpreet.singh@example.com` | `password123` |

    ---

    ## 📁 Project Structure

    ```
    sangha-seeds/
    ├── backend/
    │   ├── prisma/
    │   │   ├── schema.prisma          # Database schema (5 models, 3 enums)
    │   │   ├── migrations/            # Prisma migration history
    │   │   └── seed.js                # Database seed script
    │   └── src/
    │       ├── index.ts               # Express app entry point
    │       ├── middleware.ts           # Auth, Admin, Manager, ReadOnly middleware
    │       ├── lib/
    │       │   ├── prisma.ts          # Prisma client singleton
    │       │   └── types.ts           # Zod schemas & TypeScript types (25+ schemas)
    │       ├── routes/
    │       │   ├── authRouter.ts      # Login endpoint
    │       │   ├── userRouter.ts      # User CRUD
    │       │   ├── warehouseRouter.ts  # Warehouse management
    │       │   ├── lotRouter.ts       # Lot CRUD + availability
    │       │   ├── orderRouter.ts     # Order lifecycle (transactions)
    │       │   ├── varietyRouter.ts   # Variety CRUD
    │       │   ├── searchRouter.ts    # Global search
    │       │   └── dashboardRouter.ts # Dashboard statistics
    │       └── types.d.ts             # Express request augmentation
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── App.tsx                # Root component with routing
    │   │   ├── main.tsx               # React entry point
    │   │   ├── config.ts              # API base URL config
    │   │   ├── theme.ts               # Centralized theme (colors, spacing, radii)
    │   │   ├── api/
    │   │   │   ├── index.ts           # Typed API functions for all endpoints
    │   │   │   └── interceptor.ts     # Axios instance with JWT interceptor
    │   │   ├── types/
    │   │   │   └── index.ts           # Shared Zod schemas & inferred types
    │   │   ├── hooks/
    │   │   │   └── toastContext.ts    # Toast notification hook
    │   │   ├── utils/
    │   │   │   └── date.ts            # Date utility functions
    │   │   ├── layout/
    │   │   │   ├── Layout.tsx         # Main layout (Header + Navbar + Outlet)
    │   │   │   ├── Header.tsx         # Top bar with logo, search, notifications
    │   │   │   └── Navbar.tsx         # Responsive sidebar/bottom nav
    │   │   ├── components/
    │   │   │   ├── OrderCard.tsx      # Rich order card with actions
    │   │   │   ├── DashboardCard.tsx  # Dashboard summary card
    │   │   │   ├── WarehouseCard.tsx  # Warehouse detail card
    │   │   │   ├── LotCard.tsx        # Lot detail card
    │   │   │   ├── FilterModal.tsx    # Advanced filter dialog
    │   │   │   ├── GlobalSearch.tsx   # Ctrl+K search modal
    │   │   │   ├── ProtectedRoute.tsx # Auth route guard
    │   │   │   └── ui/               # Reusable UI components (9 components)
    │   │   └── pages/
    │   │       ├── LoginPage.tsx      # Authentication page
    │   │       ├── Dashboard.tsx      # Personal order dashboard
    │   │       ├── Orders.tsx         # Order listing with filters
    │   │       ├── OrderForm.tsx      # Create/edit order form
    │   │       ├── Warehouses.tsx     # Warehouse listing
    │   │       ├── CreateWarehouse.tsx # Warehouse creation form
    │   │       ├── Users.tsx          # Tabbed user management
    │   │       ├── UserForm.tsx       # Create/edit user form
    │   │       ├── Varities.tsx       # Variety listing
    │   │       ├── VarietyForm.tsx    # Create/edit variety form
    │   │       ├── Lots.tsx           # Lot listing
    │   │       ├── LotForm.tsx        # Create/edit lot form
    │   │       └── ProfilePage.tsx    # User profile page
    │   ├── index.html
    │   └── vite.config.ts
    └── README.md
    ```

    ---

    ## License

    This project is for internal use. All rights reserved.
