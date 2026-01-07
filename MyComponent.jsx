<>
import React, { useState, useEffect } from 'react';
import { Calendar, Book, Users, Clock, CheckCircle, AlertCircle, Search, Plus, X, BookOpen } from 'lucide-react';

export default function LibraryManagement() {
  // State Management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data States
  const [books, setBooks] = useState([
    { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '9780262033848', category: 'Computer Science', available: true, copies: 3 },
    { id: 2, title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', category: 'Programming', available: true, copies: 2 },
    { id: 3, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '9780201616224', category: 'Programming', available: false, copies: 1 }
  ]);
  
  const [students, setStudents] = useState([
    { id: 1, name: 'Rajesh Kumar', usn: 'CS101', department: 'Computer Science', email: 'rajesh@example.com', phone: '9876543210' },
    { id: 2, name: 'Priya Sharma', usn: 'EC102', department: 'Electronics', email: 'priya@example.com', phone: '9876543211' },
    { id: 3, name: 'Amit Patel', usn: 'ME103', department: 'Mechanical', email: 'amit@example.com', phone: '9876543212' }
  ]);
  
  const [transactions, setTransactions] = useState([
    { id: 1, studentId: 1, bookId: 3, issueDate: '2024-12-15', dueDate: '2025-01-15', returnDate: null, status: 'issued' },
    { id: 2, studentId: 2, bookId: 1, issueDate: '2024-12-20', dueDate: '2025-01-20', returnDate: null, status: 'issued' },
  ]);

  const [formData, setFormData] = useState({});

  // Current Date
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Calculations
  const stats = {
    totalBooks: books.reduce((sum, book) => sum + book.copies, 0),
    availableBooks: books.filter(book => book.available).reduce((sum, book) => sum + book.copies, 0),
    totalStudents: students.length,
    overdueBooks: transactions.filter(t => {
      if (t.returnDate) return false;
      const due = new Date(t.dueDate);
      return due < new Date();
    }).length
  };

  // Helper Functions
  const getStudent = (id) => students.find(s => s.id === id);
  const getBook = (id) => books.find(b => b.id === id);

  const getTransactionStatus = (transaction) => {
    if (transaction.returnDate) return 'returned';
    const due = new Date(transaction.dueDate);
    if (due < new Date()) return 'overdue';
    return 'issued';
  };

  const openModal = (type) => {
    setModalType(type);
    setFormData({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({});
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddBook = () => {
    const newBook = {
      id: books.length + 1,
      title: formData.title,
      author: formData.author,
      isbn: formData.isbn,
      category: formData.category,
      available: true,
      copies: parseInt(formData.copies) || 1
    };
    setBooks([...books, newBook]);
    closeModal();
  };

  const handleAddStudent = () => {
    const newStudent = {
      id: students.length + 1,
      name: formData.name,
      usn: formData.usn,
      department: formData.department,
      email: formData.email,
      phone: formData.phone
    };
    setStudents([...students, newStudent]);
    closeModal();
  };

  const handleIssueBook = () => {
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const newTransaction = {
      id: transactions.length + 1,
      studentId: parseInt(formData.studentId),
      bookId: parseInt(formData.bookId),
      issueDate: issueDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      returnDate: null,
      status: 'issued'
    };

    // Update book availability
    const updatedBooks = books.map(book => 
      book.id === parseInt(formData.bookId) 
        ? { ...book, available: false } 
        : book
    );

    setTransactions([...transactions, newTransaction]);
    setBooks(updatedBooks);
    closeModal();
  };

  const handleReturnBook = (transactionId) => {
    const returnDate = new Date().toISOString().split('T')[0];
    const transaction = transactions.find(t => t.id === transactionId);
    
    const updatedTransactions = transactions.map(t =>
      t.id === transactionId ? { ...t, returnDate, status: 'returned' } : t
    );

    const updatedBooks = books.map(book =>
      book.id === transaction.bookId ? { ...book, available: true } : book
    );

    setTransactions(updatedTransactions);
    setBooks(updatedBooks);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.usn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modal Content
  const renderModalContent = () => {
    switch (modalType) {
      case 'book':
        return (
          <div className="modal-form">
            <input
              type="text"
              name="title"
              placeholder="Book Title"
              value={formData.title || ''}
              onChange={handleInputChange}
              className="form-input"
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={formData.author || ''}
              onChange={handleInputChange}
              className="form-input"
            />
            <input
              type="text"
              name="isbn"
              placeholder="ISBN"
              value={formData.isbn || ''}
              onChange={handleInputChange}
              className="form-input"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category || ''}
              onChange={handleInputChange}
              className="form-input"
            />
            <input
              type="number"
              name="copies"
              placeholder="Number of Copies"
              value={formData.copies || ''}
              onChange={handleInputChange}
              className="form-input"
            />
            <button onClick={handleAddBook} className="submit-btn">Add Book</button>
          </div>
        );
      
      case 'student':
        return (
          <div className="modal-form">
            <input
              type="text"
              name="name"
              placeholder="Student Name"
              value={formData.name || ''}
              onChange={handleInputChange}
              className="form-input"
            />
            <input
              type="text"
              name="usn"
              placeholder="USN"
              value={formData.usn || ''}
              onChange={handleInputChange}
              className="form-input"
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department || ''}
              onChange={handleInputChange}
              className="form-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email || ''}
              onChange={handleInputChange}
              className="form-input"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              className="form-input"
            />
            <button onClick={handleAddStudent} className="submit-btn">Add Student</button>
          </div>
        );
      
      case 'issue':
        return (
          <div className="modal-form">
            <select
              name="studentId"
              value={formData.studentId || ''}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.usn})
                </option>
              ))}
            </select>
            <select
              name="bookId"
              value={formData.bookId || ''}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select Book</option>
              {books.filter(book => book.available).map(book => (
                <option key={book.id} value={book.id}>
                  {book.title} by {book.author}
                </option>
              ))}
            </select>
            <button onClick={handleIssueBook} className="submit-btn">Issue Book</button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="library-system">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .library-system {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding-bottom: 2rem;
        }

        /* Header */
        .header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 1.5rem 0;
          animation: slideDown 0.6s ease-out;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .logo-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 28px;
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .header-text h1 {
          font-size: 1.8rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .header-text p {
          color: #6b7280;
          font-size: 0.95rem;
          margin-top: 0.25rem;
          font-weight: 500;
        }

        .date-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        /* Navigation */
        .navigation {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          margin: 1.5rem 0;
          border-radius: 16px;
          padding: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          animation: fadeIn 0.8s ease-out 0.2s both;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nav-tabs {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .nav-tab {
          flex: 1;
          min-width: 150px;
          padding: 1rem 1.5rem;
          background: transparent;
          border: 2px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          color: #6b7280;
          transition: all 0.3s ease;
        }

        .nav-tab:hover {
          background: rgba(102, 126, 234, 0.05);
          color: #667eea;
        }

        .nav-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        /* Main Content */
        .main-content {
          animation: fadeIn 0.8s ease-out 0.4s both;
        }

        .tab-content {
          display: none;
        }

        .tab-content.active {
          display: block;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          animation: scaleIn 0.5s ease-out both;
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
        }

        .stat-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.95rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-icon {
          font-size: 3rem;
          opacity: 0.15;
        }

        .stat-card.blue .stat-icon { color: #667eea; }
        .stat-card.green .stat-icon { color: #10b981; }
        .stat-card.orange .stat-icon { color: #f59e0b; }
        .stat-card.red .stat-icon { color: #ef4444; }

        /* Card */
        .card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        /* Toolbar */
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 250px;
          max-width: 400px;
        }

        .search-box svg {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          width: 20px;
          height: 20px;
        }

        .search-box input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .search-box input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        /* Table */
        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        thead {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        thead th {
          padding: 1rem;
          text-align: left;
          color: white;
          font-weight: 600;
          font-size: 0.95rem;
        }

        thead th:first-child {
          border-top-left-radius: 12px;
        }

        thead th:last-child {
          border-top-right-radius: 12px;
        }

        tbody tr {
          border-bottom: 1px solid #f3f4f6;
          transition: background 0.2s ease;
        }

        tbody tr:hover {
          background: #f9fafb;
        }

        tbody td {
          padding: 1rem;
          color: #374151;
        }

        /* Books Grid */
        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .book-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          animation: scaleIn 0.5s ease-out both;
        }

        .book-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
        }

        .book-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .book-author {
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .book-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .book-detail {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }

        .book-detail-label {
          color: #6b7280;
        }

        .book-detail-value {
          color: #1f2937;
          font-weight: 500;
        }

        .book-status {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .book-status.available {
          background: #d1fae5;
          color: #065f46;
        }

        .book-status.unavailable {
          background: #fee2e2;
          color: #991b1b;
        }

        /* Status Badges */
        .status-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .status-badge.issued {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-badge.overdue {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-badge.returned {
          background: #d1fae5;
          color: #065f46;
        }

        /* Action Button */
        .action-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: #5568d3;
          transform: translateY(-2px);
        }

        .action-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
          transform: none;
        }

        /* Modal */
        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.3s ease-out;
        }

        .modal.open {
          display: flex;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .close-btn {
          background: #f3f4f6;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #e5e7eb;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .submit-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            text-align: center;
          }

          .logo-section {
            flex-direction: column;
          }

          .header-text h1 {
            font-size: 1.5rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            max-width: 100%;
          }

          .books-grid {
            grid-template-columns: 1fr;
          }

          .nav-tabs {
            flex-direction: column;
          }

          .nav-tab {
            min-width: 100%;
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">
                <BookOpen />
              </div>
              <div className="header-text">
                <h1>INSTITUTE OF TECHNOLOGY</h1>
                <p>LIBRARY MANAGEMENT SYSTEM</p>
              </div>
            </div>
            <div className="date-badge">
              <Calendar size={20} />
              <span>{currentDate}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="navigation">
        <div className="container">
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <BookOpen size={20} />
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-tab ${activeTab === 'books' ? 'active' : ''}`}
              onClick={() => setActiveTab('books')}
            >
              <Book size={20} />
              <span>Books</span>
            </button>
            <button
              className={`nav-tab ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <Users size={20} />
              <span>Students</span>
            </button>
            <button
              className={`nav-tab ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              <Clock size={20} />
              <span>Transactions</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Dashboard Tab */}
          <div className={`tab-content ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-content">
                  <div>
                    <p className="stat-label">Total Books</p>
                    <p className="stat-value">{stats.totalBooks}</p>
                  </div>
                  <Book className="stat-icon" />
                </div>
              </div>
              <div className="stat-card green">
                <div className="stat-content">
                  <div>
                    <p className="stat-label">Available</p>
                    <p className="stat-value">{stats.availableBooks}</p>
                  </div>
                  <CheckCircle className="stat-icon" />
                </div>
              </div>
              <div className="stat-card orange">
                <div className="stat-content">
                  <div>
                    <p className="stat-label">Students</p>
                    <p className="stat-value">{stats.totalStudents}</p>
                  </div>
                  <Users className="stat-icon" />
                </div>
              </div>
              <div className="stat-card red">
                <div className="stat-content">
                  <div>
                    <p className="stat-label">Overdue</p>
                    <p className="stat-value">{stats.overdueBooks}</p>
                  </div>
                  <AlertCircle className="stat-icon" />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="card-title">Recent Transactions</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Book</th>
                      <th>Issue Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 5).map(transaction => {
                      const student = getStudent(transaction.studentId);
                      const book = getBook(transaction.bookId);
                      const status = getTransactionStatus(transaction);
                      return (
                        <tr key={transaction.id}>
                          <td>{student?.name}</td>
                          <td>{book?.title}</td>
                          <td>{transaction.issueDate}</td>
                          <td>{transaction.dueDate}</td>
                          <td>
                            <span className={`status-badge ${status}`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Books Tab */}
          <div className={`tab-content ${activeTab === 'books' ? 'active' : ''}`}>
            <div className="toolbar">
              <div className="search-box">
                <Search />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn-primary" onClick={() => openModal('book')}>
                <Plus size={20} />
                <span>Add Book</span>
              </button>
            </div>
            <div className="books-grid">
              {filteredBooks.map((book, index) => (
                <div key={book.id} className="book-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-details">
                    <div className="book-detail">
                      <span className="book-detail-label">ISBN:</span>
                      <span className="book-detail-value">{book.isbn}</span>
                    </div>
                    <div className="book-detail">
                      <span className="book-detail-label">Category:</span>
                      <span className="book-detail-value">{book.category}</span>
                    </div>
                    <div className="book-detail">
                      <span className="book-detail-label">Copies:</span>
                      <span className="book-detail-value">{book.copies}</span>
                    </div>
                  </div>
                  <span className={`book-status ${book.available ? 'available' : 'unavailable'}`}>
                    {book.available ? 'Available' : 'Issued'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Students Tab */}
          <div className={`tab-content ${activeTab === 'students' ? 'active' : ''}`}>
            <div className="toolbar">
              <div className="search-box">
                <Search />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn-primary" onClick={() => openModal('student')}>
                <Plus size={20} />
                <span>Add Student</span>
              </button>
            </div>
            <div className="card">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>USN</th>
                      <th>Department</th>
                      <th>Email</th>
                      <th>Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.usn}</td>
                        <td>{student.department}</td>
                        <td>{student.email}</td>
                        <td>{student.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Transactions Tab */}
          <div className={`tab-content ${activeTab === 'transactions' ? 'active' : ''}`}>
            <div className="toolbar">
              <h2 className="section-title">All Transactions</h2>
              <button className="btn-primary" onClick={() => openModal('issue')}>
                <Plus size={20} />
                <span>Issue Book</span>
              </button>
            </div>
            <div className="card">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Book</th>
                      <th>Issue Date</th>
                      <th>Due Date</th>
                      <th>Return Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(transaction => {
                      const student = getStudent(transaction.studentId);
                      const book = getBook(transaction.bookId);
                      const status = getTransactionStatus(transaction);
                      return (
                        <tr key={transaction.id}>
                          <td>{student?.name}</td>
                          <td>{book?.title}</td>
                          <td>{transaction.issueDate}</td>
                          <td>{transaction.dueDate}</td>
                          <td>{transaction.returnDate || '-'}</td>
                          <td>
                            <span className={`status-badge ${status}`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <button
                              className="action-btn"
                              onClick={() => handleReturnBook(transaction.id)}
                              disabled={transaction.returnDate !== null}
                            >
                              Return
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      <div className={`modal ${modalOpen ? 'open' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>
              {modalType === 'book' && 'Add New Book'}
              {modalType === 'student' && 'Add New Student'}
              {modalType === 'issue' && 'Issue Book'}
            </h3>
            <button className="close-btn" onClick={closeModal}>
              <X size={20} />
            </button>
          </div>
          <div className="modal-body">
            {renderModalContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
</>