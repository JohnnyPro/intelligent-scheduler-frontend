# Intelligent Scheduling System - User Manual

## Table of Contents
1. [Getting Started](#getting-started)
2. [Admin User Guide](#admin-user-guide)
3. [Teacher User Guide](#teacher-user-guide)
4. [Student User Guide](#student-user-guide)
5. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Logging In

1. Open the application in your web browser
2. Enter your email and password
3. Click the "Sign In" button

*[Screenshot: Login page showing email/password fields and sign in button]*

**Note:** Contact your system administrator if you don't have login credentials.

---

## Admin User Guide

### Dashboard Overview

After logging in as an admin, you'll see the main dashboard with:
- System overview and key metrics
- Current active schedule information
- System alerts and notifications
- Quick action buttons
- Schedule generation history

*[Screenshot: Admin dashboard showing metrics, alerts, and quick actions]*

### Data Management

#### 1. CSV Data Upload

**Purpose:** Import institutional data like courses, teachers, and classrooms.

**Steps:**
1. Navigate to **Data Management > CSV Upload**
2. Choose the **Upload Files** tab
3. Upload files in the correct order:
   - Departments (required first)
   - Courses, Teachers, Student Groups (can be uploaded in any order after departments)
   - Students, Student Group Courses (upload last)

*[Screenshot: CSV upload page showing file upload interface with dependency order]*

4. For each file type:
   - Click "Choose CSV file" and select your file
   - Add an optional description
   - Click "Upload"

*[Screenshot: Individual file upload showing file selection and description fields]*

5. Monitor upload progress and validation results in the **Validation Results** tab

*[Screenshot: Validation results showing successful uploads and any errors]*

**Template Downloads:**
- Use the **Download Templates** tab to get sample CSV files
- Templates show the required column structure

*[Screenshot: Template download page showing available templates]*

#### 2. Managing Buildings

**Steps:**
1. Go to **Data Management > Buildings**
2. **To add a building:**
   - Click "Add Building"
   - Enter building name and number of floors
   - Click "Create Building"

*[Screenshot: Buildings page with add building dialog open]*

3. **To edit or delete:**
   - Use the edit/delete buttons in the Actions column

*[Screenshot: Buildings table showing edit and delete buttons]*

#### 3. Managing Courses

**Steps:**
1. Navigate to **Data Management > Courses**
2. **To add a course:**
   - Click "Add Course"
   - Fill in course details (name, code, department, etc.)
   - Select session type (Lecture/Lab)
   - Set sessions per week and ECTS credits
   - Click "Create Course"

*[Screenshot: Course creation dialog with all fields filled]*

3. **Filter and search:**
   - Use the search bar to find specific courses
   - Filter by department or session type

*[Screenshot: Courses page showing search and filter options]*

#### 4. Managing Classrooms

**Steps:**
1. Go to **Data Management > Classrooms**
2. **To add a classroom:**
   - Click "Add Classroom"
   - Enter classroom details (name, capacity, building, floor)
   - Select classroom type (Lecture/Lab/Seminar)
   - Set opening and closing times
   - Check "Wheelchair Accessible" if applicable
   - Click "Create Classroom"

*[Screenshot: Classroom creation dialog showing all fields]*

#### 5. Managing Other Data

Follow similar patterns for:
- **Departments:** Basic department information
- **Student Groups:** Group details with department assignment
- **Teachers:** Teacher information with department assignment
- **Users:** User accounts with role assignments

*[Screenshot: Example of one additional data management page]*

### Schedule Generation

#### Creating a New Schedule

**Steps:**
1. Navigate to **Schedule > Generate**
2. **Basic Settings:**
   - Enter a descriptive schedule name
   - Review data preview to ensure all required data is available

*[Screenshot: Schedule generation basic settings tab]*

3. **Advanced Settings (Optional):**
   - Adjust mutation and crossover rates
   - Set time limits and fitness thresholds
   - Most users can use default values

*[Screenshot: Advanced settings tab with algorithm parameters]*

4. **Review Constraints:**
   - Hard constraints (must be satisfied)
   - Soft constraints (preferred but not required)

*[Screenshot: Constraints tab showing hard and soft constraints]*

5. Click "Start Generation" to begin the scheduling process

*[Screenshot: Generation in progress or completion message]*

### Schedule Management

#### Viewing and Managing Schedules

**Steps:**
1. Go to **Schedule > View**
2. **Select a schedule:**
   - Use the dropdown to choose from available schedules
   - Green dot indicates the currently active schedule

*[Screenshot: Schedule selection dropdown showing active and inactive schedules]*

3. **Schedule actions:**
   - **Activate:** Make a schedule the current active one
   - **Delete:** Remove a schedule permanently
   - View schedule details in the calendar

*[Screenshot: Schedule view with activate/delete buttons and calendar]*

4. **Calendar view:**
   - See all scheduled classes by day and time
   - Different colors represent different courses or rooms

*[Screenshot: Weekly schedule calendar view]*

---

## Teacher User Guide

### Teacher Dashboard

After logging in as a teacher, you'll see:
- Your schedule overview
- Quick links to set preferences
- Recent announcements

*[Screenshot: Teacher dashboard layout]*

### Setting Constraints and Preferences

#### Time Preferences

**Steps:**
1. Navigate to **Constraints**
2. **Set time preferences:**
   - Click on time slots you prefer to teach
   - Green = Preferred, Red = Not available, Gray = No preference
   - Use "Select All" or "Clear All" for quick selection

*[Screenshot: Time preference grid showing different colored time slots]*

#### Room Preferences

**Steps:**
1. In the same **Constraints** page, scroll to room preferences
2. **Select preferred rooms:**
   - Choose specific rooms you prefer to teach in
   - Set accessibility requirements if needed

*[Screenshot: Room preferences section with checkboxes for different rooms]*

#### Schedule Distribution

**Steps:**
1. Choose your preferred schedule distribution:
   - **Spread out:** Classes distributed throughout the week
   - **Condensed:** Classes grouped together on fewer days

*[Screenshot: Schedule distribution options with radio buttons]*

2. Click "Save Preferences" to apply your constraints

*[Screenshot: Save preferences button and confirmation message]*

### Viewing Your Schedule

**Steps:**
1. Navigate to **Schedule**
2. View your assigned classes in calendar format
3. See details like:
   - Course name and code
   - Room assignment
   - Student group
   - Time and duration

*[Screenshot: Teacher schedule calendar view showing assigned classes]*

---

## Student User Guide

### Viewing Your Schedule

**Steps:**
1. Log in with your student credentials
2. Navigate to **Schedule**
3. View your class schedule showing:
   - Course names
   - Instructors
   - Room locations
   - Times and dates

*[Screenshot: Student schedule view with course details]*

**Schedule features:**
- Weekly calendar view
- Color-coded courses
- Room and instructor information
- Time conflict highlighting (if any)

*[Screenshot: Detailed view of student schedule with different course colors]*

---

## Troubleshooting

### Common Issues

#### Login Problems
- **Forgot password:** Contact your system administrator
- **Account locked:** Wait 15 minutes or contact admin
- **Wrong credentials:** Double-check email and password

#### CSV Upload Issues
- **File format errors:** Ensure file is in CSV format with correct columns
- **Validation failures:** Check the validation results tab for specific errors
- **Dependencies:** Upload files in the correct order (departments first)

*[Screenshot: Example of validation error messages]*

#### Schedule Generation Issues
- **Generation fails:** Ensure all required data is uploaded and valid
- **Poor quality results:** Try adjusting advanced settings or adding more constraints
- **Long processing time:** Large datasets may take several minutes

#### Performance Issues
- **Slow loading:** Check your internet connection
- **Page not responding:** Refresh the browser
- **Data not updating:** Try logging out and back in

### Getting Help

- Contact your system administrator for technical issues
- Report bugs or feature requests through your institution's IT support
- Check with your department for training resources

### System Requirements

- **Browser:** Chrome, Firefox, Safari, or Edge (latest versions)
- **Internet:** Stable internet connection required
- **Screen:** Minimum 1024x768 resolution recommended
- **JavaScript:** Must be enabled

---

## Appendix

### User Roles Summary

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: data management, schedule generation, user management |
| **Teacher** | Set constraints, view own schedule, limited dashboard access |
| **Student** | View own schedule only |

### Data Upload Order

1. **Departments** (required first)
2. **Buildings** (optional, can be uploaded anytime)
3. **Courses** (requires departments)
4. **Teachers** (requires departments)
5. **Classrooms** (requires buildings if using building references)
6. **Student Groups** (requires departments)
7. **Students** (requires student groups)
8. **Student Group Courses** (requires courses and student groups)

### Support Contacts

- **Technical Support:** [Insert IT support contact]
- **Training:** [Insert training contact]
- **Account Issues:** [Insert admin contact]

---

*Last updated: [Current Date]*
*Version: 1.0*
