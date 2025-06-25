# Intelligent Scheduling System (ISS)
The Intelligent Scheduling System is a smart platform that automatically creates university timetables, taking care of all the complex scheduling decisions so you don't have to. Whether you're an administrator managing courses, a teacher setting your preferences, or a student checking your schedule, ISS makes academic scheduling simple and efficient.

## What This System Does

ISS replaces the traditional manual process of creating university schedules with an intelligent automated system. Instead of spending weeks trying to coordinate hundreds of courses, teachers, students, and rooms, the system uses advanced algorithms to generate optimal schedules in minutes.

The system considers everything from basic requirements (like making sure no teacher is scheduled in two places at once) to preferences (like a teacher preferring morning classes or avoiding long walks between buildings). It balances all these competing needs to create schedules that work for everyone.

## How It Works

### For Campus Administrators

As an administrator, you're in control of the entire scheduling process. The system provides a comprehensive dashboard where you can see key metrics about your institution's scheduling status, recent activity, and any issues that need attention.

Logging in as an admin directs to the admin dashboard, where key metrics are visualized and the admin gets to manage the schedule generation or data management.

*![][image2]*  

*![][image3]*  

*![][image4]![][image5]*

> **Data Management Made Simple**

The foundation of good scheduling is good data. ISS lets you import all your institutional information through simple CSV file uploads. You can bring in details about your departments, courses, teachers, students, and buildings all at once. The system validates everything as you upload it, catching errors early and suggesting fixes.

You don't need to worry about the order of uploads - the system is smart enough to understand relationships between different types of data. However, it will guide you through the optimal sequence to avoid dependency issues.

The system also provides downloadable templates for all file types, so you know exactly what format to use. If something goes wrong during upload, you'll get clear feedback about what needs to be fixed.

**Steps:**

1. Navigate to **Data Management \> CSV Upload**  
2. Choose the **Upload Files** tab  
3. Upload files in the correct order:  
   - Departments (required first)  
   - Courses, Teachers, Student Groups (can be uploaded in any order after departments)  
   - Students, Student Group Courses (upload last)

![][image6]

4. For each file type:  
   - Click "Choose CSV file" and select your file  
   - Add an optional description  
   - Click "Upload"

![][image7]

5. Monitor upload progress and validation results in the **Validation Results** tab

![][image8]

**Template Downloads:**

- Use the **Download Templates** tab to get sample CSV files  
- Templates show the required column structure

> **Building and Room Management**

Managing physical spaces is straightforward with ISS. You can add buildings with their floor layouts, then specify individual rooms with their capacity, type (lecture hall, lab, seminar room), and accessibility features. The system ensures courses are matched to appropriate room types - labs go to lab spaces, large lectures go to halls with sufficient capacity.

![][image10]

![][image13]

> **Course and Student Management**

Course setup includes all the details that matter for scheduling: how many sessions per week, duration, whether it's a lecture or lab, and which department it belongs to. Student group management handles the various cohorts taking courses, making sure everyone gets scheduled appropriately.

![][image12]

![][image15]

> **Schedule Generation - The Magic Happens**

When you're ready to create a schedule, simply click "Generate Schedule" and let the system work. You can name your schedule, review the data that will be used, and adjust advanced settings if needed (though the defaults work well for most institutions).

The system uses genetic algorithms - think of it as evolutionary computation that "breeds" better and better schedules over multiple generations. You can watch the progress in real-time as it optimizes your timetable, balancing hard requirements (no conflicts) with preferences (teacher availability, room preferences).

Generation typically takes just a few minutes, even for complex institutions with hundreds of courses. When complete, you can review the schedule, make it active for students and teachers to see, or generate additional alternatives to compare.

![][image16]

![][image17]

![][image20]

### For Teachers

Teachers have their own streamlined interface focused on setting preferences and viewing schedules. The system recognizes that teacher satisfaction is crucial for successful scheduling.

> **Setting Your Preferences**

The preference system is designed to be intuitive. You can click on time slots throughout the week to indicate when you prefer to teach, when you're not available, or when you have no preference. The system uses a simple color-coding system: green for preferred times, red for unavailable periods, and gray for neutral.

Room preferences let you specify which spaces you prefer to teach in. This is particularly valuable if you have specialized equipment needs or simply work better in certain environments.

You can also choose your schedule distribution preference - whether you'd rather have your classes spread throughout the week for better work-life balance, or concentrated into fewer days for more focused teaching blocks.

![][image22]

![][image23]

![][image24]

> **Viewing Your Schedule**

Once schedules are generated and activated, you see a clean, calendar-style view of your teaching assignments. Each class shows the course name, room location, and student group. The interface makes it easy to prepare for your day by showing exactly where you need to be and when.

*![][image25]*

*![][image26]*

### For Students

Students get a straightforward view of their academic schedule without any of the complexity involved in creating it.

