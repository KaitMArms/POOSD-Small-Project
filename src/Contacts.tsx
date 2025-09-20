import { useState, useEffect } from 'react'
import './Contacts.css'

interface Contact {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface SearchResponse {
  results: Contact[];
  error: string;
}

interface EditResponse {
  message: string;
  error: string;
}

interface DeleteResponse {
  message: string;
  error: string;
}

interface AddResponse {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  userId: number;
  error: string;
}

function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  // Get userId from localStorage or URL params
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    } else {
      // If no userId in localStorage, redirect to login
      window.location.href = '/';
    }
  }, []);

  // Load contacts when userId is available
  useEffect(() => {
    if (userId) {
      loadContacts();
    }
  }, [userId]);

  // Filter contacts based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [contacts, searchTerm]);

  const loadContacts = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://luisalban.xyz/LAMPAPI/SearchContacts.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          search: '', // Empty search to get all contacts
          userId: userId
        })
      });

      const data: SearchResponse = await response.json();
      
      if (data.error === '') {
        setContacts(data.results);
        setMessage('');
      } else {
        setMessage('Error loading contacts: ' + data.error);
        setContacts([]);
      }
    } catch (err) {
      console.error('Error loading contacts:', err);
      setMessage('Server error. Please try again.');
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://luisalban.xyz/LAMPAPI/SearchContacts.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          search: searchTerm,
          userId: userId
        })
      });

      const data: SearchResponse = await response.json();
      
      if (data.error === '') {
        setContacts(data.results);
        setMessage('');
      } else {
        setMessage('No contacts found matching your search.');
        setContacts([]);
      }
    } catch (err) {
      console.error('Error searching contacts:', err);
      setMessage('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async () => {
    if (!userId) return;

    // Input validation
    if (!addForm.firstName || !addForm.lastName || !addForm.phone || !addForm.email) {
      setMessage('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('https://luisalban.xyz/LAMPAPI/AddContact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: addForm.firstName,
          lastName: addForm.lastName,
          phone: addForm.phone,
          email: addForm.email,
          userId: userId
        })
      });

      const data: AddResponse = await response.json();
      
      if (data.error === '') {
        setMessage('Contact added successfully!');
        setShowAddForm(false);
        setAddForm({ firstName: '', lastName: '', phone: '', email: '' });
        loadContacts(); // Reload contacts
      } else {
        setMessage('Error adding contact: ' + data.error);
      }
    } catch (err) {
      console.error('Error adding contact:', err);
      setMessage('Server error. Please try again.');
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setEditForm({
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone,
      email: contact.email
    });
  };

  const handleSaveEdit = async () => {
    if (!userId || !editingContact) return;

    try {
      const updates: any = {};
      
      // Only include fields that have changed
      if (editForm.firstName !== editingContact.firstName) {
        updates.firstName = editForm.firstName;
      }
      if (editForm.lastName !== editingContact.lastName) {
        updates.lastName = editForm.lastName;
      }
      if (editForm.phone !== editingContact.phone) {
        updates.phone = editForm.phone;
      }
      if (editForm.email !== editingContact.email) {
        updates.email = editForm.email;
      }

      if (Object.keys(updates).length === 0) {
        setMessage('No changes made.');
        setEditingContact(null);
        return;
      }

      const response = await fetch('https://luisalban.xyz/LAMPAPI/EditContacts.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          search: {
            firstName: editingContact.firstName,
            lastName: editingContact.lastName
          },
          userId: userId,
          updates: updates
        })
      });

      const data: EditResponse = await response.json();
      
      if (data.error === '') {
        setMessage('Contact updated successfully!');
        setEditingContact(null);
        loadContacts(); // Reload contacts
      } else {
        setMessage('Error updating contact: ' + data.error);
      }
    } catch (err) {
      console.error('Error updating contact:', err);
      setMessage('Server error. Please try again.');
    }
  };

  const handleDelete = async (contact: Contact) => {
    if (!userId) return;

    const confirmed = window.confirm(
      `Are you sure? Deleting ${contact.firstName} ${contact.lastName} cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch('https://luisalban.xyz/LAMPAPI/DeleteContact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: contact.firstName,
          lastName: contact.lastName,
          userId: userId
        })
      });

      const data: DeleteResponse = await response.json();
      
      if (data.error === '') {
        setMessage('Contact deleted successfully!');
        loadContacts(); // Reload contacts
      } else {
        setMessage('Error deleting contact: ' + data.error);
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
      setMessage('Server error. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.location.href = '/';
  };

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="contacts-container">
      <div className="contacts-header">
        <h1>Contact Manager</h1>
        <div className="header-actions">
          <button onClick={() => setShowAddForm(true)} className="add-btn">
            ➕ Add Contact
          </button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="contacts-list">
        {isLoading ? (
          <div className="loading">Loading contacts...</div>
        ) : filteredContacts.length === 0 ? (
          <div className="no-contacts">No contacts found.</div>
        ) : (
          filteredContacts.map((contact, index) => (
            <div key={index} className="contact-item">
              <div className="contact-info">
                <div className="contact-name">
                  {contact.firstName} {contact.lastName}
                </div>
                <div className="contact-details">
                  <div>📞 {contact.phone}</div>
                  <div>📧 {contact.email}</div>
                </div>
              </div>
              <div className="contact-actions">
                <button 
                  onClick={() => handleEdit(contact)}
                  className="edit-btn"
                  title="Edit contact"
                >
                  ⚙️
                </button>
                <button 
                  onClick={() => handleDelete(contact)}
                  className="delete-btn"
                  title="Delete contact"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddForm && (
        <div className="add-modal">
          <div className="add-form">
            <h3>Add New Contact</h3>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                value={addForm.firstName}
                onChange={(e) => setAddForm({...addForm, firstName: e.target.value})}
                placeholder="Enter first name"
              />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                value={addForm.lastName}
                onChange={(e) => setAddForm({...addForm, lastName: e.target.value})}
                placeholder="Enter last name"
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="text"
                value={addForm.phone}
                onChange={(e) => setAddForm({...addForm, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            <div className="form-actions">
              <button onClick={handleAddContact} className="save-btn">Add Contact</button>
              <button onClick={() => setShowAddForm(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {editingContact && (
        <div className="edit-modal">
          <div className="edit-form">
            <h3>Edit Contact</h3>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                value={editForm.firstName}
                onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                value={editForm.lastName}
                onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              />
            </div>
            <div className="form-actions">
              <button onClick={handleSaveEdit} className="save-btn">Save</button>
              <button onClick={() => setEditingContact(null)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Contacts
