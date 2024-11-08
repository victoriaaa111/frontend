# Changelog

---

## November 7, 2024

### What's New?

We have improved the design and made it easier for the user to navigate our platform.

### Why the Change?

This change is part of our ongoing efforts to improve the design and user friendliness of our platform.

- We have enhanced the **user friendliness** by improving design, adding a cabinet for the user to access their profile and history of orders, since before it was more tricky to access these pages.


---

## Specific Changes

### Added Cabinet for User

- We have added a cabinet for the user that they can access through the header of our site. When Accessing it they will be redirected to a menu.

![MyCabinet for User](./changelogPictures/mycabinetmenu.png)

### Added Menu for User

- The menu has 2 pages featured: user profile and orders. The User Profile page features information about the user, the Orders page features the user's history of orders.

![Menu for Users](./changelogPictures/usermenu.png)

### Added Orders Page for User

- We added the Orders page to showcase the history of the user's orders. There they can view existing orders both in a calendar and in a list. Moreover, they can see the details of each order: Start, End date, status. Moreover, they can leave review if the order's status is "Done".

![Order History page for Users](./changelogPictures/orderhistory.png)

### Redesigned Choose Role, Log In, and Sign Up

We have completely revamped the design for the Choose Role, Log In, and Sign Up pages to provide a more streamlined and user-friendly experience.

- **Choose Role**: The previous design was functional but felt cluttered. We have simplified the layout, making it easier for users to select their role with clear and distinct options.
- **Log In**: The Log In page now features a more modern and minimalistic look, reducing distractions and helping users focus on entering their credentials.
- **Sign Up**: The Sign Up form has been redesigned for better usability, featuring a cleaner layout and improved input fields for a smoother registration process.

| **Choose Role (Before)** | **Choose Role (After)** |
|--------------------------|-------------------------|
| <img src="./changelogPictures/chooserole1.png" width="700px"> | <img src="./changelogPictures/chooserole2.png" width="700px"> |

| **Sign Up (Before)**     | **Sign Up (After)**     |
|--------------------------|-------------------------|
| <img src="./changelogPictures/signup1.png" width="700px"> | <img src="./changelogPictures/signup2.png" width="700px"> |

| **Log In (Before)**      | **Log In (After)**      |
|--------------------------|-------------------------|
| <img src="./changelogPictures/login1.png" width="700px"> | <img src="./changelogPictures/login2.png" width="700px"> |

### Enhanced Search Bar Design

- We have redesigned the Search Order bar on the main page to offer a cleaner, more intuitive experience.

| **Search Bar (Before)**      | **Search Bar (After)**      |
|--------------------------|-------------------------|
| <img src="./changelogPictures/hero1.png" width="750px"> | <img src="./changelogPictures/hero2.png" width="900px"> |


## Fixes
### Fix Log In Sign Up button reappearing after each refresh

- The Log In and Sign Up buttons were reappearing instead of showing LogOut button after each refresh, even if the user was logged in. This was due to authentification state not being used properly. Fixed this and now the LogOut button stays after refresh.

![Log Out button remains in header as long as logged in](./changelogPictures/logout.png)