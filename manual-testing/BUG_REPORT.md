BUG REPORT – Starterkit Photo Gallery App

Application: https://demo.baasic.com/angular/starterkit-photo-gallery/main
Test Type: Manual, Exploratory
Tester: Katarina Culap
Date: March 2026

Environment:
- Browser: Google Chrome (latest)
- OS: Windows


1. HOME PAGE & GALLERY
_________________________

# BUG-001 

- Title: Infinite image loading prevents access to footer
- Severity: Medium
- Priority: Medium
- Description: While scrolling through the gallery feed, images keep loading and the footer cannot be reached.
- Steps to Reproduce:
1. Open the Home page
2. Click the scroll icon to load the images
3. Scroll down for several seconds
4. Try reaching the footer
- Expected Result: The user should be able to scroll to the bottom of the page and see footer.
- Actual Result: New images keep loading and the footer never becomes visible.
- Attachments: screenshots/bug_001.mp4


# BUG-002

- Title: Gallery state not preserved after closing image
- Severity: Medium
- Priority: High
- Description: After opening an image and closing it, the gallery resets and the previous scroll position is lost.
- Steps to Reproduce:
1. Open the Home page
2. Click the scroll icon to load the gallery feed
3. Scroll and open any image
4. Close the image by clicking button "X"
- Expected Result: The user should return to the same position in the gallery.
- Actual Result: The app returns to the Home page and scroll position is lost.
- Attachments: screenshots/bug_002.mp4


# BUG-003 

- Title: Non-functional footer link
- Severity: Low
- Priority: Low
- Description: The "Blog name" link in the footer looks clickable but does not navigate anywhere.
- Steps to Reproduce:
1. Scroll to the footer
2. Click the "Blog name" link
- Expected Result: The link should open a valid page.
- Actual Result: No action occurs (href="javascript:void(0);").
- Attachments: screenshots/bug_003.mp4


# BUG-004

- Title: Image alignment inconsistent on mobile view
- Severity: Low
- Priority: Medium
- Description: Some images in the mobile view appear slightly shifted to the left instead of being centered.
- Steps to Reproduce:
1. Open mobile view
2. Click on the search input field and enter "cat299"
3. Open any displayed image to view its details
4. Observe the responsiveness and alignment of the image
- Expected Result: All images should be centered, and all pages should be responsive across various devices.
- Actual Result: Some images appear misaligned on certain devices (e.g., Samsung Galaxy S20 Ultra)
- Attachments: screenshots/screenshot_bug_004


# BUG-005

- Title: Scroll icon not functioning on mobile device
- Severity: High
- Priority: High
- Description: The scroll icon on the Home page does not respond on mobile devices, making it impossible to load the gallery images.
- Steps to Reproduce:
1. Open mobile view
2. Go to the Home page
3. Tap the scroll icon to load images
- Expected Result: The gallery feed loads and images are displayed.
- Actual Result: On some devices (e.g. Honor 90) the gallery cannot be displayed and the scroll icon does not respond.
- Attachments: screenshots/bug_005.mp4


2. SEARCH FUNCTIONALITY
_____________________________

# BUG-006

- Title: Search input breaks routing when entering "/"
- Severity: Medium
- Priority: Medium
- Description: Entering "/" in the search field causes the app to navigate to an invalid route.
- Steps to Reproduce:
1. Open the Home page
2. Enter "/" in the search field
3. Submit
- Expected Result: Special characters should be handled safely.
- Actual Result: The app redirects to a 404 page.
- Attachments: screenshots/bug_006.mp4


# BUG-007

- Title: Search with whitespace input causes API error and frontend crash  
- Severity: High  
- Priority: High  
- Description: Entering only whitespace in the search input triggers a backend 400 (Bad Request) response. The frontend does not handle the error response properly and attempts to access undefined data, resulting in a runtime TypeError and component failure.
- Steps to Reproduce:
1. Open Home page  
2. Click on search input  
3. Enter a single whitespace character (" ")  
4. Submit search  
- Expected Result: Whitespace input should be validated on frontend and ignored or handled with a proper validation message. Application should not send invalid API requests and should not crash.
- Actual Result: API request is sent with searchQuery=%20 and returns 400 (Bad Request). Frontend fails to handle the response and throws runtime error: "Cannot read properties of undefined (reading 'item')".
- Attachments: screenshots/bug_007.mp4


3. NAVIGATION & MENU
_________________________

# BUG-008 