> **Your Personal Timetable**

The student interface shows a weekly calendar view with all your classes clearly laid out. Each entry includes the course name, instructor, room location, and time. The system uses color-coding to help you quickly distinguish between different courses.

If there are any scheduling conflicts or issues, they're highlighted so you can contact your academic advisor. However, the intelligent scheduling system is designed to prevent such conflicts from occurring in the first place.

## Real-World Applications

### Managing Complex Institutions

ISS excels at handling the complexity of modern universities. Whether you're dealing with multiple campuses, shared resources between departments, or students taking courses across different programs, the system adapts to your institutional structure.

The constraint system understands real-world scheduling challenges. It knows that lab equipment might limit which rooms can host certain courses, that some teachers have research commitments that affect their availability, and that students in different programs might have varying schedule patterns.

### Accessibility and Inclusion

The system automatically considers accessibility requirements. If a student needs wheelchair-accessible classrooms, their courses are scheduled accordingly. If a teacher has mobility considerations, the system minimizes movement between distant buildings for consecutive classes.

### Optimizing Resource Usage

ISS helps institutions make the most of their physical resources. It can identify underutilized spaces and times, suggest when additional capacity might be needed, and help with long-term planning by showing scheduling trends and bottlenecks.

## Advanced Features

### Multiple Schedule Scenarios

Generate and compare different scheduling scenarios to see how various constraints and preferences affect the outcome. This is valuable for "what-if" planning and finding the best balance for your institution.

### Constraint Customization

While the system comes with intelligent defaults, administrators can adjust the relative importance of different scheduling factors. Maybe teacher preferences are paramount at your institution, or perhaps maximizing room utilization is the priority.

### Data Import Flexibility

The CSV import system is designed to work with data from various student information systems. The templates provide clear guidance, but the system can adapt to different data formats and structures.

## Getting the Best Results

### Quality Data In, Quality Schedule Out

The most important factor in good scheduling is accurate, complete data. Make sure course information includes all necessary details, teacher availability reflects real preferences and constraints, and room data accurately describes capacity and capabilities.

### Setting Realistic Constraints

While it's tempting to set very strict preferences, remember that scheduling is about finding the best balance among competing needs. The system works best when preferences are realistic and when there's some flexibility in requirements.

### Iterative Improvement

Don't expect perfection on the first try. Use the ability to generate multiple schedules to experiment with different constraint settings. Each iteration gives you insight into what works best for your specific situation.

### Planning Ahead

The system works most effectively when you have time to review and adjust. Start the scheduling process early enough to allow for refinements based on feedback from teachers and students.

## Troubleshooting Common Issues

### Data Import Problems

If CSV uploads fail, the validation results tab provides specific error messages. Common issues include missing required fields, invalid data formats, or references to non-existent entities (like a course referencing a department that wasn't imported).

### Schedule Generation Issues

If schedule generation fails or produces poor results, check that all required data is present and that constraints aren't overly restrictive. The system needs some flexibility to find good solutions.

### Performance Considerations

Large institutions with hundreds of courses may experience longer generation times. The system is designed to work within reasonable time limits, but very complex scenarios might benefit from breaking the problem into smaller pieces (like scheduling by department or semester).

From our testing, we've found that it was able to generate feasible schedules for 20 sections, with 900+ students and 170+ course items in less than 2 minutes (Tested using AAiT Pre-Engineering Stream data from 2024-2025). This performance is hardware dependent, so expect to see different results on different machines.

## Made it this far eh?

ISS represents a new approach to academic scheduling that combines computational intelligence with user-friendly design. By automating the complex optimization work, it frees administrators, teachers, and students to focus on teaching and learning rather than scheduling logistics.

The system continues to evolve based on user feedback and the needs of modern educational institutions. As universities become more complex and student needs more diverse, intelligent scheduling systems like ISS will become essential tools for effective academic management.

Whether you're managing a small department or a large university, ISS adapts to your needs and grows with your institution. The result is better schedules, happier stakeholders, and more time for what really matters in education.

<!-- Image References -->
[image2]: docs/images/img2.png
[image3]: docs/images/img3.png
[image4]: docs/images/img4.png
[image5]: docs/images/img5.png
[image6]: docs/images/img6.png
[image7]: docs/images/img7.png
[image8]: docs/images/img8.png
[image10]: docs/images/img10.png
[image11]: docs/images/img11.png
[image12]: docs/images/img12.png
[image13]: docs/images/img13.png
[image15]: docs/images/img15.png
[image16]: docs/images/img16.png
[image17]: docs/images/img17.png
[image20]: docs/images/img20.png
[image22]: docs/images/img22.png
[image23]: docs/images/img23.png
[image24]: docs/images/img24.png
[image25]: docs/images/img25.png
[image26]: docs/images/img26.png


