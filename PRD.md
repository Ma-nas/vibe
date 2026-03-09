# Product Requirements Document (PRD)
## Link Management Platform (v2)

### 1. Overview
The Link Management Platform is an upgraded, frontend-centric web application built with React and TypeScript. Evolving from a basic shortener, this system introduces **Link Management, User Authentication, and Advanced Controls** allowing users to not just generate short links, but fully manage their lifecycle, expiry limits, active status, and destinations, all while operating completely serverless via browser local storage.

### 2. Implementation Approach
- **Framework**: Vite with React & TypeScript (`react-router-dom` using `HashRouter` to natively prevent 404s on static hosts during redirection routines).
- **Simulated Backend & Authentication**: A localized mock-authentication system was introduced targeting `localStorage`, consisting of user registration, login, and secured session state binding using a `link_shortener_session` key. The Dashboard is now fully protected and segregates generated links per authenticated user.
  - **Note: To assist evaluators, the Login interface features Auto-Registration. Logging in with an unseen username will automatically register the account and establish the session.**
- **Data Extensibility**: The `LinkData` interface was expanded to encompass features like `isActive`, `maxClicks`, `lastAccessedAt`, and an `originalUrl` that actively listens for in-place user edits.
- **Design system**: Modern Glassmorphism using Vanilla CSS + custom iconography powered by `lucide-react`.

### 3. Core Features & Capabilities

#### 3.1 User Authentication
- **Register / Login / Logout**: Integrated directly into the flow. The system locks down route `/` to verified users, redirecting unauthorized traffic to `/login` securely. Logging out cleanly clears the persistent session and enforces immediate redirection.

#### 3.2 Advanced Link Management
- **Link Expiry Limits**: Users may optionally provide a `Max Clicks Limit` when generating a link. Upon interception, the Redirection flow evaluates if the limit has been hit, throwing a stylized "Link Expired" exception rather than redirecting.
- **Link Enable / Disable Toggle**: Real-time status toggle mechanism allows temporary or permanent shutdown of a link. If disabled and externally accessed, the user interfaces with a clear "Link Inactive" notification.
- **In-Place Destination Editing**: From the dashboard, users can click to dynamically update the underlying long-URL corresponding to the original Short Code, meaning external resources can rotate destinations without updating the actual short link string.

#### 3.3 Analytics & Timestamps
- **Creation Timestamp**: Permanently tracked and displayed per link on the main dashboard cards.
- **Last Accessed Information**: Dynamically binds to the increment-clicks function to store and accurately reflect the precise temporal point a link was last interacted with.

#### 3.4 Data Persistence
All complex datasets, relational user-ownership maps, configurations, and analytical clicks persist inherently through robust read-write wrappers targeting HTML5 Local Storage.

### 4. Verification & Testing Criteria (v2)
- **Login / Register Functionality**: New users can register and immediately log in. Evaluators can directly use the Login form with any username/password combination to trigger the Auto-Register flow.
- **Dashboard Tracking**: Successfully renders all required metrics (Original URL, Shortened URL, Active/Disabled Badges, Max Clicks vs Current Clicks).
- **Click Limits**: Shortening a mock URL with a limit of `1`, clicking it once successfully redirects. Clicking it a second time successfully traps the user against the "Link Expired" block.
- **Toggle Links**: Disabling the aforementioned link directly alters its transparency on the dashboard and completely blocks new resolutions, tossing "Link Inactive".
- **Destination Updation**: Using the "Edit" pencil icon allows modifying the destination; the next iteration correctly fires to the modified destination instead of the starting destination.
- **Important Constraint for Evaluators**: Since this application operates entirely in the browser using `localStorage` to simulate a backend, testing short links **must be done in a standard tab within the exact same browser profile**. Testing in an Incognito / Private window or an alternative browser will yield a "Link Not Found / 404" screen because isolated sessions do not have access to the Dashboard session's mock database.

### 5. Deployment
Available live on the linked GitHub repository structure.