– Title: Closing menu redirects user to Home page
- Severity: High
- Priority: High
- Description: Closing the menu always redirects the user to the Home page, even if they were on another page.
- Steps to Reproduce:
1. Open the menu
2. Navigate to the Login page
3. Open the menu again
4. Close menu by clicking "X" or anywhere on the background overlay
- Expected Result: The menu closes and the user stays on the same (login) page.
- Actual Result: The app redirects to the Home page.
- Attachments: screenshots/bug_008.mp4


4. LOGIN, REGISTRATION & PASSWORD RECOVERY
______________________________________________

# BUG-009 

- Title: Social login buttons not functioning  
- Severity: High  
- Priority: High  
- Description: All social login buttons display a configuration error and do not initiate the authentication process.
- Steps to Reproduce:
1. Open Menu  
2. Navigate to Login page  
3. Click any social login button (e.g. Facebook, Google, GitHub)
- Expected Result: Clicking a social login button should start the authentication process or redirect to the respective provider login flow.
- Actual Result: Error message is displayed: "Social login configuration not found." and no authentication process is initiated.
- Attachments: screenshots/bug_009.mp4


# BUG-010

- Title: Password reset link redirects to 404 page  
- Severity: High  
- Priority: High  
- Description: The password reset email is successfully sent, but the reset link inside the email redirects to a 404 page instead of the password reset form.
- Steps to Reproduce:
1. Click Menu and navigate to Login page  
2. Click "Forgot Your Password? Recover Your Password Here!"  
3. Enter email "test.user@mailinator.com"  
4. Click "Recover password" button  
5. Open received email  
6. Click on password reset link  
- Expected Result: The password reset link should redirect the user to the password reset form page where a new password can be set.
- Actual Result: The password reset email is sent successfully, but clicking the link redirects to a 404 page.
- Attachments: screenshots/screenshot_bug_010.png


# BUG-011 

- Title: Incorrect validation message for invalid email format
- Severity: Medium
- Priority: Medium
- Description: Entering an invalid email format returns message "Unknown user" instead of a proper validation message.
- Steps to Reproduce:
1. Click Menu and navigate to Login page  
2. Click "Forgot Your Password? Recover Your Password Here!"  
3. Enter "test@test"  
4. Click "Recover password" button  
- Expected Result: A message indicating invalid email format.
- Actual Result: Wrong message "Unknown user" is displayed
- Attachments: screenshots/screenshot_bug_011.png


# BUG-012 

- Title: Registration form becomes unresponsive after interacting with Confirm Password field  
- Severity: High  
- Priority: High  
- Description: After interacting with the "Confirm Password" input field, the registration form stops responding correctly. The "Register" button becomes non-functional and no validation or submission is triggered.
- Steps to Reproduce:
1. Open Menu and navigate to Registration page  
2. Click on the "Confirm Password" input field  
3. Fill in the registration form with valid data:
   - Email: "test.user@mailinator.com"  
   - Username: "kculap"  
   - Password: "password"  
   - Confirm Password: [test credentials]  
4. Click the "Register" button  
5. Navigate to home page and click menu agai
- Expected Result: The form should either submit successfully or display appropriate validation messages.
- Actual Result: The "Register" button does not trigger any action (no submission, no validation), and the form becomes unresponsive.
- Attachments: screenshots/bug_012.mp4

# BUG-013 

- Title: "Add profile image" icon appears interactive but has no functionality
- Severity: Low
- Priority: Medium
- Description: The "+" icon above the registration form visually suggests that users can add a profile image. However, clicking the icon does not trigger any action, and the interface does not clarify whether profile image upload is supported.
- Steps to Reproduce:
1. Open the menu and navigate to the registration page
2. Click the "+" icon above the form
- Expected Result: Either a file upload dialog opens, or the UI clearly indicates that profile image upload is not available.
- Actual Result: Nothing happens when clicking the icon, leaving the intended purpose unclear.
- Attachments: screenshots/screenshot_bug_013.png


# BUG-014

- Title: No user feedback when registering with an invalid email
- Severity: Medium
- Priority: High
- Description: When an invalid email is entered, the frontend accepts it as valid, but the backend rejects the request. The user receives no visible feedback, so it appears as if the Register button is unresponsive.
- Steps to Reproduce:
1. Click the menu and navigate to the Registration page
2. In the email field enter "test@test"
3. Set username to "kculap", password to "password" and confirm password to "password"
4. Click the Register button
- Expected Result: A clear validation message indicating that the email format is invalid.
- Actual Result: The form does not submit and no feedback is shown, while the backend returns a 400 error.
- Attachments: screenshots/bug_014.mp4


5. ALBUMS & IMAGE UPLOAD
___________________________

# BUG-015

