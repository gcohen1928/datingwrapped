Dating Wrapped Feature Definitions for Cursor

Overview
"Dating Wrapped" is a multi-user web app where users log dating stats, view calculated statistics, and generate a shareable animated slideshow. The app mimics an Excel-like interface for data entry, calculates fun stats, and outputs a slideshow or PDF with an artsy, animated design inspired by Spotify Wrapped. It is built using React, Next.js, Three.js for animations, Supabase for the backend, and deployed on Vercel.

Feature 1: User Authentication
Purpose: Securely manage user access.
Requirements:

Enable sign-up and login with email/password or Google OAuth.
Store minimal user data: user ID (required) and optional display name (for sharing). Implementation:
Use Supabase Auth for authentication.
Create /login and /signup pages with forms for email/password and a Google OAuth button.
On successful authentication, save the user ID in local storage or React context for session management.
Feature 2: Data Entry (Tabular Interface)
Purpose: Provide an Excel-like interface for users to log dating stats.
Requirements:

Build a responsive table with the following columns:
Person’s Name (text input, defaults to "Date #X" if blank)
Meeting Platform (dropdown: Tinder, Hinge, Bumble, IRL, etc.)
Number of Dates (integer input)
Total Cost (decimal input, e.g., 45.50)
Average Duration (decimal input, hours, e.g., 2.5)
Rating (1-5 star selector)
Outcome (dropdown: Ghosted, Relationship, Ongoing, Friends, etc.)
Notes (textarea)
Include an "Add Person" button to append new rows.
Ensure the table is scrollable on mobile devices. Implementation:
Use react-table to create an editable table with dynamic rows.
Manage table data in React state or context.
Apply Tailwind CSS for a clean, mobile-friendly layout.
Feature 3: Data Storage
Purpose: Persist user dating entries securely.
Requirements:

Create a Supabase table named dating_entries with the following columns:
id (UUID, primary key)
user_id (UUID, foreign key to auth.users)
person_name (text)
platform (text)
num_dates (integer)
total_cost (decimal)
avg_duration (decimal)
rating (integer)
outcome (text)
notes (text)
created_at (timestamp, default to current time)
Ensure data is private, accessible only to the authenticated user. Implementation:
Define the table in Supabase using SQL or the dashboard.
Use Supabase client to perform CRUD operations tied to the user’s ID.
Implement row-level security to restrict access based on user_id.
Feature 4: Stats Dashboard
Purpose: Visualize dating statistics with interactive 3D charts.
Requirements:

Calculate the following stats from the dating_entries table:
Total People Dated: Number of unique entries.
Total Dates: Sum of num_dates.
Total Cost: Sum of total_cost.
Average Cost per Person: total_cost ÷ number of people.
Most Frequent Platform: Platform with the highest count.
Success Rate: Percentage of outcomes as "Ongoing" or "Relationship".
Highest-Rated Person: Entry with the highest rating.
Longest Relationship: Inferred from avg_duration or notes.
Most Expensive Date: Highest total_cost.
Serial Dater Score: total_dates ÷ unique people.
Platform Diversity: Count of unique platforms.
Ghosting Rate: Percentage of "Ghosted" outcomes.
Date Frequency: total_dates ÷ months in time range.
Romantic ROI: total_cost ÷ number of successful outcomes.
Display stats using Three.js for 3D animations (e.g., spinning pie charts).
Add a time filter dropdown (e.g., "All Time," "2025"). Implementation:
Fetch data from Supabase and compute stats in a utility function.
Use @react-three/fiber to render 3D visualizations.
Feature 5: "Wrapped" Slideshow Output
Purpose: Generate a shareable, animated recap of dating stats.
Requirements:

Create a slideshow with the following slides:
Intro: "Your 2025 Dating Wrapped" (animated text + 3D hearts).
Total Stats: "X people, Y dates, $Z spent!"
Top Platform: "[Platform] with X% of your dates."
Best Date: "[Name], [Rating] stars!"
Superlative: "Most Extravagant: $[Cost] on [Name]."
Outro: "To more love in 2026!" (spinning stars).
Use Three.js for animations (e.g., 3D hearts, spinning stars).
Export as Google Slides (via API) or PDF (via jsPDF).
Generate a shareable link: datingwrapped.com/share/[unique_id]. Implementation:
Build a React component for the slideshow with animated transitions.
Store Wrapped data in Supabase with a unique ID for sharing.
Integrate Google Slides API or jsPDF for export.
Feature 6: Social Features
Purpose: Enable community engagement.
Requirements:

Show aggregate stats (opt-in): e.g., "Users averaged $20/date."
Add a share button to post to X or copy a link.
Create a leaderboard of top daters (anonymized or with display names). Implementation:
Query Supabase for opt-in aggregate data.
Implement a share function for X or clipboard.
Build a leaderboard page sorting by total_dates.
Feature 7: Settings
Purpose: Give users control over their data.
Requirements:

Allow editing or deleting table rows.
Provide a CSV export option.
Include a toggle for Wrapped privacy (private or shareable). Implementation:
Add edit/delete buttons per row in the table.
Use PapaParse to generate CSV from table data.
Save privacy toggle in Supabase or local storage.
Tech Stack

Frontend: React + Next.js (SSR, routing) + Three.js (animations).
Backend: Supabase (Auth + PostgreSQL) + Next.js API routes.
Styling: Tailwind CSS (pastel colors: pink, mint, lavender).
Deployment: Vercel.
Libraries:
react-table: For the tabular interface.
Google Slides API or jsPDF: For slideshow output.
@react-three/fiber: For Three.js integration.
PapaParse: For CSV export.
Design Notes

Colors: Pastels (pink, mint, lavender) with gradients.
Animations: 3D hearts, spinning stars, floating bubbles via Three.js.
Typography: Playful fonts like Comic Neue or Poppins.
Graphics: Hand-drawn icons (hearts, coffee cups).
Vibe: Bold transitions like Spotify Wrapped with a soft Pinterest aesthetic.
Execution Tips for Cursor

Begin with User Authentication to establish user access.
Next, implement Data Entry for the core input system.
Set up Data Storage to save data securely.
Develop Stats Dashboard for visualization.
Build "Wrapped" Slideshow as the key output.
Add Social Features and Settings for refinement.
Each feature includes specific requirements to guide implementation. Focus on one feature at a time, testing thoroughly before proceeding.