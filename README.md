# PScription
3-Tier Web Application wtih a Database Mangement System.
Our goal is to work towards the creation of an easy-to-use application that allows pharmacists,
patients and administrators to be connected and manage medical prescriptions so the work becomes
easier for pharmacists, and the quality of life of the patients improves. This project will try to make
managing orders simple for pharmacists. For patients they will be alerted with notifications and can see
the status of their medicine order.


# Information 
**Pscription Server**
Pscription uses a MySQL server that holds information containing users, roles, orders, and
notifications. By default, the database is called projectdb. Spring Data JPA is used to interact
with the MySQL Database.

 **User (Client)**
Regular Users (or Clients) are able to access a dashboard which contains their personal
information, as well as any new notifications from new Orders. Users are also able to see all their
past and present orders, as well as all the data related to them

 **Moderator (Pharmacist)**
Moderator Users (or Pharmacists) are able to access a dashboard which contains their personal
information as well as the role assigned to them. Moderators are also able to view all the Orders
in the database, modify or delete them. Finally, they are able to create new Orders and assign
them to a user.

 **Administrator**
Administrators has the highest level of access. They are able to see a list of all the Users in
the database (including Clients, Pharmacists and other Administrators), and they’re able to
update information on these users, delete them, or assign new roles to them. Administrators also
have full access to all the Orders functionality mentioned in the Moderator overview.

# Installation Guide
## Required Files

**Source Code:**
https://github.com/Kenithk/PScription

**Tools:**

**Mysql Workbench / Server**
https://dev.mysql.com/downloads/installer/

**Node.js**
https://nodejs.org/en/download/

**Postman**
https://www.postman.com/downloads/


**IDE :Visual Studio Code**
https://code.visualstudio.com/download

**Visual Studio Code Extensions:**

**ES7+ React/Redux/React-Native snippets**

**Extension Pack for Java**