- Title: Some album images fail to open (404)
- Severity: High
- Priority: High
- Description: While some images open normally, certain uploaded images in the album view fail to load and redirect to a 404 page.
- Steps to Reproduce:
1. Click the menu and navigate to the Login page
2. Log in with username "kculap" and password "password"
3. Click the "Create album" button
4. Set the album name to "Croatian Handball" and click the "Save Album" button
5. Click the upload field for the cover image and upload an image from the following URL: "https://www.tportal.hr/media/thumbnail/988x593/2651183.jpeg?cropId=3889175"
6. Set the photo name to "dlivakovic"
7. Click the "Upload" button
8. Click on the uploaded photo to open the album
9. Click the "Upload" button to upload a photo inside the album
10. Upload the same image as the cover at least three times and set the photo names to "dlivakovic1", "dlivakovic2", "dlivakovic3"
11. When the images are uploaded, click on each image to expand it
- Expected Result: All selected images open in detail view.
- Actual Result: Specific images redirect to a 404 page instead of opening.
- Attachments: screenshots/bug_015.mp4


# BUG-016

- Title: Image count not updated after deletion
- Severity: Medium
- Priority: High
- Description: After deleting an image, the image count does not update until the page is refreshed.
- Steps to Reproduce:
1. Click the menu and navigate to the Login page
2. Log in with username "kculap" and password "password"
3. Click the "Create album" button
4. Set the album name to "Croatian Handball" and click the "Save Album" button
5. Click the upload field for the cover image and upload an image from the following URL: "https://www.tportal.hr/media/thumbnail/988x593/2651183.jpeg?cropId=3889175"
6. Set the photo name to "dlivakovic"
7. Click the "Upload" button
8. Click on the uploaded photo to open the album
9. Click the "Upload" button to upload a photo inside the album
10. Upload the same image as the cover at least three times and set the photo names to "dlivakovic1", "dlivakovic2", "dlivakovic3"
11. When the images are uploaded, hover over each image and delete it by clicking the delete option in the bottom-right corner
12. Observe the image count
- Expected Result: The image count updates immediately after each deletion.
- Actual Result: The image count does not change after deleting images and only updates after refreshing the page.
- Attachments: screenshots/bug_016.mp4


# BUG-017

- Title: Large image upload fails with incorrect validation message
- Severity: High
- Priority: High
- Description: Uploading a large image (20MB+) is rejected by the backend, but the UI displays an incorrect validation message that is unrelated to file size.
- Steps to Reproduce:
1. Click the menu and navigate to the Login page
2. Log in with username "kculap" and password "password"
3. Click the "Create album" button
4. Set the album name to "Croatian Handball" and click the "Save Album" button
5. Click the upload field for the cover image
6. Select a large image file (20MB or more) 
7. Attempt to upload the file
8. Observe the displayed validation message 
- Expected Result: A clear validation error indicating that the file exceeds the maximum allowed size.
- Actual Result: The upload fails and the message "Name already taken" is shown.
- Attachments: screenshots/screenshot_bug_017.png


# BUG-018 

- Title: Incorrect validation for long image name
- Severity: Medium
- Priority: Medium
- Description: Entering very long values in the image Name field triggers an incorrect validation message that is unrelated to input length.
- Steps to Reproduce:
1. Click the menu and navigate to the Login page
2. Log in with username "kculap" and password "password"
3. Click the "Create album" button
4. Set the album name to "Croatian Handball" and click the "Save Album" button
5. Click the upload field for the cover image and upload an image from the following URL: "https://www.tportal.hr/media/thumbnail/988x593/2651183.jpeg?cropId=3889175"
6. Set the photo name to "dlivakovic"
7. Click the "Upload" button
8. Click on the uploaded photo to open the album
9. Click the "Upload" button to upload a photo inside the album
10. Upload the same image as the cover
11. In the "Name" field, enter an excessively long string (1000-word Lorem Ipsum)
12. Click the "Upload" button
13. Observe the validation message
- Expected Result: A clear validation error indicating that the name exceeds the maximum allowed length.
- Actual Result: The message "Name already exists" is shown, even though the issue is caused by input length.
- Attachments: screenshots/


# BUG_019

