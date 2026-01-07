-- Library Management System Database
-- USN: 1AT24CS218
-- College: Atria Institute of Technology

-- Create Database
CREATE DATABASE IF NOT EXISTS atria_library;
USE atria_library;

--------------------------------------------------
-- STUDENTS TABLE
--------------------------------------------------
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    usn VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    department VARCHAR(30),
    semester INT,
    email VARCHAR(50),
    phone VARCHAR(15)
);

--------------------------------------------------
-- BOOKS TABLE
--------------------------------------------------
CREATE TABLE books (
    book_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(50),
    publisher VARCHAR(50),
    category VARCHAR(30),
    total_copies INT,
    available_copies INT
);

--------------------------------------------------
-- LIBRARIAN TABLE
--------------------------------------------------
CREATE TABLE librarian (
    librarian_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    email VARCHAR(50),
    phone VARCHAR(15)
);

--------------------------------------------------
-- ISSUE / TRANSACTIONS TABLE
--------------------------------------------------
CREATE TABLE issue_books (
    issue_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    book_id INT,
    issue_date DATE,
    due_date DATE,
    return_date DATE,
    status VARCHAR(15),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

--------------------------------------------------
-- FINE TABLE
--------------------------------------------------
CREATE TABLE fine (
    fine_id INT PRIMARY KEY AUTO_INCREMENT,
    issue_id INT,
    amount DECIMAL(6,2),
    paid_status VARCHAR(10),
    FOREIGN KEY (issue_id) REFERENCES issue_books(issue_id)
);

--------------------------------------------------
-- SAMPLE DATA INSERTION
--------------------------------------------------

-- Students
INSERT INTO students (usn, name, department, semester, email, phone) VALUES
('1AT20CS001', 'Rahul Sharma', 'CSE', 5, 'rahul@atria.edu', '9876543210'),
('1AT20EC015', 'Priya Kumar', 'ECE', 5, 'priya@atria.edu', '9876543211');

-- Books
INSERT INTO books (title, author, publisher, category, total_copies, available_copies) VALUES
('Data Structures & Algorithms', 'Cormen', 'McGraw Hill', 'Computer Science', 5, 3),
('Operating Systems', 'Silberschatz', 'Wiley', 'Computer Science', 4, 2),
('Digital Electronics', 'Morris Mano', 'Pearson', 'Electronics', 3, 3);

-- Librarian
INSERT INTO librarian (name, email, phone) VALUES
('Library Admin', 'library@atria.edu', '9876501234');

-- Issue Book
INSERT INTO issue_books (student_id, book_id, issue_date, due_date, status) VALUES
(1, 1, '2024-11-20', '2024-12-04', 'Issued');

--------------------------------------------------
-- SAMPLE QUERIES
--------------------------------------------------

-- View all books
SELECT * FROM books;

-- View all students
SELECT * FROM students;

-- View issued books
SELECT s.name, b.title, i.issue_date, i.due_date, i.status
FROM issue_books i
JOIN students s ON i.student_id = s.student_id
JOIN books b ON i.book_id = b.book_id;