- Title: Long image descriptions not displayed after saving
- Severity: Medium
- Priority: Medium
- Description: Long descriptions can be saved without validation, but the image detail view does not display them. Instead, the message "No description available" appears, even though a description was provided.
- Steps to Reproduce:
1. Click the menu and navigate to the Login page
2. Log in with username "kculap" and password "password"
3. Click the "Create album" button
4. Set the album name to "Croatian Handball" and click the "Save Album" button
5. Click the upload field for the cover image and upload an image from the following URL: "https://www.tportal.hr/media/thumbnail/988x593/2651183.jpeg?cropId=3889175"
6. Set the photo name to "dlivakovic"
7. Click the "Upload" button
8. Click on the uploaded photo to open the album
9. Click the "Upload" button to upload a photo inside the album
10. Upload the same image as the cover
11. In the "Name" field, enter "livakovic"
12. In the "Description" field, enter an excessively long string (e.g., 1000-word Lorem Ipsum)
13. Click the "Upload" button
14. Find the image in the album and click on it to open the detail view
15. Check the displayed description
- Expected Result: The entered description is displayed under the image.
- Actual Result: The detail view shows "No description available" which occurs specifically when a long description is used.
- Attachments: screenshots/bug_019.mp4


# BUG-020 

- Title: Emoji characters not supported in album/image title
- Severity: Medium
- Priority: Medium
- Description: When an emoji is used as the image title, it does not display correctly. Instead, the "No available name" is shown.
- Steps to Reproduce:
1. Click the menu and navigate to the Login page
2. Log in with username "kculap" and password "password"
3. Click the "Create album" button
4. Set the album name to "Croatian Handball" and click the "Save Album" button
5. Click the upload field for the cover image and upload an image from the following URL: "https://www.tportal.hr/media/thumbnail/988x593/2651183.jpeg?cropId=3889175"
6. Set the photo name to "dlivakovic"
7. Click the "Upload" button
8. Click on the uploaded photo to open the album
9. Click the "Upload" button to upload a photo inside the album
10. Upload the same image as the cover
11. In the "Name" and "Description" fields, enter an emoji "🔥"
12. Click the "Upload" button
13. Find the image in the album and click on it to open the detail view
- Expected Result: Emoji characters entered in the Name and Description fields are displayed correctly on the image and album views.
- Actual Result: The image uploads successfully, but the detail view displays "No available name" instead of the emoji.
- Attachments: screenshots/bug_020.mp4



# BUG-021

- Title: Special characters in image name cause 409 Conflict
- Severity: Medium
- Priority: Medium
- Description: Using special characters ("#$%&/()=?*") in the image Name field causes a 409 Conflict response and triggers an incorrect validation message.
- Steps to Reproduce:
1. Click the menu and navigate to the Login page
2. Log in with username "kculap" and password "password"
3. Click the "Create album" button
4. Set the album name to "Croatian Handball" and click the "Save Album" button
5. Click the upload field for the cover image and upload an image from the following URL: "https://www.tportal.hr/media/thumbnail/988x593/2651183.jpeg?cropId=3889175"
6. Set the photo name to "dlivakovic"
7. Click the "Upload" button
8. Click on the uploaded photo to open the album
9. Click the "Upload" button to upload a photo inside the album
10. Upload the same image as the cover
11. In the "Name" field, enter a combination of special characters "#$%&/()=?*"
12. Click the "Upload" button
13. Observe the error message displayed in the UI
- Expected Result: The system should either accept special characters or display a clear validation error indicating they are not allowed.
- Actual Result: The upload fails with a 409 Conflict, and the page incorrectly shows the message "Name already taken."
- Attachments: screenshots/screenshot_bug_021.png


# BUG-022

- Title: Deleted image still visible on Home page (intermittent)
- Severity: Medium
- Priority: Medium
- Description: After deleting an image from an album, the image sometimes remains visible on the Home page. The issue occurs intermittently and cannot be consistently reproduced.
- Steps to Reproduce:
1. Click the menu and navigate to the Login page
2. Log in with username "kculap" and password "password"
3. Create a new album or open an existing one
4. Upload several images to the album
5. Delete the uploaded images one by one
6. Return to the Home page
7. Observe whether any deleted images are still displayed
- Expected Result: Deleted images should be removed immediately from all views, including the Home page.
- Actual Result: In some cases, a deleted image remains visible on the Home page even though it no longer exists in the album. The issue occurs sporadically and could not be reproduced consistently afterward.
- Attachments: 


# BUG-023

- Title: Pressing Enter in the Album Name field navigates back instead of saving
- Severity: Medium
- Priority: Medium
- Description: When entering text in the Album Name field and pressing the Enter key, the application navigates back to the previous page instead of creating the album. 
- Steps to Reproduce:
1. Click the menu and navigate to the Login page
2. Log in with username "kculap" and password "password"
3. Click the "Create album" button
4. In the "Album name" field, type "Croatian Handball"
5. Press the Enter key on the keyboard
6. Observe the page behavior
- Expected Result: Pressing Enter should trigger album creation or move the cursor to the next input field.
- Actual Result: Pressing Enter in the Album Name field navigates back to the previous page instead of creating the album or moving to the next field.
- Attachments: screenshots/bug_023.mp4